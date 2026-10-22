import assert from "node:assert/strict";
import {test} from "node:test";
import {mkdtempSync, readFileSync} from "node:fs";
import {tmpdir} from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {parseProject} from "../src/engine/project-schema";
import {fadeOpacity, graphicOpacity} from "../src/engine/fade";
import {beatToFrame, buildReviewPlan, parseDirection} from "../src/engine/review-plan";

const project = parseProject({version: 1, id: "study", title: "Study", fps: 30, scenes: [
  {id: "a", type: "hook", durationSec: 2, props: {headline: "A"}},
  {id: "b", type: "endCard", durationSec: 2, props: {title: "B"}},
], captions: [{startSec: 1, endSec: 1.5, text: "Caption"}]});
const grid = {bpm: 124, offsetSec: 0.048, beatsPerBar: 4, provenance: "Manual test"};
const cue = {id: "proof", sceneId: "b", at: {frame: 60}, holdFrames: 30, role: "proof", purpose: "Readable proof"};
const direction = {version: 1, projectId: "study", cues: [cue]};

test("absolute fractional beat rounding avoids cumulative drift", () => {
  assert.equal(beatToFrame(100, grid, 30), 1453);
  assert.equal(beatToFrame(1.5, grid, 30), Math.round((0.048 + 1.5 * 60 / 124) * 30));
  assert.notEqual(beatToFrame(100, grid, 30), Math.round(60 / 124 * 30) * 100);
});

test("review samples include cuts, holds, captions and all in-range beats, sorted and deduplicated", () => {
  const plan = buildReviewPlan(project, parseDirection({...direction, beatGrid: grid}));
  const frames = plan.frames.map((f) => f.frame);
  for (const frame of [0, 1, 29, 30, 44, 45, 59, 60, 61, 74, 89, 90, 119]) assert.ok(frames.includes(frame), `missing ${frame}`);
  assert.deepEqual(frames, [...new Set(frames)].sort((a, b) => a - b));
  assert.ok(frames.every((f) => f >= 0 && f < 120));
  assert.equal(plan.beats[0].frame, 1);
  assert.equal(plan.beats[4].bar, 2);
  assert.deepEqual(buildReviewPlan(project, parseDirection({...direction, beatGrid: grid})), plan);
  const tied = buildReviewPlan(project, parseDirection({...direction, cues: [{...cue, id: "z"}, {...cue, id: "a"}]}));
  assert.deepEqual(tied.cues.map((c) => c.id), ["a", "z"]);
});

test("invalid direction references and cross-scene holds fail instead of being ignored", () => {
  const invalid = [
    {...direction, projectId: "wrong"},
    {...direction, cues: [cue, cue]},
    {...direction, cues: [{...cue, sceneId: "missing"}]},
    {...direction, cues: [{...cue, at: {beat: 4}}]},
    {...direction, cues: [{...cue, at: {frame: 59}}]},
    {...direction, cues: [{...cue, at: {frame: 119}, holdFrames: 2}]},
    {...direction, beatGrid: {...grid, offsetSec: 4}},
  ];
  for (const value of invalid) assert.throws(() => buildReviewPlan(project, parseDirection(value)));
  assert.throws(() => parseDirection({...direction, music: "not-supported.wav"}), /music/);
  assert.throws(() => parseDirection({...direction, cues: [{...cue, at: {beat: 4, frame: 60}}]}));
  assert.throws(() => parseDirection({...direction, beatGrid: {...grid, bpm: 0}}));
});

test("plans work before media preparation and without direction metadata", () => {
  const reel = parseProject({version: 2, id: "reel", title: "Reel", assets: [{id: "source", kind: "video", path: "footage/source.mp4"}], scenes: [
    {id: "clip", type: "clip", asset: "source", inSec: 2, outSec: 3},
  ]});
  assert.equal(buildReviewPlan(reel).durationInFrames, 30);
  assert.deepEqual(buildReviewPlan(reel).beats, []);
});

test("graphic edge choices preserve legacy fades and make cuts visible even in short scenes", () => {
  for (let length = 1; length <= 60; length++) {
    for (let frame = 0; frame < length; frame++) {
      assert.equal(graphicOpacity(frame, length, "spring", "fade"), fadeOpacity(frame, length, Math.min(10, Math.floor(length / 4))));
      assert.equal(graphicOpacity(frame, length, "cut", "cut"), 1);
      for (const enter of ["spring", "cut"] as const) for (const exit of ["cut", "fade"] as const) {
        const opacity = graphicOpacity(frame, length, enter, exit);
        assert.ok(Number.isFinite(opacity) && opacity >= 0 && opacity <= 1);
      }
    }
  }
  assert.equal(graphicOpacity(0, 60, "cut", "fade"), 1);
  assert.equal(graphicOpacity(59, 60, "spring", "cut"), 1);
  assert.equal(parseProject({...project, scenes: [{...project.scenes[0], motion: {enter: "cut", exit: "cut"}}]}).scenes[0].type, "hook");
  assert.throws(() => parseProject({...project, scenes: [{...project.scenes[0], motion: {enter: "bounce"}}]}), /motion/);
});

test("plan CLI emits JSON, rejects missing explicit direction and refuses output overwrite", () => {
  const run = (...args: string[]) => spawnSync(process.execPath, ["--import", "tsx", "tools/video.ts", "plan", "projects/motion-study/project.json", ...args], {encoding: "utf8"});
  const stdout = run();
  assert.equal(stdout.status, 0, stdout.stderr);
  assert.equal(JSON.parse(stdout.stdout).durationInFrames, 240);
  const output = path.join(mkdtempSync(path.join(tmpdir(), "video-plan-")), "review.json");
  const write = run(`--out=${output}`);
  assert.equal(write.status, 0, write.stderr);
  const before = readFileSync(output, "utf8");
  assert.equal(run(`--out=${output}`).status, 1);
  assert.equal(readFileSync(output, "utf8"), before);
  assert.equal(run("--direction=does-not-exist.json").status, 1);
});
