/**
 * Runs Remotion's CLI and its bundled ffmpeg/ffprobe (n7.1). No system PATH
 * install is needed. The bundled build is minimal: libx264, AAC, MP3, PNG,
 * scale/zscale/tonemap filters and default autorotate on re-encode (verified
 * to rotate frames upright), but no drawing, test-pattern or fps filters.
 */
import {spawnSync} from "node:child_process";
import {createRequire} from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
export const root = path.resolve(import.meta.dirname, "..", "..");
const cli = path.join(path.dirname(require.resolve("@remotion/cli/package.json")), "remotion-cli.js");

export const remotion = (args: string[], capture = false): string => {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: root,
    shell: false,
    encoding: "utf8",
    ...(capture ? {maxBuffer: 64 * 1024 * 1024} : {stdio: "inherit"}),
  });
  if (result.error) throw new Error(`Could not start Remotion: ${result.error.message}`);
  if (result.status !== 0) {
    throw new Error(`Remotion ${args[0]} failed (${result.signal ? `signal ${result.signal}` : `exit ${result.status}`}): ${capture ? result.stderr.trim() : "see output above"}`);
  }
  return result.stdout ?? "";
};

export type FfprobeStream = {
  codec_type?: string;
  codec_name?: string;
  width?: number;
  height?: number;
  pix_fmt?: string;
  r_frame_rate?: string;
  avg_frame_rate?: string;
  duration?: string;
  start_time?: string;
  color_transfer?: string;
  side_data_list?: {side_data_type?: string; rotation?: number}[];
  tags?: Record<string, string>;
};

export type FfprobeResult = {
  streams?: FfprobeStream[];
  format?: {duration?: string; format_name?: string};
};

export const ffprobe = (file: string): FfprobeResult =>
  JSON.parse(remotion(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", file], true));

export const ffmpeg = (args: string[]): void => {
  remotion(["ffmpeg", "-hide_banner", "-v", "error", "-y", ...args], true);
};

/** First line of `ffmpeg -version`, e.g. "ffmpeg version n7.1 Copyright ...". */
export const ffmpegVersion = (): string => remotion(["ffmpeg", "-version"], true).split(/\r?\n/)[0];
/** Just the version token, e.g. "n7.1", so the lock does not churn on banner text. */
export const ffmpegVersionTag = (): string => ffmpegVersion().split(" ")[2] ?? "unknown";
