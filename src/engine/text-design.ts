import {z} from "zod";

const id = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);
export const colorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, "use a six-digit hex color");
export const safeAreaSchema = z.strictObject({
  top: z.number().min(64), right: z.number().min(64),
  bottom: z.number().min(64), left: z.number().min(64),
});

export const fontSpecSchema = z.strictObject({
  id,
  asset: id,
  weight: z.number().int().min(100).max(900).default(500),
  style: z.enum(["normal", "italic"]).default("normal"),
});
export type FontSpec = z.infer<typeof fontSpecSchema>;
export const BUILTIN_FONTS: Record<string, string> = {
  inter: "Inter Variable", devanagari: "Noto Sans Devanagari Variable",
};
export const isBuiltinFont = (fontId: string) => Object.prototype.hasOwnProperty.call(BUILTIN_FONTS, fontId);
export const fontFamilyFor = (fontId: string) => isBuiltinFont(fontId) ? BUILTIN_FONTS[fontId] : `ProjectFont-${fontId}`;

const boxSchema = z.strictObject({
  x: z.number().min(0).max(1), y: z.number().min(0).max(1),
  width: z.number().positive().max(1), height: z.number().positive().max(1),
}).refine((b) => b.x + b.width <= 1.000001 && b.y + b.height <= 1.000001,
  "box must fit inside the safe rectangle");

export const textOverlaySchema = z.strictObject({
  id,
  lane: id,
  startSec: z.number().nonnegative(), endSec: z.number().positive(),
  box: boxSchema,
  runs: z.array(z.strictObject({
    text: z.string().min(1), fontId: id.default("inter"),
    color: colorSchema.optional(),
  })).min(1),
  style: z.strictObject({
    fontSize: z.number().min(24).max(240).default(52),
    fontWeight: z.number().int().min(100).max(900).default(650),
    color: colorSchema.default("#ffffff"),
    background: colorSchema.optional(),
    align: z.enum(["left", "center", "right"]).default("left"),
    verticalAlign: z.enum(["top", "center", "bottom"]).default("top"),
    lineHeight: z.number().min(1).max(2).default(1.25),
    letterSpacing: z.number().min(-4).max(12).default(0),
    padding: z.number().min(0).max(64).default(0),
    borderRadius: z.number().min(0).max(64).default(0),
    strokeWidth: z.number().min(0).max(6).default(0),
    strokeColor: colorSchema.default("#171717"),
  }).default(() => ({fontSize: 52, fontWeight: 650, color: "#ffffff", align: "left" as const, verticalAlign: "top" as const, lineHeight: 1.25, letterSpacing: 0, padding: 0, borderRadius: 0, strokeWidth: 0, strokeColor: "#171717"})),
  motion: z.strictObject({
    enter: z.enum(["cut", "fade", "rise"]).default("cut"),
    exit: z.enum(["cut", "fade"]).default("cut"),
    frames: z.number().int().min(1).max(30).default(6),
  }).optional(),
}).refine((cue) => cue.endSec > cue.startSec, "endSec must be greater than startSec");
export type TextOverlay = z.infer<typeof textOverlaySchema>;
export type SafeArea = z.infer<typeof safeAreaSchema>;
export type OverlayBox = TextOverlay["box"];

/** Explicit project pixels; the default is content-neutral, not an app preset. */
export const safeRectangle = (width: number, height: number, insets?: SafeArea) => {
  const area = insets ?? {top: 64, right: 64, bottom: 64, left: 64};
  const rect = {x: area.left, y: area.top, width: width - area.left - area.right, height: height - area.top - area.bottom};
  if (rect.width <= 0 || rect.height <= 0) throw new Error("safeArea leaves no usable rectangle for this canvas");
  return rect;
};
export const boxesIntersect = (a: OverlayBox, b: OverlayBox) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
