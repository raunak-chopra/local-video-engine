import assert from "node:assert/strict";
import {test} from "node:test";
import {parseProject} from "../src/engine/project-schema";
import {resolveTimeline} from "../src/engine/resolve-timeline";
import {fadeOpacity} from "../src/engine/fade";
import {parseOptions} from "../tools/cli-options";

const base = {version: 1, id: "regression", title: "Regression", scenes: [{id: "s", type: "statement", durationSec: 1, props: {text: "Visible"}}]};

test("unknown top-level and nested settings fail with field paths", () => {
  assert.throws(() => parseProject({...base, audio: {src: "ignored.wav"}}), /audio/);
  assert.throws(() => parseProject({...base, scenes: [{...base.scenes[0], props: {text: "Hello", tyop: "wrong"}}]}), /tyop/);
});
test("frame rounding rejects collapsed captions and scenes", () => {
  assert.throws(() => resolveTimeline(parseProject({...base, captions: [{startSec: .001, endSec: .002, text: "Invisible"}]})), /zero frames/);
  assert.throws(() => resolveTimeline(parseProject({...base, scenes: [{...base.scenes[0], durationSec: .001}]})), /zero frames/);
});
test("caption overlap is rejected regardless of input ordering; touching is valid", () => {
  const captions = [{startSec: .2, endSec: .8, text: "B"}, {startSec: 0, endSec: .6, text: "A"}];
  assert.throws(() => resolveTimeline(parseProject({...base, captions})), /overlaps/);
  assert.equal(resolveTimeline(parseProject({...base, captions: [{startSec: 0, endSec: .5, text: "A"}, {startSec: .5, endSec: 1, text: "B"}]})).captions.length, 2);
});
test("all short-caption and short-scene frame spans produce finite opacity", () => {
  for (let duration = 1; duration <= 17; duration++) {
    for (let frame = 0; frame < duration; frame++) {
      for (const fade of [8, Math.min(10, Math.floor(duration / 4))]) {
        const opacity = fadeOpacity(frame, duration, fade);
        assert.ok(Number.isFinite(opacity) && opacity >= 0 && opacity <= 1);
      }
    }
  }
  assert.equal(fadeOpacity(0, 1, 8), 1);
  assert.equal(fadeOpacity(10, 60, 8), 1);
});
test("CLI preserves equals and spaces and rejects invalid or unsupported flags", () => {
  assert.equal(parseOptions(["still", "project with spaces.json", "--out=out/file=a.png", "--frame=16"]).flags.out, "out/file=a.png");
  assert.equal(parseOptions(["still", "x", "--frame=0"]).frame, 0);
  for (const args of [["still", "x", "--frame=abc"], ["still", "x", "--frame=-1"], ["still", "x", "--frame=1.2"], ["render", "x", "--frame=1"], ["still", "x", "--foo=bar"], ["still", "x", "--out="], ["still", "x", "--frame=1", "--frame=2"]]) {
    assert.throws(() => parseOptions(args));
  }
});
test("captions extending beyond the project and duplicate scene ids fail", () => {
  assert.throws(() => resolveTimeline(parseProject({...base, captions: [{startSec: 0, endSec: 2, text: "Too long"}]})), /timeline end/);
  assert.throws(() => parseProject({...base, scenes: [base.scenes[0], base.scenes[0]]}), /duplicate/);
});
