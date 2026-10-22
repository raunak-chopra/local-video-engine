import {z} from "zod";
import type {Project} from "./project-schema";
import {ProjectValidationError} from "./project-schema";
import {resolveTimeline, type ResolvedTimeline} from "./resolve-timeline";

const atSchema = z.union([
  z.strictObject({frame: z.number().int().nonnegative()}),
  z.strictObject({beat: z.number().nonnegative()}),
]);

/** Planning metadata only. The renderer still takes project.json as its clock. */
export const directionSchema = z.strictObject({
  version: z.literal(1),
  projectId: z.string().min(1),
  beatGrid: z.strictObject({
    bpm: z.number().min(20).max(300),
    offsetSec: z.number().min(0),
    beatsPerBar: z.number().int().min(1).max(16).default(4),
    provenance: z.string().min(1),
  }).optional(),
  cues: z.array(z.strictObject({
    id: z.string().min(1),
    sceneId: z.string().min(1),
    at: atSchema,
    holdFrames: z.number().int().positive().default(1),
    role: z.enum(["hook", "setup", "progress", "proof", "payoff", "cta", "transition"]),
    purpose: z.string().min(1),
  })).default([]),
});
export type Direction = z.infer<typeof directionSchema>;

/** Round each absolute beat, never accumulate rounded beat lengths (drift). */
export const beatToFrame = (beat: number, grid: NonNullable<Direction["beatGrid"]>, fps: number) =>
  Math.round((grid.offsetSec + beat * 60 / grid.bpm) * fps);

export const parseDirection = (input: unknown): Direction => {
  const parsed = directionSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  throw new ProjectValidationError(parsed.error.issues.map((issue) =>
    `direction.${issue.path.join(".")}: ${issue.message}`));
};

export const buildReviewPlan = (project: Project, direction?: Direction, resolved?: ResolvedTimeline) => {
  const timeline = resolved ?? resolveTimeline(project);
  const {durationInFrames, fps} = timeline;
  const issues: string[] = [];
  if (direction && direction.projectId !== project.id) issues.push("direction.projectId does not match project.id");
  const grid = direction?.beatGrid;
  const seen = new Set<string>();
  const cues = (direction?.cues ?? []).map((cue, index) => {
    const label = `direction.cues[${index}] (${cue.id})`;
    if (seen.has(cue.id)) issues.push(`${label}: duplicate cue id`);
    seen.add(cue.id);
    if ("beat" in cue.at && !grid) issues.push(`${label}: beat timing requires beatGrid`);
    const frame = "frame" in cue.at ? cue.at.frame : grid ? beatToFrame(cue.at.beat, grid, fps) : 0;
    const endFrame = frame + cue.holdFrames;
    const scene = timeline.scenes.find((s) => s.scene.id === cue.sceneId);
    if (!scene) issues.push(`${label}: unknown sceneId "${cue.sceneId}"`);
    else if (frame < scene.from || endFrame > scene.from + scene.durationInFrames) {
      issues.push(`${label}: cue/hold [${frame}, ${endFrame}) is outside scene "${cue.sceneId}"`);
    }
    return {...cue, frame, endFrame};
  }).sort((a, b) => a.frame - b.frame || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  if (grid && beatToFrame(0, grid, fps) >= durationInFrames) issues.push("direction.beatGrid starts after the timeline");
  if (issues.length) throw new ProjectValidationError(issues);

  const samples = new Map<number, Set<string>>();
  const add = (frame: number, reason: string) => {
    if (frame < 0 || frame >= durationInFrames) return;
    const reasons = samples.get(frame) ?? new Set<string>();
    reasons.add(reason);
    samples.set(frame, reasons);
  };
  add(0, "opening");
  add(durationInFrames - 1, "final / loop seam");
  for (const {scene, from, durationInFrames: length} of timeline.scenes) {
    add(from - 1, `${scene.id}: before cut`);
    add(from, `${scene.id}: first`);
    if (length > 1) add(from + 1, `${scene.id}: entrance +1`);
    add(from + Math.floor(length / 2), `${scene.id}: midpoint`);
    add(from + length - 1, `${scene.id}: last`);
  }
  for (const [index, cue] of timeline.captions.entries()) {
    for (const frame of [cue.startFrame - 1, cue.startFrame, cue.endFrame - 1, cue.endFrame]) add(frame, `caption ${index}: boundary`);
  }
  const beats: {beat: number; bar: number; frame: number}[] = [];
  if (grid) {
    const count = Math.ceil((durationInFrames / fps - grid.offsetSec) * grid.bpm / 60);
    // Bound work for malformed/unusually large planning inputs.
    if (count > 10000) throw new Error("Beat review exceeds 10000 samples; split the project for review.");
    for (let beat = 0; beat < count; beat++) {
      const frame = beatToFrame(beat, grid, fps);
      if (frame >= durationInFrames) break;
      beats.push({beat, bar: Math.floor(beat / grid.beatsPerBar) + 1, frame});
      add(frame, `beat ${beat}`);
    }
  }
  for (const cue of cues) {
    add(cue.frame - 1, `${cue.id}: before cue`);
    add(cue.frame, `${cue.id}: ${cue.role}`);
    add(cue.frame + Math.floor((cue.holdFrames - 1) / 2), `${cue.id}: hold midpoint`);
    add(cue.endFrame - 1, `${cue.id}: hold last`);
  }
  return {
    version: 1, projectId: project.id, canvas: project.canvas, fps,
    durationInFrames, beatGrid: grid ?? null,
    scenes: timeline.scenes.map(({scene, from, durationInFrames: length}) => ({id: scene.id, type: scene.type, from, endFrame: from + length})),
    cues, beats,
    frames: [...samples].sort(([a], [b]) => a - b).map(([frame, reasons]) => ({frame, reasons: [...reasons]})),
    warnings: [
      "Review samples are a checklist, not a render, readability measurement or creative approval.",
      ...(grid ? ["Beat grid is supplied planning data; this command does not analyze or verify music."] : []),
    ],
  };
};
