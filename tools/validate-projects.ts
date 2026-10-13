import {readdirSync, readFileSync} from "node:fs";
import path from "node:path";
import {parseProject} from "../src/engine/project-schema";
import {resolveTimeline} from "../src/engine/resolve-timeline";

const visit = (directory: string): string[] => readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? visit(file) : entry.name === "project.json" ? [file] : [];
});
const files = visit(path.resolve("projects"));
if (files.length === 0) throw new Error("No project.json fixtures found");
for (const file of files) {
  const project = parseProject(JSON.parse(readFileSync(file, "utf8")));
  const timeline = resolveTimeline(project);
  console.log(`Valid ${project.id}: ${timeline.durationInFrames} frames (${file})`);
}
