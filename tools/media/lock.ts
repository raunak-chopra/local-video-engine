/**
 * `media.lock.json` sits next to a v2 `project.json` and is tracked in Git.
 * It records which exact source files the project was prepared from (SHA-256),
 * their probed facts and rights, and the prepared copy the renderer reads.
 * Media itself is never committed: on another machine the originals are
 * restored separately, checked against these hashes and prepared again.
 */
import {existsSync, readFileSync, statSync} from "node:fs";
import path from "node:path";
import {z} from "zod";
import {mediaMapSchema, type MediaMap} from "../../src/engine/assets";
import type {ProjectV2} from "../../src/engine/project-schema";

const lockEntrySchema = z.strictObject({
  path: z.string(),
  kind: z.enum(["video", "image", "audio", "font"]),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  bytes: z.number().int().nonnegative(),
  status: z.enum(["ready", "converted"]),
  probe: z.strictObject({
    durationSec: z.number().nullable(),
    videoStartSec: z.number(),
    width: z.number().nullable(),
    height: z.number().nullable(),
    rotation: z.number(),
    fps: z.number().nullable(),
    variableFrameRate: z.boolean(),
    videoCodec: z.string().nullable(),
    audioCodec: z.string().nullable(),
    hasAudio: z.boolean(),
  }),
  prepared: z.strictObject({
    /** Relative to `public/`, forward slashes. */
    path: z.string().startsWith("generated-media/"),
    bytes: z.number().int().nonnegative(),
    /** ffmpeg arguments used for a conversion; null for a plain copy. */
    recipe: z.array(z.string()).nullable(),
  }),
  notes: z.array(z.string()),
  rights: z
    .strictObject({source: z.string(), itemId: z.string().optional(), license: z.string().optional(), notes: z.string().optional()})
    .nullable(),
});

/** v2 added `videoStartSec`. No v1 lock was ever committed, so there is no migration. */
export const MEDIA_LOCK_VERSION = 2;

export const mediaLockSchema = z.strictObject({
  version: z.literal(MEDIA_LOCK_VERSION),
  projectId: z.string(),
  tools: z.strictObject({remotion: z.string(), ffmpeg: z.string()}),
  assets: z.record(z.string(), lockEntrySchema),
});

export type MediaLock = z.infer<typeof mediaLockSchema>;
export type LockEntry = z.infer<typeof lockEntrySchema>;

export const lockPathFor = (projectPath: string) => path.join(path.dirname(projectPath), "media.lock.json");

export const readLock = (lockPath: string): MediaLock | null => {
  if (!existsSync(lockPath)) return null;
  const raw = JSON.parse(readFileSync(lockPath, "utf8"));
  if (raw?.version !== MEDIA_LOCK_VERSION) throw new Error(`${lockPath} uses lock format ${raw?.version}; delete it and run prepare again (sources are re-hashed, nothing is lost).`);
  const parsed = mediaLockSchema.safeParse(raw);
  if (!parsed.success) throw new Error(`${lockPath} is not a valid media lock: ${parsed.error.issues[0]?.message}`);
  return parsed.data;
};

/** Stable JSON: sorted asset keys so re-running prepare produces no Git diff. */
export const serializeLock = (lock: MediaLock): string => {
  const assets = Object.fromEntries(Object.keys(lock.assets).sort().map((id) => [id, lock.assets[id]]));
  return `${JSON.stringify({...lock, assets}, null, 2)}\n`;
};

/**
 * Builds the props-side media map for rendering. Cheap by design: it checks
 * that every asset is locked and its prepared copy exists at the recorded
 * size, without re-hashing sources (`prepare --check` does that).
 */
export const mediaMapFromLock = (project: ProjectV2, lock: MediaLock | null, publicDir: string): MediaMap => {
  const issues: string[] = [];
  const map: MediaMap = {};
  if (project.assets.length > 0 && !lock) issues.push("no media.lock.json; run: video prepare <project.json>");
  if (lock && lock.projectId !== project.id) issues.push(`media.lock.json belongs to "${lock.projectId}", not "${project.id}"`);
  for (const asset of project.assets) {
    const entry = lock?.assets[asset.id];
    if (!lock) break;
    if (!entry) { issues.push(`assets.${asset.id}: not prepared; run prepare`); continue; }
    if (entry.path !== asset.path || entry.kind !== asset.kind) { issues.push(`assets.${asset.id}: project path/kind changed since prepare; run prepare`); continue; }
    const prepared = path.join(publicDir, ...entry.prepared.path.split("/"));
    if (!existsSync(prepared) || statSync(prepared).size !== entry.prepared.bytes) {
      issues.push(`assets.${asset.id}: prepared copy missing or altered (${entry.prepared.path}); run prepare`);
      continue;
    }
    map[asset.id] = {
      kind: entry.kind,
      src: entry.prepared.path,
      durationSec: entry.probe.durationSec,
      videoStartSec: entry.probe.videoStartSec,
      width: entry.probe.width,
      height: entry.probe.height,
      rotation: entry.probe.rotation,
      fps: entry.probe.fps,
      hasAudio: entry.probe.hasAudio,
    };
  }
  if (issues.length > 0) throw new Error(`Media not ready:\n${issues.map((i) => `  - ${i}`).join("\n")}`);
  return mediaMapSchema.parse(map);
};
