/**
 * Local CLI for JSON-driven projects.
 *
 *   npm run video -- validate projects/demo-ad/project.json
 *   npm run video -- still    projects/demo-ad/project.json [--frame=60] [--canvas=square]
 *   npm run video -- render   projects/demo-ad/project.json [--canvas=landscape] [--out=out/x.mp4]
 */
import {spawnSync} from "node:child_process";
import {mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {createRequire} from "node:module";
import path from "node:path";
import {
  ProjectValidationError,
  parseProject,
  type CanvasPreset,
} from "../src/engine/project-schema";
import {resolveTimeline} from "../src/engine/resolve-timeline";

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");

const [command, projectArg, ...rest] = process.argv.slice(2);
const flags = Object.fromEntries(
  rest
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [k, v = "true"] = a.slice(2).split("=");
      return [k, v];
    }),
);

const fail = (message: string): never => {
  console.error(message);
  process.exit(1);
};

if (!command || !projectArg || !["validate", "still", "render"].includes(command)) {
  fail("Usage: video <validate|still|render> <project.json> [--canvas=vertical|square|landscape] [--frame=N] [--out=file]");
}

const projectPath = path.resolve(projectArg);
let raw: Record<string, unknown>;
try {
  raw = JSON.parse(readFileSync(projectPath, "utf8"));
} catch (error) {
  fail(`Cannot read ${projectPath}: ${(error as Error).message}`);
  throw error;
}
if (flags.canvas) raw = {...raw, canvas: flags.canvas as CanvasPreset};

let project;
let timeline;
try {
  project = parseProject(raw);
  timeline = resolveTimeline(project);
} catch (error) {
  if (error instanceof ProjectValidationError) fail(`${projectArg}\n${error.message}`);
  throw error;
}

console.log(
  `OK ${project.id}: ${timeline.width}x${timeline.height} @ ${timeline.fps}fps, ` +
    `${timeline.durationInFrames} frames (${(timeline.durationInFrames / timeline.fps).toFixed(2)}s), ` +
    `${timeline.scenes.length} scenes`,
);
for (const {scene, from, durationInFrames} of timeline.scenes) {
  console.log(`  ${scene.id.padEnd(14)} ${scene.type.padEnd(10)} frames ${from}-${from + durationInFrames}`);
}

if (command !== "validate") {
  const outDir = path.join(root, "out");
  mkdirSync(outDir, {recursive: true});
  const propsFile = path.join(outDir, `${project.id}.props.json`);
  writeFileSync(propsFile, JSON.stringify({project: raw}));

  const isStill = command === "still";
  const suffix = `${project.canvas}${isStill ? `-f${flags.frame ?? "0"}.png` : ".mp4"}`;
  const out = path.resolve(flags.out ?? path.join(outDir, `${project.id}-${suffix}`));
  const cliArgs = [
    path.join(path.dirname(require.resolve("@remotion/cli/package.json")), "remotion-cli.js"),
    command,
    "src/index.ts",
    "ProjectAd",
    out,
    `--props=${propsFile}`,
    ...(isStill ? [`--frame=${flags.frame ?? "0"}`] : []),
  ];
  const result = spawnSync(process.execPath, cliArgs, {cwd: root, stdio: "inherit", shell: false});
  if (result.status !== 0) fail(`${command} failed (exit ${result.status}).`);
  console.log(`Wrote ${out}`);
}
