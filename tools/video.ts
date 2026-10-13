/** Local runner. In PowerShell use npm.cmd run video -- ... (npm.ps1 drops flags). */
import {spawnSync} from "node:child_process";
import {randomUUID, createHash} from "node:crypto";
import {existsSync, mkdirSync, readFileSync, renameSync, writeFileSync} from "node:fs";
import {createRequire} from "node:module";
import path from "node:path";
import {parseProject} from "../src/engine/project-schema";
import {resolveTimeline} from "../src/engine/resolve-timeline";
import {parseOptions} from "./cli-options";

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");
const cli = path.join(path.dirname(require.resolve("@remotion/cli/package.json")), "remotion-cli.js");
const run = (args: string[], capture = false) => {
  const result = spawnSync(process.execPath, [cli, ...args], {cwd: root, shell: false, encoding: "utf8", ...(capture ? {maxBuffer: 16 * 1024 * 1024} : {stdio: "inherit"})});
  if (result.error) throw new Error(`Could not start Remotion: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`Remotion failed (${result.signal ? `signal ${result.signal}` : `exit ${result.status}`}): ${capture ? result.stderr : "see output above"}`);
  return result.stdout;
};
const probe = (file: string) => JSON.parse(run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", file], true));

try {
  const {command, input, flags, frame} = parseOptions(process.argv.slice(2));
  for (const key of ["frame", "canvas", "out", "log"]) {
    if (process.env[`npm_config_${key}`] && !(key in flags)) throw new Error(`npm consumed --${key}; use npm.cmd run video -- ... or invoke tools/video.ts directly.`);
  }
  if (command === "doctor") {
    run(["versions"]);
    console.log(run(["ffprobe", "-version"], true).split(/\r?\n/)[0]);
    console.log(run(["ffmpeg", "-version"], true).split(/\r?\n/)[0]);
    console.log("Local Remotion media tools available. PowerShell: use npm.cmd, not npm.ps1, for flags.");
  } else if (command === "probe") {
    console.log(JSON.stringify(probe(path.resolve(input)), null, 2));
  } else {
    const projectPath = path.resolve(input);
    const raw = JSON.parse(readFileSync(projectPath, "utf8"));
    if (flags.canvas) raw.canvas = flags.canvas;
    const project = parseProject(raw);
    const timeline = resolveTimeline(project);
    if (command === "still" && frame >= timeline.durationInFrames) throw new Error(`--frame ${frame} is outside 0-${timeline.durationInFrames - 1}`);
    console.log(`OK ${project.id}: ${timeline.width}x${timeline.height} @ ${timeline.fps}fps, ${timeline.durationInFrames} frames, ${timeline.scenes.length} scenes`);
    if (command !== "validate") {
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
      writeFileSync(propsPath, JSON.stringify({project}, null, 2));
      const recordPath = path.join(runDir, "record.json");
      const record = {status: "incomplete", command, runId, projectPath, projectHash: createHash("sha256").update(JSON.stringify(project)).digest("hex"), propsPath, output, pending, frame: command === "still" ? frame : null, width: timeline.width, height: timeline.height, fps: timeline.fps, durationInFrames: timeline.durationInFrames, remotion: require("remotion/package.json").version, zod: require("zod/package.json").version, node: process.version, elapsedMs: 0, error: "", media: null as unknown};
      writeFileSync(recordPath, JSON.stringify(record, null, 2));
      const started = Date.now();
      try {
        run([command, "src/index.ts", "ProjectAd", pending, `--props=${propsPath}`, ...(command === "still" ? [`--frame=${frame}`] : ["--codec=h264", "--pixel-format=yuv420p", "--image-format=png"]), ...(flags.log ? [`--log=${flags.log}`] : [])]);
        if (!existsSync(pending)) throw new Error("Renderer reported success without an output file");
        if (command === "render") {
          const metadata = probe(pending);
          const video = metadata.streams?.find((s: {codec_type: string}) => s.codec_type === "video");
          if (!video || video.width !== timeline.width || video.height !== timeline.height || video.pix_fmt !== "yuv420p") throw new Error("Export dimensions or pixel format failed verification");
          const rate = String(video.avg_frame_rate).split("/").map(Number);
          const duration = Number(video.duration ?? metadata.format?.duration);
          if (!Number.isFinite(rate[0] / rate[1]) || Math.abs(rate[0] / rate[1] - timeline.fps) > 0.001 || !Number.isFinite(duration) || Math.abs(duration - timeline.durationInFrames / timeline.fps) > 1 / timeline.fps + 0.001) throw new Error("Export fps or duration failed verification");
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
    }
  }
} catch (error) {
  console.error((error as Error).message);
  process.exitCode = 1;
}
