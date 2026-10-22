import assert from "node:assert/strict";
import {appendFileSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import path from "node:path";
import {test} from "node:test";
import {parseProject, type ProjectV2} from "../src/engine/project-schema";
import {parseOptions} from "../tools/cli-options";
import {classify, conversionArgs} from "../tools/media/classify";
import {mediaMapFromLock, type MediaLock} from "../tools/media/lock";
import {prepareProject, type MediaTools} from "../tools/media/prepare";
import {ffmpeg, ffprobe, root, type FfprobeResult} from "../tools/media/remotion-tools";

const scene = {id: "s", type: "statement", durationSec: 1, props: {text: "Visible"}};
const v2 = (assets: unknown[]) => ({version: 2, id: "media-test", title: "Media test", scenes: [scene], assets});

test("v2 asset paths stay inside assets/ and use supported formats", () => {
  for (const bad of ["../escape.mp4", "/abs.mp4", "C:/drive.mp4", String.raw`footage\clip.mp4`, "footage//clip.mp4", "footage/./clip.mp4"]) {
    assert.throws(() => parseProject(v2([{id: "a", kind: "video", path: bad}])), /relative path/, bad);
  }
  assert.throws(() => parseProject(v2([{id: "a", kind: "image", path: "memes/react.gif"}])), /GIF is deferred/);
  assert.throws(() => parseProject(v2([{id: "a", kind: "video", path: "music/track.mp3"}])), /not a supported video format/);
  assert.throws(() => parseProject(v2([{id: "a", kind: "audio", path: "a.wav"}, {id: "a", kind: "audio", path: "b.wav"}])), /duplicate asset id/);
  assert.throws(() => parseProject(v2([{id: "a", kind: "audio", path: "a.wav", rights: {source: "x", bogus: 1}}])), /bogus/);
  assert.equal(parseProject(v2([{id: "clip", kind: "video", path: "footage/Pakode 01.MOV"}])).version, 2);
});

test("version dispatch keeps v1 strict and explains unknown versions", () => {
  assert.throws(() => parseProject({version: 1, id: "v1", title: "t", scenes: [scene], assets: []}), /assets/);
  assert.throws(() => parseProject({version: 3, id: "v3", title: "t", scenes: [scene]}), /version must be 1 .* or 2/);
});

const videoProbe = (overrides: Partial<NonNullable<FfprobeResult["streams"]>[number]> = {}, audio?: string): FfprobeResult => ({
  format: {duration: "4.0"},
  streams: [
    {codec_type: "video", codec_name: "h264", width: 1920, height: 1080, pix_fmt: "yuv420p", r_frame_rate: "30/1", avg_frame_rate: "30/1", ...overrides},
    ...(audio ? [{codec_type: "audio", codec_name: audio}] : []),
  ],
});

test("classification copies ready media and converts or rejects the rest", () => {
  const ready = classify("video", videoProbe({}, "aac"), 30);
  assert.equal(ready.action, "copy");

  const hevc = classify("video", videoProbe({codec_name: "hevc"}, "aac"), 30);
  assert.equal(hevc.action, "convert");

  const vfr = classify("video", videoProbe({avg_frame_rate: "1380/61"}), 30);
  assert.ok(vfr.action === "convert" && vfr.targetFps === 30);

  const pcmInMov = classify("video", videoProbe({}, "pcm_s16le"), 30);
  assert.ok(pcmInMov.action === "convert" && pcmInMov.reasons.some((r) => r.includes("AAC")));

  // Phone footage: landscape-coded frames with display rotation. Display size is swapped.
  const rotated = classify("video", videoProbe({side_data_list: [{side_data_type: "Display Matrix", rotation: -90}]}, "aac"), 30);
  assert.ok(rotated.action === "copy");
  assert.deepEqual([rotated.summary.rotation, rotated.summary.width, rotated.summary.height], [270, 1080, 1920]);

  // Rotated and needing re-encode (typical low-light Android clip): ffmpeg's
  // autorotate makes the converted clip upright.
  const rotatedVfr = classify("video", videoProbe({avg_frame_rate: "24/1", side_data_list: [{rotation: -90}]}, "aac"), 30);
  assert.ok(rotatedVfr.action === "convert" && rotatedVfr.notes.some((n) => n.includes("upright")));

  // HDR (Samsung HDR10+ / Pixel HLG) is tone-mapped, not passed through washed out.
  for (const transfer of ["smpte2084", "arib-std-b67"]) {
    const hdr = classify("video", videoProbe({codec_name: "hevc", pix_fmt: "yuv420p10le", color_transfer: transfer}), 30);
    assert.ok(hdr.action === "convert" && hdr.toneMap, transfer);
    assert.ok(conversionArgs(hdr).join(" ").includes("tonemap"));
  }

  assert.equal(classify("video", {format: {duration: "1"}, streams: [{codec_type: "audio", codec_name: "aac"}]}, 30).action, "reject");
  assert.equal(classify("audio", {format: {duration: "1"}, streams: [{codec_type: "audio", codec_name: "opus"}]}, 30).action, "reject");
  assert.equal(classify("image", {streams: [{codec_type: "video", codec_name: "mjpeg", width: 10, height: 10}]}, 30).action, "copy");
  assert.equal(classify("font", null, 30).action, "copy");
});

test("rendering refuses unprepared, foreign or altered media", () => {
  const project = parseProject(v2([{id: "clip", kind: "video", path: "footage/a.mp4"}])) as ProjectV2;
  const publicDir = mkdtempSync(path.join(tmpdir(), "media-map-"));
  try {
    assert.throws(() => mediaMapFromLock(project, null, publicDir), /no media.lock.json/);
    const lock: MediaLock = {version: 2, projectId: "other", tools: {remotion: "x", ffmpeg: "y"}, assets: {}};
    assert.throws(() => mediaMapFromLock(project, lock, publicDir), /belongs to "other"/);
    assert.throws(() => mediaMapFromLock(project, {...lock, projectId: "media-test"}, publicDir), /not prepared/);
  } finally {
    rmSync(publicDir, {recursive: true, force: true});
  }
});

test("prepare CLI switches are explicit and read-only check cannot accept changes", () => {
  assert.equal(parseOptions(["prepare", "p.json", "--check"]).flags.check, "true");
  assert.equal(parseOptions(["prepare", "p.json", "--accept-changes"]).flags["accept-changes"], "true");
  for (const args of [["prepare", "p.json", "--check", "--accept-changes"], ["prepare", "p.json", "--check=yes"], ["still", "p.json", "--check"], ["prepare", "p.json", "--check", "--check"]]) {
    assert.throws(() => parseOptions(args), Error, args.join(" "));
  }
});

const fixtures = path.join(root, "assets", "_fixtures");
const haveFixtures = ["counter-portrait.mp4", "counter-vfr.mp4", "counter-rotated.mp4"].every((f) => existsSync(path.join(fixtures, f)));

test("prepare copies, converts, reuses and catches changed sources (real media)", {skip: haveFixtures ? false : "run `npm run fixtures` to enable the real-media test"}, async () => {
  const work = mkdtempSync(path.join(tmpdir(), "media-prepare-"));
  const assetsRoot = path.join(work, "assets");
  const publicDir = path.join(work, "public");
  mkdirSync(path.join(assetsRoot, "footage"), {recursive: true});
  for (const f of ["counter-portrait.mp4", "counter-vfr.mp4", "counter-rotated.mp4"]) copyFileSync(path.join(fixtures, f), path.join(assetsRoot, "footage", f));
  let probes = 0;
  let encodes = 0;
  const tools: MediaTools = {
    ffprobe: (file) => { probes++; return ffprobe(file); },
    ffmpeg: (args) => { encodes++; ffmpeg(args); },
    versions: () => ({remotion: "test", ffmpeg: "test"}),
  };
  const project = parseProject(v2([
    {id: "portrait", kind: "video", path: "footage/counter-portrait.mp4"},
    {id: "vfr", kind: "video", path: "footage/counter-vfr.mp4"},
    {id: "rotated", kind: "video", path: "footage/counter-rotated.mp4"},
  ])) as ProjectV2;
  const lockPath = path.join(work, "media.lock.json");
  const options = {project, lockPath, assetsRoot, publicDir, tools, mode: "write" as const};
  try {
    const first = await prepareProject(options);
    assert.deepEqual(first.errors, []);
    assert.deepEqual(first.reports.map((r) => [r.id, r.outcome]), [["portrait", "copied"], ["vfr", "converted"], ["rotated", "copied"]]);
    assert.equal(encodes, 1);
    const lock = first.lock!;
    assert.equal(lock.assets.vfr.probe.variableFrameRate, false, "prepared VFR clip is constant-rate");
    assert.equal(lock.assets.vfr.probe.fps, 30);
    assert.deepEqual([lock.assets.rotated.probe.rotation, lock.assets.rotated.probe.width, lock.assets.rotated.probe.height], [90, 540, 960]);
    assert.ok(lock.assets.portrait.probe.hasAudio && !lock.assets.rotated.probe.hasAudio);
    const map = mediaMapFromLock(project, lock, publicDir);
    assert.ok(map.vfr.src.endsWith(".prepared.mp4"));

    const lockText = readFileSync(lockPath, "utf8");
    probes = 0;
    encodes = 0;
    const second = await prepareProject(options);
    assert.ok(second.reports.every((r) => r.outcome === "reused"));
    assert.equal(probes + encodes, 0, "unchanged media is not probed or encoded again");
    assert.equal(readFileSync(lockPath, "utf8"), lockText, "re-running prepare produces no lock diff");

    appendFileSync(path.join(assetsRoot, "footage", "counter-portrait.mp4"), "x");
    const check = await prepareProject({...options, mode: "check"});
    assert.match(check.errors.join("\n"), /portrait.*source changed/);
    const refused = await prepareProject(options);
    assert.match(refused.errors.join("\n"), /accept-changes/);
    assert.equal(readFileSync(lockPath, "utf8"), lockText, "a refused prepare leaves the lock untouched");
    const accepted = await prepareProject({...options, acceptChanges: true});
    assert.deepEqual(accepted.errors, []);
    assert.notEqual(accepted.lock!.assets.portrait.sha256, lock.assets.portrait.sha256);
  } finally {
    rmSync(work, {recursive: true, force: true});
  }
});
