import {z} from "zod";

export const CANVAS_PRESETS = {
  vertical: {width: 1080, height: 1920},
  square: {width: 1080, height: 1080},
  landscape: {width: 1920, height: 1080},
} as const;

export type CanvasPreset = keyof typeof CANVAS_PRESETS;

const brandSchema = z.object({
  background: z.string().default("#06101c"),
  foreground: z.string().default("#f8fbff"),
  accent: z.string().default("#62e7ff"),
  fontFamily: z
    .string()
    .default("Inter, 'Segoe UI', system-ui, sans-serif"),
});

const sceneBase = {
  id: z.string().min(1),
  durationSec: z.number().positive().max(120),
};

export const sceneSchema = z.discriminatedUnion("type", [
  z.object({
    ...sceneBase,
    type: z.literal("hook"),
    props: z.object({
      headline: z.string().min(1).max(90),
      eyebrow: z.string().max(40).optional(),
    }),
  }),
  z.object({
    ...sceneBase,
    type: z.literal("statement"),
    props: z.object({
      text: z.string().min(1).max(160),
      eyebrow: z.string().max(40).optional(),
    }),
  }),
  z.object({
    ...sceneBase,
    type: z.literal("stat"),
    props: z.object({
      value: z.string().min(1).max(20),
      label: z.string().min(1).max(90),
      detail: z.string().max(120).optional(),
    }),
  }),
  z.object({
    ...sceneBase,
    type: z.literal("list"),
    props: z.object({
      headline: z.string().min(1).max(70),
      items: z.array(z.string().min(1).max(60)).min(2).max(5),
    }),
  }),
  z.object({
    ...sceneBase,
    type: z.literal("compare"),
    props: z.object({
      headline: z.string().min(1).max(70),
      left: z.object({label: z.string().min(1).max(24), text: z.string().min(1).max(80)}),
      right: z.object({label: z.string().min(1).max(24), text: z.string().min(1).max(80)}),
    }),
  }),
  z.object({
    ...sceneBase,
    type: z.literal("chart"),
    props: z.object({
      headline: z.string().min(1).max(70),
      unit: z.string().max(4).default(""),
      bars: z
        .array(z.object({label: z.string().min(1).max(24), value: z.number().nonnegative()}))
        .min(2)
        .max(6),
      source: z.string().max(100).optional(),
    }),
  }),
  z.object({
    ...sceneBase,
    type: z.literal("quote"),
    props: z.object({
      quote: z.string().min(1).max(140),
      attribution: z.string().max(60).optional(),
    }),
  }),
  z.object({
    ...sceneBase,
    type: z.literal("endCard"),
    props: z.object({
      title: z.string().min(1).max(60),
      cta: z.string().max(60).optional(),
      url: z.string().max(80).optional(),
    }),
  }),
]);

export type SceneSpec = z.infer<typeof sceneSchema>;
export type SceneType = SceneSpec["type"];

const captionSchema = z
  .object({
    startSec: z.number().min(0),
    endSec: z.number().positive(),
    text: z.string().min(1),
  })
  .refine((c) => c.endSec > c.startSec, {
    message: "endSec must be greater than startSec",
  });

export const projectSchema = z
  .object({
    version: z.literal(1),
    id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "use lowercase letters, digits, hyphens"),
    title: z.string().min(1),
    canvas: z.enum(["vertical", "square", "landscape"]).default("vertical"),
    fps: z.number().int().min(24).max(60).default(30),
    seed: z.number().int().default(1),
    brand: brandSchema.default(() => brandSchema.parse({})),
    scenes: z.array(sceneSchema).min(1),
    captions: z.array(captionSchema).default([]),
  })
  .superRefine((project, ctx) => {
    const seen = new Set<string>();
    project.scenes.forEach((scene, index) => {
      if (seen.has(scene.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["scenes", index, "id"],
          message: `duplicate scene id "${scene.id}"`,
        });
      }
      seen.add(scene.id);
    });
  });

/** Author-facing input (defaults optional). */
export type ProjectInput = z.input<typeof projectSchema>;
/** Parsed project with defaults applied. */
export type Project = z.output<typeof projectSchema>;

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
