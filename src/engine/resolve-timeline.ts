import {
  CANVAS_PRESETS,
  ProjectValidationError,
  type Project,
  type SceneSpec,
} from "./project-schema";

export type ResolvedScene = {
  scene: SceneSpec;
  /** Start frame, inclusive. */
  from: number;
  durationInFrames: number;
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

/**
 * Converts author seconds into integer frame ranges once. Ranges are
 * start-inclusive/end-exclusive and scenes are back to back, so there are
 * no gaps and no double-counted frames.
 */
export const resolveTimeline = (project: Project): ResolvedTimeline => {
  const {fps} = project;
  const {width, height} = CANVAS_PRESETS[project.canvas];

  let cursor = 0;
  const issues: string[] = [];
  const scenes = project.scenes.map((scene, index): ResolvedScene => {
    const durationInFrames = toFrames(scene.durationSec, fps);
    if (durationInFrames < 1) issues.push(`scenes[${index}] (${scene.id}): duration rounds to zero frames at ${fps} fps`);
    const resolved = {scene, from: cursor, durationInFrames};
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
