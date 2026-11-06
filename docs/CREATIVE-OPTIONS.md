# Options for a collaborating creative lead

29 October 2026. The owner-designated bot leads creative decisions; this engine
explains options, executes the chosen direction and returns evidence. This menu
describes the current generic ProjectAd engine, not every historical custom
composition in this workspace. Recheck code before a capability promise.

## Editorial choices

These are creative options, not automatic features or ranked recommendations.
The lead may propose others; the engine should identify a faithful route to them.

| Choice | What changes for the viewer | Dependency / tradeoff |
|---|---|---|
| Result-first | Understand the destination, then discover how | Real result source; preserve a reason to watch the process |
| Action/process-first | Curiosity begins with something happening | Readable action and identifiable subject; eventual payoff must answer it |
| Problem/correction | Follow a specific obstacle and resolution | Actual evidenced problem; no manufactured failure |
| Sensory study | Notice texture, gesture or transformation | A strong visible event; sound only if actually usable |
| Comparison | Understand a meaningful difference | Comparable facts/material; do not imply superiority without support |
| Quiet personal beat | Feel a real memory or point of view | Supplied truthful context and a suitable hold |
| Mini-story/joke | Recognize setup, change and payoff | Source-supported situation; reaction inserts need an extension |
| Visual explanation/metaphor | Understand an idea through spatial/form change | Subject-specific concept; likely custom primitive beyond stock cards |
| Repeated visual motif | Recognize a connection across stages | Two useful source-linked appearances before extracting a primitive |
| Loop / clear ending | Return naturally or finish decisively | Compatible source motion and wrap review; a loop is optional |

## Composition and information

| Implemented option | What it can express | Boundary |
|---|---|---|
| `hook` | Dominant headline, optional eyebrow | Generic full-frame typography; not a branded footage overlay |
| `statement` | One text idea, optional eyebrow | No arbitrary per-element placement |
| `stat` | One numeric/string value, label, optional detail | Font-loaded metric fitting preserves the full value on one line, with a 64 px size floor at current canvases; refuses unreadable fits. Actual labels still need review |
| `list` | Headline with 2–5 items | Staggered unless cut entry; five-item square layout uses compact spacing/type. Density and reading time still need review |
| `compare` | Headline and two stacked labelled panels | Not a split-screen footage comparison; alternative geometries need an extension |
| `chart` | 2–6 nonnegative bars, unit and optional source | Bars scale to maximum; finished labels preserve decimal source values. Square layouts with 5–6 bars use compact spacing/type |
| `quote` | Quote and optional attribution | Oversized quotation mark uses Georgia; supplied brand font alone does not cover all styling |
| `endCard` | Title, optional CTA and URL | CTA is a graphic pill, not an interactive video control |
| v2 `clip` | Source trim, cover/contain, focal position | Full-frame video only; no generic image scene, tracking or variable speed |
| Caption lane | Non-overlapping timed text | Fixed placement policy; not a multi-lane branded type system |

| Choice | Implemented | What needs more work |
|---|---|---|
| Canvas | 1080×1920, 1080×1080, 1920×1080 | Bespoke layout/reflow, platform-specific UI acceptance |
| FPS | Integer 24–60 | Fractional fps unsupported by current schema |
| Palette | Background, foreground, accent | Per-scene palette and richer brand token roles |
| Font | Bundled Inter and Noto Sans Devanagari fallback | Supplied fonts, explicit mixed-script runs, exact role loading |
| Text amount | Scene-specific length/item bounds | Limits do not guarantee fit or reading exposure |
| Branding | Editable text and colors | PNG mark/wordmark layer and supplied-font registry |
| Food framing | Cover/contain and fixed focus {x,y} | ROI rectangle, animated reframing, paper-header food window |
| Typography over footage | Generic captions | Ingredient cards, step lanes, configurable branded overlays |

## Movement, timing and sound

| Option | Status | Tradeoff / evidence needed |
|---|---|---|
| Graphic immediate entry/hold | Implemented `enter: cut`, `exit: cut` | Full information appears immediately; count actual reading exposure |
| Graphic spring entrance | Implemented `enter: spring` | Settling guides attention; current entrance begins blank and needs time |
| Graphic fade exit | Implemented `exit: fade` | Softens departure; final frames become less readable |
| Footage hard cut / fade-in | Implemented; optional 1–30-frame fade | Fade is over background, not a cross-dissolve with previous footage |
| Entrance/hold/exit choreography | Fixed per stock scene, durations editable | Detailed element timing needs bounded code changes |
| Source action matching | Manual trims/focus supported | Actual cut motion must be reviewed; no automatic match finder |
| Beat/frame planning | Implemented manual cue/grid sidecar | Review-only; no beat detector or automatic cut movement |
| Continuous morph, masking, camera, blur, 3D | Not generic scene features | Prototype a deterministic extension when the lead needs it |
| Natural source sound | Implemented per-clip mute and constant gain | Listen for cuts, noise and useful events; no automatic mix judgment |
| Silence | Available by explicit sound policy | A valid creative choice for an appropriate film |
| Music/SFX/room tone/ducking | Generic layered audio not implemented | Requires audio slice and measured/listened review |
| Narration/transcription | Historical custom compositions only; optional planned generic workflow | No default narration for cooking; Whisper not required for silent footage |

## How to present choices

Use a short table: option → viewer effect → implementation status → tradeoff →
recommendation, if requested. Start with the relevant choices; offer the full
menu and extensions when needed. Respect the lead's selected route and exclusions.
Do not default to three unrelated concepts after the lead has already chosen one.

Return a prototype for a visual decision, a render/time range for a motion
decision, and listened sound evidence for an audio decision. Keep unsupported,
unreviewed and director-rejected options distinct. The output quality audit
documents where existing implementation can fall short even for valid inputs.
