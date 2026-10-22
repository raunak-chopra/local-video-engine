import assert from "node:assert/strict";
import {test} from "node:test";
import type {MediaMap, PreparedMedia} from "../src/engine/assets";
import {parseProject} from "../src/engine/project-schema";
import {resolveTimeline} from "../src/engine/resolve-timeline";
import {parseOptions} from "../tools/cli-options";

const assets = [
  {id: "pan", kind: "video", path: "footage/pan.mp4"},
  {id: "music", kind: "audio", path: "music/bed.mp3"},
];
const reel = (scenes: unknown[]) => ({version: 2, id: "reel", title: "Reel", assets, scenes});
const clip = (extra: Record<string, unknown> = {}) => ({id: "c", type: "clip", asset: "pan", inSec: 1, outSec: 2, ...extra});
const prepared = (overrides: Partial<PreparedMedia> = {}): MediaMap => ({
  pan: {kind: "video", src: "generated-media/abc/pan.mp4", durationSec: 4, videoStartSec: 0, width: 1080, height: 1920, rotation: 0, fps: 30, hasAudio: true, ...overrides},
});

test("clip scenes take their length from the trim, not durationSec", () => {
  assert.throws(() => parseProject(reel([clip({durationSec: 1})])), /durationSec/);
  assert.throws(() => parseProject(reel([clip({inSec: 2, outSec: 2})])), /outSec must be greater/);
  assert.throws(() => parseProject(reel([clip({asset: "music"})])), /is audio, not video/);
  assert.throws(() => parseProject(reel([clip({asset: "nope"})])), /unknown asset "nope"/);
  assert.throws(() => parseProject(reel([clip({focus: {x: 1.5, y: 0}})])), /focus/);
  assert.throws(() => parseProject({version: 1, id: "v1", title: "t", scenes: [clip()]}), /type/);
});

test("clip defaults: cover, centred, source audio on, hard cut", () => {
  const project = parseProject(reel([clip()]));
  const scene = project.scenes[0];
  assert.ok(scene.type === "clip");
  assert.equal(scene.fit, "cover");
  assert.deepEqual(scene.focus, {x: 0.5, y: 0.5});
  assert.deepEqual(scene.sourceAudio, {mute: false, gainDb: 0});
  assert.equal(scene.transitionIn, undefined);
});

test("trims resolve to whole frames once, and clips and graphics butt together", () => {
  const timeline = resolveTimeline(parseProject(reel([
    clip({id: "a", inSec: 1, outSec: 2}),
    clip({id: "b", inSec: 0.51, outSec: 1.49}),
    {id: "card", type: "statement", durationSec: 1, props: {text: "End"}},
  ])), prepared());
  assert.deepEqual(timeline.scenes.map((s) => [s.from, s.durationInFrames, s.trim?.before, s.trim?.after]), [
    [0, 30, 30, 60],
    [30, 30, 15, 45],
    [60, 30, undefined, undefined],
  ]);
  assert.equal(timeline.durationInFrames, 90);
});

test("trims are checked against the prepared source", () => {
  assert.throws(() => resolveTimeline(parseProject(reel([clip({inSec: 0.501, outSec: 0.51})]))), /zero frames/);
  assert.throws(() => resolveTimeline(parseProject(reel([clip({inSec: 3, outSec: 4.5})])), prepared()), /past the end of "pan"/);
  // Within half a frame of the probed end is allowed (container rounding).
  assert.equal(resolveTimeline(parseProject(reel([clip({inSec: 3, outSec: 4.01})])), prepared()).durationInFrames, 30);
  assert.throws(() => resolveTimeline(parseProject(reel([clip()])), {}), /no prepared media/);
  // Without media (bulk schema validation), trims are not checked against sources.
  assert.equal(resolveTimeline(parseProject(reel([clip({outSec: 99})]))).durationInFrames, 2940);
});

test("studio takes a project, an optional port and --no-open", () => {
  const {flags} = parseOptions(["studio", "p.json", "--port=3123", "--no-open"]);
  assert.deepEqual(flags, {port: "3123", "no-open": "true"});
  assert.throws(() => parseOptions(["studio", "p.json", "--port=abc"]));
  assert.throws(() => parseOptions(["studio", "p.json", "--frame=1"]));
});
