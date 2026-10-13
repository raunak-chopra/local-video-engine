import {z} from "zod";
import {assetSchema} from "./assets";

export const CANVAS_PRESETS = {
  vertical: {width: 1080, height: 1920},
  square: {width: 1080, height: 1080},
  landscape: {width: 1920, height: 1080},
} as const;

export type CanvasPreset = keyof typeof CANVAS_PRESETS;

const brandSchema = z.strictObject({
  background: z.string().default("#06101c"),
  foreground: z.string().default("#f8fbff"),
  accent: z.string().default("#62e7ff"),
  fontFamily: z
    .string()
    // Inter has no Devanagari glyphs; the browser falls back per glyph to the
    // bundled Noto face instead of an OS font that differs between machines.
    .default(`"Inter Variable", "Noto Sans Devanagari Variable"`),
});

const sceneBase = {
  id: z.string().min(1),
  durationSec: z.number().positive().max(120),
};

export const sceneSchema = z.discriminatedUnion("type", [
  z.strictObject({
    ...sceneBase,
    type: z.literal("hook"),
    props: z.strictObject({
      headline: z.string().min(1).max(90),
      eyebrow: z.string().max(40).optional(),
    }),
  }),
  z.strictObject({
    ...sceneBase,
    type: z.literal("statement"),
    props: z.strictObject({
      text: z.string().min(1).max(160),
      eyebrow: z.string().max(40).optional(),
    }),
  }),
  z.strictObject({
    ...sceneBase,
    type: z.literal("stat"),
    props: z.strictObject({
      value: z.string().min(1).max(20),
      label: z.string().min(1).max(90),
      detail: z.string().max(120).optional(),
    }),
  }),
  z.strictObject({
    ...sceneBase,
    type: z.literal("list"),
    props: z.strictObject({
      headline: z.string().min(1).max(70),
      items: z.array(z.string().min(1).max(60)).min(2).max(5),
    }),
  }),
  z.strictObject({
    ...sceneBase,
    type: z.literal("compare"),
    props: z.strictObject({
      headline: z.string().min(1).max(70),
      left: z.strictObject({label: z.string().min(1).max(24), text: z.string().min(1).max(80)}),
      right: z.strictObject({label: z.string().min(1).max(24), text: z.string().min(1).max(80)}),
    }),
  }),
  z.strictObject({
    ...sceneBase,
    type: z.literal("chart"),
    props: z.strictObject({
      headline: z.string().min(1).max(70),
      unit: z.string().max(4).default(""),
      bars: z
        .array(z.strictObject({label: z.string().min(1).max(24), value: z.number().nonnegative()}))
        .min(2)
        .max(6),
      source: z.string().max(100).optional(),
    }),
  }),
  z.strictObject({
    ...sceneBase,
    type: z.literal("quote"),
    props: z.strictObject({
      quote: z.string().min(1).max(140),
      attribution: z.string().max(60).optional(),
    }),
  }),
  z.strictObject({
    ...sceneBase,
    type: z.literal("endCard"),
    props: z.strictObject({
      title: z.string().min(1).max(60),
      cta: z.string().max(60).optional(),
      url: z.string().max(80).optional(),
    }),
  }),
]);

/**
 * v2 footage scene. Its length comes from the source trim, so it takes no
 * `durationSec`. Times are seconds on the source file's own timeline.
 */
const clipSceneSchema = z
  .strictObject({
    id: z.string().min(1),
    type: z.literal("clip"),
    asset: z.string().min(1),
    inSec: z.number().min(0),
    outSec: z.number().positive(),
    /** cover fills the canvas and crops; contain shows the whole frame. */
    fit: z.enum(["cover", "contain"]).default("cover"),
    /** Which part of the source stays in view when cropping (0-1, 0.5 = centre). */
    focus: z
      .strictObject({x: z.number().min(0).max(1), y: z.number().min(0).max(1)})
      .default({x: 0.5, y: 0.5}),
    sourceAudio: z
      .strictObject({mute: z.boolean().default(false), gainDb: z.number().min(-60).max(12).default(0)})
      .default({mute: false, gainDb: 0}),
    /** Hard cut by default; a fade is an explicit creative choice. */
    transitionIn: z.strictObject({type: z.literal("fade"), frames: z.number().int().min(1).max(30)}).optional(),
  })
  .refine((clip) => clip.outSec > clip.inSec, {message: "outSec must be greater than inSec", path: ["outSec"]});

const reelSceneSchema = z.discriminatedUnion("type", [...sceneSchema.options, clipSceneSchema]);

/** v1 graphic scenes. */
export type GraphicSceneSpec = z.infer<typeof sceneSchema>;
export type ClipSceneSpec = z.infer<typeof clipSceneSchema>;
export type SceneSpec = z.infer<typeof reelSceneSchema>;
export type SceneType = SceneSpec["type"];

const captionSchema = z
  .strictObject({
    startSec: z.number().min(0),
    endSec: z.number().positive(),
    text: z.string().min(1),
  })
  .refine((c) => c.endSec > c.startSec, {
    message: "endSec must be greater than startSec",
  });

const sharedProjectFields = {
  id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "use lowercase letters, digits, hyphens"),
  title: z.string().min(1),
  canvas: z.enum(["vertical", "square", "landscape"]).default("vertical"),
  fps: z.number().int().min(24).max(60).default(30),
  seed: z.number().int().default(1),
  brand: brandSchema.default(() => brandSchema.parse({})),
  scenes: z.array(sceneSchema).min(1),
  captions: z.array(captionSchema).default([]),
};

const rejectDuplicateIds = (
  items: {id: string}[],
  key: string,
  ctx: z.core.$RefinementCtx,
) => {
  const seen = new Set<string>();
  items.forEach((item, index) => {
    if (seen.has(item.id)) {
      ctx.addIssue({code: "custom", path: [key, index, "id"], message: `duplicate ${key.slice(0, -1)} id "${item.id}"`});
    }
    seen.add(item.id);
  });
};

/** v1: graphics-only projects. Kept unchanged so existing projects keep validating. */
const projectV1Schema = z
  .strictObject({version: z.literal(1), ...sharedProjectFields})
  .superRefine((project, ctx) => rejectDuplicateIds(project.scenes, "scenes", ctx));

/** v2: reel projects that reference prepared media assets. */
const projectV2Schema = z
  .strictObject({
    version: z.literal(2),
    ...sharedProjectFields,
    scenes: z.array(reelSceneSchema).min(1),
    assets: z.array(assetSchema).default([]),
  })
  .superRefine((project, ctx) => {
    rejectDuplicateIds(project.scenes, "scenes", ctx);
    rejectDuplicateIds(project.assets, "assets", ctx);
    const kinds = new Map(project.assets.map((asset) => [asset.id, asset.kind]));
    project.scenes.forEach((scene, index) => {
      if (scene.type !== "clip") return;
      const kind = kinds.get(scene.asset);
      if (kind !== "video") {
        ctx.addIssue({
          code: "custom",
          path: ["scenes", index, "asset"],
          message: kind ? `asset "${scene.asset}" is ${kind}, not video` : `unknown asset "${scene.asset}"`,
        });
      }
    });
  });

export const projectSchema = z.discriminatedUnion("version", [projectV1Schema, projectV2Schema], {
  error: "version must be 1 (graphics) or 2 (reels with media assets)",
});

/** Author-facing input (defaults optional). */
export type ProjectInput = z.input<typeof projectSchema>;
/** Parsed project with defaults applied. */
export type Project = z.output<typeof projectSchema>;
export type ProjectV2 = Extract<Project, {version: 2}>;

export class ProjectValidationError extends Error {
  readonly issues: string[];
  constructor(issues: string[]) {
    super(`Invalid project:\n${issues.map((i) => `  - ${i}`).join("\n")}`);
    this.name = "ProjectValidationError";
    this.issues = issues;
  }
}

/** Parse and validate; throws with field paths such as `scenes[1].props.text`. */
export const parseProject = (input: unknown): Project => {
  const result = projectSchema.safeParse(input);
  if (result.success) return result.data;
  throw new ProjectValidationError(
    result.error.issues.map((issue) => {
      const path = issue.path
        .map((p, i) => (typeof p === "number" ? `[${p}]` : i === 0 ? String(p) : `.${String(p)}`))
        .join("");
      return `${path || "(root)"}: ${issue.message}`;
    }),
  );
};
