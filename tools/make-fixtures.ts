/**
 * Generates synthetic media for engine tests into assets/_fixtures/ (git-ignored).
 * Real cooking footage is still needed for creative acceptance; these files
 * only prove the media mechanics. Usage: npm run fixtures
 */
import {copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync} from "node:fs";
import path from "node:path";
import {ffmpeg, ffprobe, remotion, root} from "./media/remotion-tools";

const out = path.join(root, "assets", "_fixtures");
const work = path.join(root, "out", "fixture-work");
rmSync(work, {recursive: true, force: true});
mkdirSync(work, {recursive: true});
mkdirSync(out, {recursive: true});

const master = (composition: string) => {
  const file = path.join(work, `${composition}.mp4`);
  remotion(["render", "src/index.ts", composition, file, "--codec=h264", "--pixel-format=yuv420p", "--image-format=png", "--log=error"]);
  return file;
};

console.log("Rendering counter masters (4 s each)...");
const portrait = master("FixtureCounterPortrait");
const landscape = master("FixtureCounterLandscape");
const target = (name: string) => path.join(out, name);
const sine = (frequency: number, seconds: number) => ["-f", "lavfi", "-i", `sine=frequency=${frequency}:sample_rate=48000:duration=${seconds}`];
const x264 = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-video_track_timescale", "90000"];

console.log("Deriving variants...");
// Ready as-is: H.264 + AAC, portrait.
ffmpeg(["-i", portrait, ...sine(440, 4), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-shortest", target("counter-portrait.mp4")]);
// No audio stream.
ffmpeg(["-i", portrait, "-c", "copy", "-an", target("counter-portrait-silent.mp4")]);
// Landscape-encoded frames with 90 degree display rotation, as phones record.
ffmpeg(["-display_rotation", "90", "-i", landscape, "-c", "copy", target("counter-rotated.mp4")]);
// Variable frame rate: first 2 s at 30 fps, last 2 s at 15 fps, joined without re-encoding.
const segA = path.join(work, "seg-a.mp4");
const segB = path.join(work, "seg-b.mp4");
ffmpeg(["-i", portrait, "-t", "2", ...x264, "-r", "30", "-an", segA]);
ffmpeg(["-ss", "2", "-i", portrait, ...x264, "-r", "15", "-an", segB]);
const list = path.join(work, "concat.txt");
writeFileSync(list, `file '${segA.replace(/\\/g, "/")}'\nfile '${segB.replace(/\\/g, "/")}'\n`);
ffmpeg(["-f", "concat", "-safe", "0", "-i", list, "-c", "copy", target("counter-vfr.mp4")]);
// Android low-light portrait: landscape-coded frames, -90 display rotation
// (as Android writes it) and a variable frame rate, with AAC audio.
const landA = path.join(work, "land-a.mp4");
const landB = path.join(work, "land-b.mp4");
ffmpeg(["-i", landscape, ...sine(440, 2), "-map", "0:v", "-map", "1:a", "-t", "2", ...x264, "-r", "30", "-c:a", "aac", landA]);
ffmpeg(["-ss", "2", "-i", landscape, ...sine(440, 2), "-map", "0:v", "-map", "1:a", ...x264, "-r", "15", "-c:a", "aac", "-shortest", landB]);
const landList = path.join(work, "concat-land.txt");
writeFileSync(landList, `file '${landA.replace(/\\/g, "/")}'\nfile '${landB.replace(/\\/g, "/")}'\n`);
const landVfr = path.join(work, "land-vfr.mp4");
ffmpeg(["-f", "concat", "-safe", "0", "-i", landList, "-c", "copy", landVfr]);
ffmpeg(["-display_rotation", "-90", "-i", landVfr, "-c", "copy", target("android-portrait-vfr.mp4")]);
// 10-bit HDR (PQ) tagged clip, as Samsung HDR10+ video arrives.
ffmpeg(["-i", portrait, "-c:v", "libx264", "-pix_fmt", "yuv420p10le", "-x264-params", "colorprim=bt2020:transfer=smpte2084:colormatrix=bt2020nc", "-an", target("hdr-pq-10bit.mp4")]);
// Video track starting 0.1 s after the file start (phones often start a few ms
// late): shows whether the renderer counts source time from the file or the first frame.
ffmpeg(["-itsoffset", "0.1", "-i", portrait, ...sine(440, 4.1), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", target("counter-offset-start.mp4")]);
// 60 fps constant-rate source with audio.
ffmpeg(["-i", landscape, ...sine(550, 4), "-map", "0:v", "-map", "1:a", ...x264, "-r", "60", "-c:a", "aac", "-shortest", target("counter-60fps.mp4")]);
// Still image, music-like bed and a short sting.
ffmpeg(["-ss", "1", "-i", portrait, "-frames:v", "1", target("counter-still.png")]);
ffmpeg([...sine(330, 3), "-c:a", "pcm_s16le", target("tone.wav")]);
ffmpeg([...sine(880, 0.6), "-c:a", "libmp3lame", "-b:a", "128k", target("sting.mp3")]);
// A real font file, as a supplied font would arrive.
const fontDir = path.join(root, "node_modules", "@fontsource-variable", "noto-sans-devanagari", "files");
const fontFile = readdirSync(fontDir).find((f) => f.includes("devanagari-wght-normal") && f.endsWith(".woff2"));
if (!fontFile) throw new Error("Noto Sans Devanagari woff2 not found in node_modules");
copyFileSync(path.join(fontDir, fontFile), target("noto-sans-devanagari.woff2"));

for (const name of readdirSync(out).sort()) {
  if (!existsSync(target(name)) || name.endsWith(".woff2")) { console.log(`  ${name}`); continue; }
  const probe = ffprobe(target(name));
  const v = probe.streams?.find((s) => s.codec_type === "video");
  const a = probe.streams?.find((s) => s.codec_type === "audio");
  const rotation = v?.side_data_list?.find((d) => typeof d.rotation === "number")?.rotation ?? 0;
  console.log(`  ${name.padEnd(28)} ${v ? `${v.codec_name} ${v.width}x${v.height} r=${v.r_frame_rate} avg=${v.avg_frame_rate} rot=${rotation}` : "-"} ${a ? `| ${a.codec_name}` : ""} | ${Number(probe.format?.duration).toFixed(2)} s`);
}
console.log(`Fixtures written to ${out}`);
