/**
 * Prepares a v2 project's media: hash each source in `assets/`, probe it,
 * then copy or convert it into `public/generated-media/<hash>/` and record
 * everything in `media.lock.json`. Originals are never moved or modified.
 *
 * - Idempotent: an unchanged source whose prepared copy exists is reused.
 * - A source whose bytes differ from the lock is refused unless
 *   `acceptChanges` is set, so a wrong file restored on another laptop is
 *   caught instead of silently re-locked.
 * - `check` mode re-hashes and reports without writing anything.
 */
import {createHash} from "node:crypto";
import {copyFileSync, createReadStream, existsSync, mkdirSync, renameSync, statSync, writeFileSync} from "node:fs";
import path from "node:path";
import type {AssetSpec} from "../../src/engine/assets";
import type {ProjectV2} from "../../src/engine/project-schema";
import {classify, conversionArgs, summarize, type ProbeSummary} from "./classify";
import {readLock, serializeLock, type LockEntry, type MediaLock} from "./lock";
import type {FfprobeResult} from "./remotion-tools";

export type MediaTools = {
  ffprobe: (file: string) => FfprobeResult;
  ffmpeg: (args: string[]) => void;
  versions: () => {remotion: string; ffmpeg: string};
};

export type PrepareOptions = {
  project: ProjectV2;
  lockPath: string;
  assetsRoot: string;
  publicDir: string;
  mode: "write" | "check";
  acceptChanges?: boolean;
  tools: MediaTools;
};

export type AssetReport = {id: string; outcome: "reused" | "copied" | "converted" | "verified"; notes: string[]};

export type PrepareResult = {lock: MediaLock | null; reports: AssetReport[]; errors: string[]};

export const sha256File = (file: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    createReadStream(file).on("data", (chunk) => hash.update(chunk)).on("error", reject).on("end", () => resolve(hash.digest("hex")));
  });

const NO_RIGHTS_NOTE = "no rights row in project; owner's standing cleared-assets statement applies (assets/LICENSES.md)";

const preparedDir = (sha: string) => `generated-media/${sha.slice(0, 16)}`;
const toPublicPath = (publicDir: string, relative: string) => path.join(publicDir, ...relative.split("/"));

const preparedFileOk = (publicDir: string, entry: LockEntry) => {
  const file = toPublicPath(publicDir, entry.prepared.path);
  return existsSync(file) && statSync(file).size === entry.prepared.bytes;
};

const probeOf = (tools: MediaTools, asset: AssetSpec, file: string): FfprobeResult | null => {
  if (asset.kind === "font") return null;
  try {
    return tools.ffprobe(file);
  } catch {
    return null;
  }
};

const toLockProbe = (summary: ProbeSummary): LockEntry["probe"] => ({...summary});

export const prepareProject = async (options: PrepareOptions): Promise<PrepareResult> => {
  const {project, lockPath, assetsRoot, publicDir, mode, tools} = options;
  const previous = readLock(lockPath);
  const errors: string[] = [];
  const reports: AssetReport[] = [];
  if (previous && previous.projectId !== project.id) {
    return {lock: null, reports, errors: [`${lockPath} belongs to project "${previous.projectId}", not "${project.id}"`]};
  }

  const entries: Record<string, LockEntry> = {};
  for (const asset of project.assets) {
    const source = path.join(assetsRoot, ...asset.path.split("/"));
    const label = `assets.${asset.id} (${asset.path})`;
    if (!existsSync(source)) {
      errors.push(`${label}: source file not found in assets/`);
      continue;
    }
    const sha = await sha256File(source);
    const bytes = statSync(source).size;
    const prior = previous?.assets[asset.id];
    const rights = asset.rights ?? null;

    if (prior && prior.sha256 !== sha && !options.acceptChanges) {
      errors.push(`${label}: source changed since it was locked (${prior.sha256.slice(0, 12)} -> ${sha.slice(0, 12)}); restore the original or re-run with --accept-changes`);
      continue;
    }

    if (mode === "check") {
      if (!prior) errors.push(`${label}: not in media.lock.json; run prepare`);
      else if (!preparedFileOk(publicDir, prior)) errors.push(`${label}: prepared copy missing or altered; run prepare`);
      else reports.push({id: asset.id, outcome: "verified", notes: []});
      continue;
    }

    if (prior && prior.sha256 === sha && preparedFileOk(publicDir, prior)) {
      const notes = [...prior.notes.filter((note) => note !== NO_RIGHTS_NOTE), ...(rights ? [] : [NO_RIGHTS_NOTE])];
      entries[asset.id] = {...prior, path: asset.path, kind: asset.kind, rights, notes};
      reports.push({id: asset.id, outcome: "reused", notes});
      continue;
    }

    const classification = classify(asset.kind, probeOf(tools, asset, source), project.fps);
    if (classification.action === "reject") {
      errors.push(`${label}: ${classification.reasons.join("; ")}`);
      continue;
    }

    const dir = preparedDir(sha);
    mkdirSync(toPublicPath(publicDir, dir), {recursive: true});
    const baseName = path.basename(source);
    const notes = [...classification.notes];
    if (!asset.rights) notes.push(NO_RIGHTS_NOTE);

    if (classification.action === "copy") {
      const relative = `${dir}/${baseName}`;
      const target = toPublicPath(publicDir, relative);
      const pending = `${target}.partial`;
      copyFileSync(source, pending);
      renameSync(pending, target);
      entries[asset.id] = {
        path: asset.path, kind: asset.kind, sha256: sha, bytes, status: "ready",
        probe: toLockProbe(classification.summary),
        prepared: {path: relative, bytes: statSync(target).size, recipe: null},
        notes, rights,
      };
      reports.push({id: asset.id, outcome: "copied", notes});
      continue;
    }

    const recipe = conversionArgs(classification);
    const relative = `${dir}/${path.parse(baseName).name}.prepared.mp4`;
    const target = toPublicPath(publicDir, relative);
    const pending = `${target}.partial.mp4`;
    tools.ffmpeg(["-i", source, ...recipe, pending]);
    renameSync(pending, target);
    // The lock describes the file the renderer reads, so probe the result.
    const converted = summarize(tools.ffprobe(target));
    entries[asset.id] = {
      path: asset.path, kind: asset.kind, sha256: sha, bytes, status: "converted",
      probe: toLockProbe(converted),
      prepared: {path: relative, bytes: statSync(target).size, recipe},
      notes: [...classification.reasons.map((r) => `converted: ${r}`), ...notes],
      rights,
    };
    reports.push({id: asset.id, outcome: "converted", notes: entries[asset.id].notes});
  }

  if (errors.length > 0 || mode === "check") return {lock: previous, reports, errors};
  const lock: MediaLock = {version: 1, projectId: project.id, tools: tools.versions(), assets: entries};
  mkdirSync(path.dirname(lockPath), {recursive: true});
  writeFileSync(lockPath, serializeLock(lock));
  return {lock, reports, errors};
};
