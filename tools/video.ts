/** Local runner. In PowerShell use npm.cmd run video -- ... (npm.ps1 drops flags). */
import {randomUUID, createHash} from "node:crypto";
import {existsSync, mkdirSync, readFileSync, renameSync, writeFileSync} from "node:fs";
import {createRequire} from "node:module";
import path from "node:path";
import type {MediaMap} from "../src/engine/assets";
import {parseProject, type Project} from "../src/engine/project-schema";
import {resolveTimeline} from "../src/engine/resolve-timeline";
import {parseOptions} from "./cli-options";
import {lockPathFor, mediaMapFromLock, readLock} from "./media/lock";
import {prepareProject} from "./media/prepare";
import {ffmpeg, ffmpegVersion, ffmpegVersionTag, ffprobe, remotion, root} from "./media/remotion-tools";

const require = createRequire(import.meta.url);
const assetsRoot = path.join(root, "assets");
const publicDir = path.join(root, "public");

/** v2 projects render from prepared media; v1 projects have none. */
const mediaFor = (project: Project, projectPath: string): MediaMap | undefined =>
  project.version === 2 ? mediaMapFromLock(project, readLock(lockPathFor(projectPath)), publicDir) : undefined;

const main = async () => {
  const {command, input, flags, frame} = parseOptions(process.argv.slice(2));
  for (const key of ["frame", "canvas", "out", "log", "port", "check", "accept-changes"]) {
    if (process.env[`npm_config_${key.replace("-", "_")}`] && !(key in flags)) throw new Error(`npm consumed --${key}; use npm.cmd run video -- ... or invoke tools/video.ts directly.`);
  }
  if (command === "doctor") {
    remotion(["versions"]);
    console.log(remotion(["ffprobe", "-version"], true).split(/\r?\n/)[0]);
    console.log(ffmpegVersion());
    console.log("Local Remotion media tools available. PowerShell: use npm.cmd, not npm.ps1, for flags.");
    return;
  }
  if (command === "probe") {
    console.log(JSON.stringify(ffprobe(path.resolve(input)), null, 2));
    return;
  }

  const projectPath = path.resolve(input);
  const raw = JSON.parse(readFileSync(projectPath, "utf8"));
  if (flags.canvas) raw.canvas = flags.canvas;
  const project = parseProject(raw);
  if (command === "prepare") {
    if (project.version !== 2) throw new Error("prepare needs a version 2 project with an assets list.");
    const check = flags.check === "true";
    const result = await prepareProject({
      project, lockPath: lockPathFor(projectPath), assetsRoot, publicDir,
      mode: check ? "check" : "write",
      acceptChanges: flags["accept-changes"] === "true",
      tools: {ffprobe, ffmpeg, versions: () => ({remotion: require("remotion/package.json").version, ffmpeg: ffmpegVersionTag()})},
    });
    for (const report of result.reports) {
      console.log(`  ${report.id.padEnd(22)} ${report.outcome.padEnd(9)} ${report.notes.join("; ")}`);
    }
    if (result.errors.length > 0) throw new Error(`${check ? "Check" : "Prepare"} failed:\n${result.errors.map((e) => `  - ${e}`).join("\n")}`);
    console.log(check ? `Verified ${result.reports.length} assets against ${lockPathFor(projectPath)}` : `Wrote ${lockPathFor(projectPath)}`);
    return;
  }

  const media = mediaFor(project, projectPath);
  const timeline = resolveTimeline(project, media);
  if (command === "still" && frame >= timeline.durationInFrames) throw new Error(`--frame ${frame} is outside 0-${timeline.durationInFrames - 1}`);
  console.log(`OK ${project.id}: ${timeline.width}x${timeline.height} @ ${timeline.fps}fps, ${timeline.durationInFrames} frames, ${timeline.scenes.length} scenes${media ? `, ${Object.keys(media).length} prepared assets` : ""}`);
  if (command === "validate") return;

  if (command === "studio") {
    // Opens Remotion Studio on this project with its prepared media, so a reel
    // can be scrubbed and previewed. The props file is rewritten on each launch.
    const studioProps = path.join(root, "out", project.id, "studio-props.json");
    mkdirSync(path.dirname(studioProps), {recursive: true});
    writeFileSync(studioProps, JSON.stringify({project, ...(media ? {media} : {})}, null, 2));
    console.log(`Studio: open the ProjectAd composition. Props: ${studioProps}`);
    remotion(["studio", "src/index.ts", `--props=${studioProps}`, ...(flags.port ? [`--port=${flags.port}`] : []), ...(flags["no-open"] ? ["--no-open"] : [])]);
    return;
  }

  const runId = `${Date.now()}-${randomUUID().slice(0, 8)}`;
  const runDir = path.join(root, "out", project.id, runId);
  mkdirSync(runDir, {recursive: true});
  const suffix = command === "still" ? `frame-${frame}.png` : "video.mp4";
  const output = flags.out ? path.resolve(flags.out) : path.join(runDir, suffix);
  if (existsSync(output)) throw new Error(`Output already exists; choose a new --out: ${output}`);
  if (!output.toLowerCase().endsWith(command === "still" ? ".png" : ".mp4")) throw new Error("still output must be .png; render output must be .mp4");
  mkdirSync(path.dirname(output), {recursive: true});
  const pending = path.join(path.dirname(output), `${path.basename(output, path.extname(output))}.incomplete-${runId}${path.extname(output)}`);
  const propsPath = path.join(runDir, "props.json");
  writeFileSync(propsPath, JSON.stringify({project, ...(media ? {media} : {})}, null, 2));
  const recordPath = path.join(runDir, "record.json");
  const record = {status: "incomplete", command, runId, projectPath, projectHash: createHash("sha256").update(JSON.stringify(project)).digest("hex"), propsPath, output, pending, frame: command === "still" ? frame : null, width: timeline.width, height: timeline.height, fps: timeline.fps, durationInFrames: timeline.durationInFrames, remotion: require("remotion/package.json").version, zod: require("zod/package.json").version, node: process.version, elapsedMs: 0, error: "", media: null as unknown};
  writeFileSync(recordPath, JSON.stringify(record, null, 2));
  const started = Date.now();
  try {
    remotion([command, "src/index.ts", "ProjectAd", pending, `--props=${propsPath}`, ...(command === "still" ? [`--frame=${frame}`] : ["--codec=h264", "--pixel-format=yuv420p", "--image-format=png"]), ...(flags.log ? [`--log=${flags.log}`] : [])]);
    if (!existsSync(pending)) throw new Error("Renderer reported success without an output file");
    if (command === "render") {
      const metadata = ffprobe(pending);
      const video = metadata.streams?.find((s) => s.codec_type === "video");
      if (!video || video.width !== timeline.width || video.height !== timeline.height || video.pix_fmt !== "yuv420p") throw new Error("Export dimensions or pixel format failed verification");
      const rate = String(video.avg_frame_rate).split("/").map(Number);
      const duration = Number(video.duration ?? metadata.format?.duration);
      if (!Number.isFinite(rate[0] / rate[1]) || Math.abs(rate[0] / rate[1] - timeline.fps) > 0.001 || !Number.isFinite(duration) || Math.abs(duration - timeline.durationInFrames / timeline.fps) > 1 / timeline.fps + 0.001) throw new Error("Export fps or duration failed verification");
      const audible = timeline.scenes.some(({scene}) => scene.type === "clip" && !scene.sourceAudio.mute && media?.[scene.asset]?.hasAudio);
      const audio = metadata.streams?.find((s) => s.codec_type === "audio");
      if (audible && audio?.codec_name !== "aac") throw new Error(`Expected an AAC audio stream from clip sound, found ${audio?.codec_name ?? "none"}`);
      record.media = metadata;
    }
    if (existsSync(output)) throw new Error("Output was created by another process; refusing to overwrite");
    renameSync(pending, output);
    record.status = "complete";
    console.log(`Wrote ${output}\nRecord ${recordPath}`);
  } catch (error) {
    record.status = "failed";
    record.error = (error as Error).message;
    throw error;
  } finally {
    record.elapsedMs = Date.now() - started;
    writeFileSync(recordPath, JSON.stringify(record, null, 2));
  }
};

main().catch((error) => {
  console.error((error as Error).message);
  process.exitCode = 1;
});
