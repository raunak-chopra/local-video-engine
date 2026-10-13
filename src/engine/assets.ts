import {z} from "zod";

/**
 * Formats the Stage 1 engine accepts. Extensions alone do not prove decode
 * support: `prepare` probes each file and records whether it is ready, was
 * converted, or is rejected.
 */
export const ASSET_EXTENSIONS = {
  video: ["mp4", "mov"],
  image: ["png", "jpg", "jpeg"],
  audio: ["wav", "mp3"],
  font: ["ttf", "otf", "woff2"],
} as const;

export type AssetKind = keyof typeof ASSET_EXTENSIONS;

/** Formats named in the asset guidance that the first milestone defers. */
const DEFERRED_EXTENSIONS: Record<string, string> = {
  gif: "GIF is deferred; export the reaction as MP4 or PNG",
  webm: "WebM/alpha overlays are deferred; export as MP4 or PNG",
  cube: "LUT application is deferred",
  aep: "After Effects projects cannot be rendered; export a clip",
  prproj: "Premiere projects cannot be rendered; export a clip",
  mogrt: "Motion graphics templates cannot be rendered; export a clip",
};

export const extensionOf = (file: string) => file.slice(file.lastIndexOf(".") + 1).toLowerCase();

/** Relative, forward-slash path inside `assets/`; no drive, root or `..` escape. */
const isSafeRelativePath = (value: string) =>
  !value.includes("\\") &&
  !value.startsWith("/") &&
  !/^[a-zA-Z]:/.test(value) &&
  value.split("/").every((segment) => segment !== "" && segment !== "." && segment !== "..");

export const assetSchema = z
  .strictObject({
    id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "use lowercase letters, digits, hyphens"),
    kind: z.enum(["video", "image", "audio", "font"]),
    /** Path relative to the repository's `assets/` folder, e.g. `footage/pakode-01.mp4`. */
    path: z.string().min(1).refine(isSafeRelativePath, "use a relative path inside assets/ with forward slashes"),
    /** Provenance from `assets/LICENSES.md`. Optional: the owner's standing cleared-assets statement applies. */
    rights: z
      .strictObject({
        source: z.string().min(1),
        itemId: z.string().min(1).optional(),
        license: z.string().min(1).optional(),
        notes: z.string().optional(),
      })
      .optional(),
  })
  .superRefine((asset, ctx) => {
    const ext = extensionOf(asset.path);
    const allowed: readonly string[] = ASSET_EXTENSIONS[asset.kind];
    if (allowed.includes(ext)) return;
    ctx.addIssue({
      code: "custom",
      path: ["path"],
      message: DEFERRED_EXTENSIONS[ext] ?? `.${ext} is not a supported ${asset.kind} format (use ${allowed.join(", ")})`,
    });
  });

export type AssetSpec = z.infer<typeof assetSchema>;

/**
 * What the composition receives for each asset after `prepare`: a path inside
 * `public/` for `staticFile()` plus probed facts. Display dimensions already
 * account for rotation metadata.
 */
export const preparedMediaSchema = z.strictObject({
  kind: z.enum(["video", "image", "audio", "font"]),
  src: z.string().startsWith("generated-media/"),
  durationSec: z.number().positive().nullable(),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  rotation: z.number(),
  fps: z.number().positive().nullable(),
  hasAudio: z.boolean(),
});

export type PreparedMedia = z.infer<typeof preparedMediaSchema>;

export const mediaMapSchema = z.record(z.string(), preparedMediaSchema);
export type MediaMap = z.infer<typeof mediaMapSchema>;
