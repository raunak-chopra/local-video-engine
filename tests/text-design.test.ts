import assert from "node:assert/strict";
import {test} from "node:test";
import {parseProject} from "../src/engine/project-schema";
import {resolveTimeline} from "../src/engine/resolve-timeline";
import {buildReviewPlan} from "../src/engine/review-plan";
import {fontFamilyFor, safeRectangle} from "../src/engine/text-design";
import {compareProjectData} from "../src/engine/project-diff";
import {parseOptions} from "../tools/cli-options";

const base = {version: 2, id: "text-test", title: "Text", scenes: [{id: "s", type: "statement", durationSec: 3, props: {text: "Base"}}]};
const cue = (extra: Record<string, unknown> = {}) => ({id: "title", lane: "title", startSec: 0, endSec: 2,
  box: {x: 0, y: 0, width: 1, height: .25}, runs: [{text: "Exact copy"}], ...extra});

test("text runs preserve copy, spaces, newlines and shaped-script sequences", () => {
  const runs = [{text: "स्वादिष्ट सामग्री\n", fontId: "devanagari"}, {text: "1.25 tsp — keep all digits", fontId: "inter"}];
  const project = parseProject({...base, textOverlays: [cue({runs})]});
  assert.equal(resolveTimeline(project).textOverlays[0].cue.runs.map((r) => r.text).join(""), "स्वादिष्ट सामग्री\n1.25 tsp — keep all digits");
  assert.equal(fontFamilyFor("constructor"), "ProjectFont-constructor");
});

test("font ids resolve only to known bundled or correctly typed registered assets", () => {
  assert.throws(() => parseProject({...base, textOverlays: [cue({runs: [{text: "A", fontId: "missing"}]})]}), /unknown font/);
  assert.throws(() => parseProject({...base, fonts: [{id: "mark", asset: "absent"}]}), /not a registered font/);
  assert.throws(() => parseProject({...base, fonts: [{id: "inter", asset: "file"}], assets: [{id: "file", kind: "font", path: "fonts/a.ttf"}]}), /cannot be replaced/);
  assert.throws(() => parseProject({...base, fonts: [{id: "mark", asset: "file", weight: 500}], assets: [{id: "file", kind: "font", path: "fonts/a.ttf"}],
    textOverlays: [cue({runs: [{text: "A", fontId: "mark"}], style: {fontWeight: 800}})]}), /registered weight 500/);
});

test("overlay timing rejects collapsed spans, overflow, duplicate ids and collisions", () => {
  assert.throws(() => resolveTimeline(parseProject({...base, textOverlays: [cue({startSec: .001, endSec: .002})]})), /zero frames/);
  assert.throws(() => resolveTimeline(parseProject({...base, textOverlays: [cue({endSec: 4})]})), /after the timeline/);
  assert.throws(() => parseProject({...base, textOverlays: [cue(), cue()]}), /duplicate/);
  assert.throws(() => resolveTimeline(parseProject({...base, textOverlays: [cue(), cue({id: "other", lane: "other"})]})), /overlaps/);
  // Disjoint screen areas can be active together, but same-lane overlap remains invalid.
  const lower = cue({id: "lower", lane: "lower", box: {x: 0, y: .7, width: 1, height: .3}});
  assert.equal(resolveTimeline(parseProject({...base, textOverlays: [cue(), lower]})).textOverlays.length, 2);
  assert.throws(() => resolveTimeline(parseProject({...base, textOverlays: [cue(), {...lower, lane: "title"}]})), /overlaps/);
  assert.equal(resolveTimeline(parseProject({...base, textOverlays: [cue({endSec: 1}), cue({id: "next", startSec: 1})]})).textOverlays.length, 2);
  assert.throws(() => resolveTimeline(parseProject({...base, captions: [{startSec: 0, endSec: 1, text: "legacy"}], textOverlays: [cue()]})), /ambiguous placement/);
});

test("safe areas are canvas-specific and overlay boxes cannot leave them", () => {
  assert.deepEqual(safeRectangle(1080, 1920, {top: 192, right: 160, bottom: 420, left: 64}), {x: 64, y: 192, width: 856, height: 1308});
  assert.throws(() => resolveTimeline(parseProject({...base, safeArea: {top: 1100, bottom: 1100, left: 64, right: 64}})), /no usable/);
  assert.throws(() => parseProject({...base, textOverlays: [cue({box: {x: .8, y: 0, width: .5, height: .2}})]}), /inside the safe rectangle/);
});

test("image scenes require images; review samples include each overlay's edges and hold", () => {
  const image = {id: "mark", type: "image", durationSec: 3, asset: "mark"};
  assert.throws(() => parseProject({...base, scenes: [image], assets: [{id: "mark", kind: "video", path: "footage/a.mp4"}]}), /not image/);
  const project = parseProject({...base, scenes: [image], assets: [{id: "mark", kind: "image", path: "images-and-logos/mark.png"}], textOverlays: [cue({startSec: 1, endSec: 2})]});
  assert.equal(resolveTimeline(project).durationInFrames, 90);
  const frames = new Set(buildReviewPlan(project).frames.map((entry) => entry.frame));
  for (const f of [29, 30, 31, 45, 59, 60]) assert.ok(frames.has(f));
});

test("bounded revision comparison catches trim and copy drift outside the allowed field", () => {
  const before = {scenes: [{props: {headline: "Original"}}, {asset: "interview", inSec: 1, outSec: 4}], text: "क्षि 1.25"};
  const after = {...before, scenes: [{props: {headline: "New headline"}}, {asset: "interview", inSec: 2, outSec: 4}], text: "क्षि 1.2"};
  const diff = compareProjectData(before, after, ["scenes[0].props.headline"]);
  assert.deepEqual(diff.filter((change) => !change.allowed).map((change) => change.path), ["scenes[1].inSec", "text"]);
  assert.equal(diff[0].allowed, true);
  assert.deepEqual(compareProjectData({b: 2, a: 1}, {a: 1, b: 2}), []);
  assert.equal(compareProjectData({scenes: [1, 2]}, {scenes: [1]}, ["scenes[0]"])[0].allowed, false);
  assert.equal(parseOptions(["diff", "candidate.json", "--against=accepted.json", "--allow=scenes[0].props.headline"]).flags.against, "accepted.json");
  assert.throws(() => parseOptions(["diff", "candidate.json"]), /requires --against/);
  assert.throws(() => parseOptions(["diff", "candidate.json", "--against=x", "--allow=scenes[0],"]), /field paths/);
});
