# Shared text and design controls

Implemented 7 November 2026 for the existing `ProjectAd` v2 contract. These are
content-neutral capabilities for presenter edits, explainers, interviews,
brand/product films, stories and cooking. A project's brief supplies its rules.
No speech policy, platform safe zone or brand style is imposed globally.

## Local fonts and exact text runs

V2 adds optional `fonts`, `safeArea` and `textOverlays`. V1 stays strict and uses
its existing graphic scenes/caption behavior. Existing v2 projects default to
empty font/overlay arrays. The only added dependency is `@remotion/fonts` pinned
to 4.0.529, matching the installed renderer. No renderer upgrade occurred.

```json
{
  "assets": [{"id": "display-file", "kind": "font", "path": "fonts/my-display.ttf"}],
  "fonts": [{"id": "display", "asset": "display-file", "weight": 500, "style": "normal"}],
  "safeArea": {"top": 96, "right": 96, "bottom": 96, "left": 96},
  "textOverlays": [{
    "id": "opening", "lane": "title", "startSec": 0, "endSec": 3,
    "box": {"x": 0, "y": 0, "width": 1, "height": 0.4},
    "runs": [{"text": "अपनी कहानी कहिए।\n", "fontId": "devanagari"},
             {"text": "Tell your story.", "fontId": "inter"}],
    "style": {"fontSize": 62, "fontWeight": 650, "color": "#ffffff", "align": "left"},
    "motion": {"enter": "cut", "exit": "cut", "frames": 6}
  }]
}
```

This is a field fragment, not a complete project. Register font assets in the
same existing `assets/` manifest and run `video prepare`. Their prepared paths
and hashes use the existing media lock; font binaries remain git-ignored.
Registry IDs cannot replace the reserved `inter` or `devanagari` faces. Each
supplied face gets a separate ID and explicit weight/style; runs must use the
registered weight instead of relying on synthetic bold. There is no supplied
variable-font axis/range system yet. Graphic scene typography still uses the
legacy `brand.fontFamily`; the new font-ID API styles the overlay system.

All declared supplied fonts load before project content mounts. Missing/failing
font loads cancel the render. Built-in font loading still waits for Latin and
Devanagari samples. This checks loading, not exhaustive glyph coverage: inspect
the actual chosen language, conjuncts, marks and longest copy.

Runs preserve text, explicit spaces and line breaks. They remain whole shaped
spans: no code-unit splitting or automatic letter animation. Different-script
runs select their face explicitly. Default run font ID is `inter`; choose
`devanagari` for Devanagari rather than relying on an OS fallback. Color may be
overridden per run. This implementation has no automatic transcription,
word-level timing importer or karaoke highlighter.

## Boxes, safe areas and collisions

`safeArea` uses pixels on the requested canvas, each inset at least 64. Its
omission means 64 on all sides. Insets must leave a positive rectangle. They
are explicit project values: reconsider them when adapting the canvas. The
Blame Raunak study selects 192/160/420/64 for its vertical app-oriented study;
the general specimen selects 96 on every side. Neither is universal.

An overlay `box` is fractional within that rectangle. Position and size must
stay within 0–1 with x+width and y+height no greater than 1. Style font size,
padding, radius, stroke and letter spacing scale by the shorter canvas
dimension / 1080. Font size accepts 24–240 px reference sizes; acceptance still
depends on actual device reading and purpose, not this lower schema bound.

Style supports explicit `fontSize`, `fontWeight`, `color`, optional opaque
`background`, `align`, `verticalAlign`, `lineHeight`, `letterSpacing`, `padding`,
`borderRadius`, `strokeWidth` and `strokeColor`. Colors use six-digit hex.
There is no arbitrary CSS/HTML in project data.

Output seconds round once to inclusive-start/exclusive-end frames. Reject zero
frame spans, timeline overflow and duplicate IDs. Simultaneous cues in the same
lane are rejected; different lanes can overlap in time only when their boxes
do not intersect. Adjacent/touching cues are valid. This is conservative box
geometry, not face tracking or visual saliency. A title can still cover a face
inside a valid box; inspect the footage.

Legacy `captions` and `textOverlays` cannot coexist in the same project, because
the old caption component has its own fixed placement. Translate the needed
caption cues into explicit overlay boxes instead of accepting silent overlap.
The existing captions API is unchanged for projects without overlays.

Rendered text is checked after fonts are ready. A box that overflows fails with
its cue ID; copy is never silently shortened or shrunk. The DOM check catches
layout overflow, not every glyph-ink, contrast or comprehension defect. Review
the actual images, language shaping, strokes and moving joins.

Enter choices are cut, fade and a short rise; exits are cut/fade. Edge duration
is bounded for short cues. Rise travel stays within available safe-rectangle
clearance. Omission means cut/held text. No CSS runtime animation is used.
`video plan` includes each overlay's boundaries, next frame and midpoint.

## Images and backgrounds

V2 accepts a still-image scene:

```json
{"id": "wordmark", "type": "image", "asset": "mark", "durationSec": 2, "fit": "contain"}
```

The asset must be a prepared PNG/JPEG image. `contain` is default; `cover`
crops. This is a full-frame scene, not a reaction overlay, alpha-video player,
Ken Burns camera or tracking system. Important artwork inside an image needs
visual safe-area review. JPEG EXIF/orientation coverage remains an existing gap.

Optional `brand.backgroundStyle: "flat" | "radial"` applies to all project
versions. Omission retains the old radial wash. A flat project does not inherit
cyan or a gradient. Existing graphic geometry is otherwise unchanged.

## Detecting revision drift

```powershell
npm.cmd run video -- diff projects/my-project/project.json --against=out/accepted-project.json --allow=scenes[0].props.headline
```

This reads and parses both projects without loading media or changing files.
Output lists exact changed field paths and before/after values. It returns
exit 1 if a change lies outside the allowed paths, otherwise 0. No allow list
means every difference is unexpected. An allowed parent permits its subtree;
use the narrowest meaningful path. Array order/indices remain significant.
Defaults normalize through the same parser and object-key order is ignored.

This is a review aid, not a security boundary or creative approver. It cannot
check facts, rendered appearance, external-file changes or audience impact.
Keep the actual approved snapshot, media lock/hashes and brief ledger. Use
`prepare --check` for local media verification and actual review for meaning.

## First implementation scope

Examples: `projects/text-design-study/` is an asset-free non-cooking specimen;
`projects/blame-raunak-design/` is a sourced presenter/wordmark design sampler.
Its private assets must be copied separately when restoring another laptop.

Layered audio/ducking, reaction overlays, animated reframing, bespoke morphs and
advanced layout variants remain future slices. This implements the common
font/text foundation of the existing slice 3; it does not complete Stage 1 or
establish muted comprehension, motion/audio quality or phone acceptance.
