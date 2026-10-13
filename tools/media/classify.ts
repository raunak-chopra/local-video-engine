/**
 * Decides, from ffprobe output alone, whether a media file can be served to
 * the renderer as-is, needs a one-time conversion, or must be rejected.
 * Tuned for phone footage: Android portrait clips are usually stored as
 * rotated landscape frames, often with a variable frame rate in low light.
 * Pure: no file access, so every rule is unit-testable with canned probes.
 */
import type {AssetKind} from "../../src/engine/assets";
import type {FfprobeResult, FfprobeStream} from "./remotion-tools";

export type ProbeSummary = {
  durationSec: number | null;
  /** Presentation time of the first video frame; phones often start a few ms late. */
  videoStartSec: number;
  /** Display size: already swapped for 90/270 degree rotation metadata. */
  width: number | null;
  height: number | null;
  rotation: number;
  fps: number | null;
  variableFrameRate: boolean;
  videoCodec: string | null;
  audioCodec: string | null;
  hasAudio: boolean;
};

export type Classification =
  | {action: "copy"; summary: ProbeSummary; notes: string[]}
  | {action: "convert"; summary: ProbeSummary; notes: string[]; reasons: string[]; targetFps: number | null; toneMap: boolean}
  | {action: "reject"; summary: ProbeSummary | null; reasons: string[]};

/** Codecs Chromium decodes reliably in an MP4/MOV on every platform. */
const READY_VIDEO_CODECS = ["h264"];
const READY_PIXEL_FORMATS = ["yuv420p", "yuvj420p"];
const READY_AUDIO_IN_VIDEO = ["aac", "mp3"];
const READY_AUDIO_FILE_CODECS = ["mp3", "pcm_s16le", "pcm_s24le", "pcm_s32le", "pcm_f32le"];
const HDR_TRANSFERS = ["smpte2084", "arib-std-b67"];

const rate = (value?: string): number | null => {
  if (!value) return null;
  const [num, den] = value.split("/").map(Number);
  const result = den ? num / den : num;
  return Number.isFinite(result) && result > 0 ? result : null;
};

const number = (value?: string): number | null => {
  const result = Number(value);
  return value !== undefined && Number.isFinite(result) && result > 0 ? result : null;
};

const rotationOf = (stream: FfprobeStream): number => {
  const matrix = stream.side_data_list?.find((d) => typeof d.rotation === "number");
  const raw = matrix?.rotation ?? Number(stream.tags?.rotate ?? 0);
  // ffprobe reports counter-clockwise display-matrix rotation, often negative.
  return ((Math.round(raw) % 360) + 360) % 360;
};

export const summarize = (probe: FfprobeResult): ProbeSummary => {
  const streams = probe.streams ?? [];
  const video = streams.find((s) => s.codec_type === "video");
  const audio = streams.find((s) => s.codec_type === "audio");
  const rotation = video ? rotationOf(video) : 0;
  const sideways = rotation === 90 || rotation === 270;
  const avg = rate(video?.avg_frame_rate);
  const real = rate(video?.r_frame_rate);
  return {
    durationSec: number(probe.format?.duration) ?? number(video?.duration) ?? number(audio?.duration),
    videoStartSec: Number(video?.start_time ?? 0) || 0,
    width: (sideways ? video?.height : video?.width) ?? null,
    height: (sideways ? video?.width : video?.height) ?? null,
    rotation,
    fps: avg ?? real,
    // Heuristic: phone VFR files report an average rate that differs from the
    // stream's base rate. Constant-rate files report matching values.
    variableFrameRate: avg !== null && real !== null && Math.abs(avg - real) / real > 0.01,
    videoCodec: video?.codec_name ?? null,
    audioCodec: audio?.codec_name ?? null,
    hasAudio: Boolean(audio),
  };
};

/** Video assets are still images to ffprobe only when the format says so. */
const isStillImageCodec = (codec: string | null) => codec === "png" || codec === "mjpeg";

export const classify = (kind: AssetKind, probe: FfprobeResult | null, projectFps: number): Classification => {
  if (kind === "font") return {action: "copy", summary: emptySummary(), notes: []};
  if (!probe) return {action: "reject", summary: null, reasons: ["file could not be probed"]};
  const summary = summarize(probe);
  const video = probe.streams?.find((s) => s.codec_type === "video");

  if (kind === "image") {
    if (!isStillImageCodec(summary.videoCodec)) return {action: "reject", summary, reasons: [`not a PNG/JPEG image (codec ${summary.videoCodec ?? "none"})`]};
    return {action: "copy", summary: {...summary, durationSec: null, fps: null}, notes: []};
  }

  if (kind === "audio") {
    if (summary.videoCodec && !isStillImageCodec(summary.videoCodec)) return {action: "reject", summary, reasons: ["audio asset contains a video stream; register it as video"]};
    if (!summary.audioCodec) return {action: "reject", summary, reasons: ["no audio stream"]};
    if (!READY_AUDIO_FILE_CODECS.includes(summary.audioCodec)) return {action: "reject", summary, reasons: [`unsupported audio codec ${summary.audioCodec}; export WAV (PCM) or MP3`]};
    return {action: "copy", summary: {...summary, width: null, height: null, fps: null, hasAudio: true}, notes: []};
  }

  // Video.
  if (!video || isStillImageCodec(summary.videoCodec)) return {action: "reject", summary, reasons: ["no video stream"]};
  if (!summary.durationSec) return {action: "reject", summary, reasons: ["duration could not be determined"]};

  const reasons: string[] = [];
  const notes: string[] = [];
  if (!READY_VIDEO_CODECS.includes(summary.videoCodec ?? "")) reasons.push(`video codec ${summary.videoCodec} is converted to H.264 for reliable browser decoding`);
  if (!READY_PIXEL_FORMATS.includes(video.pix_fmt ?? "")) reasons.push(`pixel format ${video.pix_fmt} is converted to yuv420p`);
  if (summary.variableFrameRate) reasons.push(`variable frame rate (avg ${summary.fps?.toFixed(3)} fps) is converted to constant ${projectFps} fps`);
  if (summary.audioCodec && !READY_AUDIO_IN_VIDEO.includes(summary.audioCodec)) reasons.push(`audio codec ${summary.audioCodec} is converted to AAC`);
  const toneMap = HDR_TRANSFERS.includes(video.color_transfer ?? "");
  if (toneMap) reasons.push(`HDR transfer ${video.color_transfer} is tone-mapped to SDR BT.709`);
  if (summary.rotation !== 0) {
    // ffmpeg's default autorotate physically rotates frames while re-encoding,
    // so a converted clip comes out upright with no rotation metadata.
    notes.push(reasons.length > 0
      ? `display rotation ${summary.rotation} degrees applied during conversion; prepared clip is upright`
      : `display rotation ${summary.rotation} degrees kept as metadata; confirm orientation against decoded frames`);
  }
  if (!summary.hasAudio) notes.push("no audio stream");
  if (reasons.length === 0) return {action: "copy", summary, notes};
  return {action: "convert", summary, notes, reasons, targetFps: summary.variableFrameRate ? projectFps : null, toneMap};
};

/** Linearize, tone-map and re-encode HDR (PQ or HLG) as SDR BT.709. */
const TONE_MAP_FILTER = "zscale=t=linear:npl=100,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:p=bt709:r=tv";

/** ffmpeg arguments (after the input) that turn a convertible video into H.264/AAC MP4. */
export const conversionArgs = (classification: Extract<Classification, {action: "convert"}>): string[] => [
  "-map", "0:v:0", "-map", "0:a:0?",
  ...(classification.toneMap ? ["-vf", TONE_MAP_FILTER] : []),
  "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p",
  ...(classification.targetFps ? ["-fps_mode", "cfr", "-r", String(classification.targetFps)] : []),
  "-c:a", "aac", "-b:a", "192k",
  "-movflags", "+faststart",
];

function emptySummary(): ProbeSummary {
  return {durationSec: null, videoStartSec: 0, width: null, height: null, rotation: 0, fps: null, variableFrameRate: false, videoCodec: null, audioCodec: null, hasAudio: false};
}
