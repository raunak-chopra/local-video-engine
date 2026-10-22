import {
  CANVAS_PRESETS,
  ProjectValidationError,
  type Project,
  type SceneSpec,
} from "./project-schema";
import type {MediaMap} from "./assets";

export type ResolvedScene = {
  scene: SceneSpec;
  /** Start frame, inclusive. */
  from: number;
  durationInFrames: number;
  /** For clips: source range in output frames, start-inclusive/end-exclusive. */
  trim?: {before: number; after: number};
};

export type ResolvedCaption = {
  startFrame: number;
  endFrame: number;
  text: string;
};

export type ResolvedTimeline = {
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  scenes: ResolvedScene[];
  captions: ResolvedCaption[];
};

const toFrames = (seconds: number, fps: number) => Math.round(seconds * fps);

/** Allowed overshoot of a trim past the probed source end: half an output frame. */
const trimTolerance = (fps: number) => 0.5 / fps;

/**
 * Converts author seconds into integer frame ranges once. Ranges are
 * start-inclusive/end-exclusive and scenes are back to back, so there are
 * no gaps and no double-counted frames. Clip length derives from its trim:
 * both trim points are rounded to frames, so the clip spans exactly
 * `after - before` frames. With prepared `media`, trims are checked against
 * the probed source duration.
 */
export const resolveTimeline = (project: Project, media?: MediaMap): ResolvedTimeline => {
  const {fps} = project;
  const {width, height} = CANVAS_PRESETS[project.canvas];

  let cursor = 0;
  const issues: string[] = [];
  const scenes = project.scenes.map((scene, index): ResolvedScene => {
    const label = `scenes[${index}] (${scene.id})`;
    let durationInFrames: number;
    let trim: ResolvedScene["trim"];
    if (scene.type === "clip") {
      trim = {before: toFrames(scene.inSec, fps), after: toFrames(scene.outSec, fps)};
      durationInFrames = trim.after - trim.before;
      const source = media?.[scene.asset];
      if (media && !source) issues.push(`${label}: asset "${scene.asset}" has no prepared media`);
      if (source?.durationSec && scene.outSec > source.durationSec + trimTolerance(fps)) {
        issues.push(`${label}: outSec ${scene.outSec} is past the end of "${scene.asset}" (${source.durationSec.toFixed(3)} s)`);
      }
    } else {
      durationInFrames = toFrames(scene.durationSec, fps);
    }
    if (durationInFrames < 1) issues.push(`${label}: duration rounds to zero frames at ${fps} fps`);
    const resolved = {scene, from: cursor, durationInFrames, ...(trim ? {trim} : {})};
    cursor += durationInFrames;
    return resolved;
  });
  const durationInFrames = cursor;

  const captions = project.captions.map((cue, index): ResolvedCaption => {
    const startFrame = Math.round(cue.startSec * fps);
    const endFrame = Math.round(cue.endSec * fps);
    if (endFrame <= startFrame) issues.push(`captions[${index}]: span rounds to zero frames at ${fps} fps`);
    if (endFrame > durationInFrames) {
      issues.push(
        `captions[${index}]: ends at frame ${endFrame}, after the timeline end (${durationInFrames})`,
      );
    }
    return {startFrame, endFrame, text: cue.text};
  });
  const ordered = captions.map((cue, index) => ({...cue, index})).sort((a, b) => a.startFrame - b.startFrame);
  // Compare each cue with the furthest-reaching earlier cue, so one long cue
  // that covers several later ones reports every overlap, not only the first.
  let reach = ordered[0];
  for (const cue of ordered.slice(1)) {
    if (cue.startFrame < reach.endFrame) {
      issues.push(`captions[${cue.index}]: overlaps captions[${reach.index}] in the single caption lane`);
    }
    if (cue.endFrame > reach.endFrame) reach = cue;
  }
  if (issues.length > 0) throw new ProjectValidationError(issues);

  return {width, height, fps, durationInFrames, scenes, captions};
};
