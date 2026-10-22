# Final reel-engine update plan

Date: 13 October 2026. Status: Stage 0 repaired and verified; Stage 1 onward remains planned. See [completion evidence and next sequence](STAGE-0-COMPLETION.md).

The [readiness audit](REELS-READINESS-AUDIT-2026-10-13.md) records the earlier baseline. Its open Stage 0 defects are superseded by the completion report. Footage/audio/reaction and mixed-script reel features remain unbuilt. Generic default font loading, caption placement, CLI records/export checks and regression validation now work.

## Decision

Keep the existing local Remotion engine. Build an end-to-end path from selected footage to an editable cooking reel, then improve repeatability and creative choices. Use folder intake plus this chat initially; add a local file-picker interface after the media contract and revision flow work.

The creative starting point is **relevant opening → meaningful progress → satisfying payoff → optional viewer action**. It is a flexible editorial structure, not a viral formula. Preserve the owner's faceless cooking direction, Hindi/Hinglish/English text, music and original footage. Meme/reaction material remains an optional emotion accent.

Owner decisions incorporated on 13 October 2026: Stage 1 covers both **30–60 second recipes** and **3–10 second own-footage meme-style reels**. It includes a reusable `reactionInsert` image/video overlay and optional audio sting, mixed Devanagari/Latin text runs, music plus cooking ASMR/SFX, and the playbook's hook-first, story-tension, loop-match and “send this to…” options. These capabilities must exist and be demonstrated; they are not compulsory effects on every reel. Length ranges express the owner's formats, not platform reach thresholds.

This plan governs the reel extension. `REEL-PLAYBOOK.md` remains the short operational guide; the two dated research files retain source evidence. Update older architecture/handoff documents to reference this plan when implementation begins. Do not introduce another competing project format or instruction framework.

## Review scope and evidence

Compared the checked-in `HEAD:docs/REEL-PLAYBOOK.md` baseline with the current working copy, which already includes this conversation's corrections. The baseline is the earlier version the user described as Claude's; Git content alone does not establish authorship. Both were reviewed against the saved research and live code.

Inspected the project schema, resolver, composition, caption component, shared animation wrapper, render CLI, asset guidance, Git ignores and contact-sheet helper. Existing dirty files were preserved. No dependencies, compositions or media were added for this audit.

Important baseline findings:

- Generic `ProjectAd` supports eight text/graphic scenes and timed caption cues, but no video clips, asset manifest or audio track. Product-specific audio does not provide generic reel audio support.
- `assets/` contains guidance and placeholder files, not pilot footage or supplied fonts. It is not a browser-served media library.
- `ffmpeg` and `ffprobe` were not found through `Get-Command` on PATH. This does not establish that no binaries exist elsewhere; executable discovery is an implementation prerequisite.
- `docs/VIDEO-SYSTEM.md` still routes every video through narration and says future videos need a separate composition. That conflicts with silent cooking and the implemented JSON-driven composition.

## Issues and gaps found

| Priority | Finding | Final treatment |
|---|---|---|
| P1 | Original guidance required rapid cuts, delayed payoff and fixed visual changes. Current copy improves this, but its loop and music sections still sound mandatory. | Make loops, beat snapping, text hooks, sound hits and CTAs optional. Cut around readable actions and actual story progress. |
| P1 | Unverified “top three signals” advice remains prominent under “What Instagram says.” | Put verified primary-source guidance first; retain secondary summaries only as dated background. No fixed signal weights or reach promises. |
| P1 | Backlog emphasizes effects without footage playback, trims, fonts or audio prerequisites. | Build plain footage playback first within Stage 1, then complete its agreed reaction/sting and creative options before declaring Stage 1 finished. |
| P1 | No rule connects chosen moments to source footage or an opening promise to its payoff. | Require a compact cut plan with source ranges, shot roles, uncertainties and a promised payoff. |
| P1 | Seconds-to-frames conversion can collapse a caption to zero output frames; short caption fades can fail at runtime. | Validate resolved cue ranges and use bounded fades with an explicit short-cue branch. |
| P1 | Shared scene fades fail for a one-frame scene accepted by the current duration model. | Handle short scenes without duplicate interpolation input points; test rendering, not only schema acceptance. |
| P1 | Unknown schema fields are silently removed. A supplied audio field can validate while being discarded. | Use strict validation for the new reel contract and actionable version/field errors. Preserve the v1 contract explicitly. |
| P1 | Current captions use fixed font size, bottom placement and no bounded wrapping or explicit project font. | Provide script-aware font loading, responsive wrapping, configurable placement and target-platform overlay margins. |
| P1 | No source-time/output-time contract or revision locking. | Define trim bounds, duration derivation and snapshot semantics before building variants. |
| P2 | Seven words/two lines and 64 px margins do not guarantee mobile readability or platform UI clearance. | Treat word counts as a draft aid; inspect layout at actual phone scale and maintain configurable overlay-safe guides. |
| P2 | Source shopping list accepts GIF, alpha video and LUTs without generic engine support. | Publish an explicit supported-input table. Defer unsupported processing rather than silently omitting it. |
| P2 | “Compare the last 10” and 24–48 h review do not control duration, audience, topic or metric definitions. | Use comparable format/duration groups, consistent observation ages and unknown values for unavailable metrics. Organic tests remain observational. |
| P2 | Clip-hub or licensed meme inserts are conflated with predictable recommendation eligibility. | Preserve the owner's cleared-asset statement; do not infer reach eligibility from insert duration or attribution. |
| P2 | Contact-sheet helper filters missing images but indexes labels from the unfiltered input list. | Correct image/label pairing before reusing it for evidence; missing inputs must produce visible diagnostics. |
| P2 | CLI splits flag values at every `=` and stores props/output names by project ID. | Parse on the first separator, validate frame/output arguments, use unique revision paths and report child-process errors. Start batch work sequentially. |

Runtime probes reproduced three issues without changing source files:

```text
Caption startSec=0.001, endSec=0.002 at 30 fps -> startFrame=0, endFrame=0
12-frame caption fade [0,8,4,12] -> inputRange must be strictly monotonically increasing
1-frame scene fade [0,0,1,1] -> inputRange must be strictly monotonically increasing
Unknown project audio field -> omitted from parsed project
```

The earlier creative research already qualifies platform guidance and documents access limits. No new claim about Instagram weights or policy changes is established by this local audit.

## Minimal data and architecture decisions

### One renderer, explicit versioning

Keep `ProjectAd`, the scene registry and existing v1 projects. Add a discriminated v2 reel contract with strict fields; dispatch by project version. Existing demo/showcase projects must still validate and render. Do not silently reinterpret v1 timings or modify scientific claim gates.

For v2, use sequential scenes and independently timed overlay/audio lists. No arbitrary track editor, nested timeline or transition graph is needed for the first reel.

- **Assets:** stable ID, source-relative path, hash, media type, duration/dimensions/rotation, prepared-file reference and rights provenance from `assets/LICENSES.md`: source, item ID/URL, title, license/basis and notes or pack reference. Preserve the owner's standing cleared-assets statement; a missing item row is a provenance note, not a reason to re-ask permission. Metadata does not contain secrets or another machine's mandatory absolute paths.
- **Video scenes:** asset ID, source-in/source-out seconds, focal point and fit mode, source-audio policy. Playback speed is 1 in the MVP. Resolver derives duration; callers cannot also specify a contradictory scene duration.
- **Graphic scenes:** explicit duration and typed props, reusing the registry where appropriate.
- **Overlays:** text/ingredient/step cues, source-backed tension text/timer and `reactionInsert` in output time, with placement and style preset. Reaction inserts select an image or trimmed MP4/MOV from `assets/memes/`, with optional sting ID, cue time, duration and gain. They compose over any scene; no separate standalone reaction-film engine is needed.
- **Text runs:** every mixed line supports ordered `{text, fontId}` runs chosen per project/run, with explicit Devanagari and Latin/Hinglish fonts and weights. Preserve grapheme/conjunct sequences; do not split vowel marks or rely on silent OS font fallback. Font assets must load before capture. A single loaded font that covers both scripts may be chosen explicitly.
- **Audio:** music bed, retained cooking sound, optional supplied cooking ASMR layers, edit SFX and reaction stings. Give each explicit source trims, output cue, gain, fades and mute policy. Use deterministic gain envelopes to lower music for a selected crunch/sizzle/sting; avoid doubling the same source sound. Narration is optional later. Review the mixed result for clipping and balance rather than assuming a universal loudness target.
- **Cut plan/design system:** short editable project-side files describing shot roles, source evidence, hook/payoff, fonts, pace preference and approved creative choices. Engine timing belongs in validated project data.
- **Revision:** immutable approved project snapshot plus a new output directory for each revision. A hook or caption change preserves approved body trims unless the requested change requires them to move.

Stage 1 uses a minimal manual snapshot and unique revision/output path. Stage 2 adds convenient locked-cut editing. New footage scenes default to direct cuts; do not reuse the graphic-scene fade wrapper in a way that blanks the opening frame or fades every footage cut to the background.

Source times are seconds against probed media timestamps; output times resolve once to integer frames with documented rounding. Ranges are start-inclusive/end-exclusive. Reject zero-frame resolved spans, invalid trims, missing references and unintended overlaps. Define text-lane overlap behavior instead of allowing `cues.find()` to silently hide simultaneous captions.

### Media preparation

Discover and record executable paths and versions. Copy only selected inputs into a git-ignored served folder, proposed `public/generated-media/<asset-hash>/`; do not move originals. Preserve original filenames and source/rights mapping in the manifest. Prepared artifacts are replaceable; project snapshots must retain enough information to recreate them.

Use [the existing Envato shopping list](../assets/ENVATO-SHOPPING-LIST.md) for the small font/music/ASMR/SFX kit and [the rights log](../assets/LICENSES.md) for provenance. Reuse supplied cleared files; this plan does not authorize new subscriptions or purchases. Asset guidance can list formats beyond current support, but the manifest must state whether each selected file is render-ready, needs conversion or is unsupported.

Probe phone orientation, timestamps, dimensions and audio. Normalize only inputs that demonstrably need it, keeping originals and source mappings. Validate rotation and variable-frame-rate cases against actual decoded frames. Load supplied fonts before capture. Do not rely on Windows absolute paths as browser media URLs.

Local preparation/rendering is distinct from assistant interpretation. Begin with selected timestamped images, brief clip playback and user shot notes. A contact sheet is insufficient to establish action timing, sound or motion quality. Record observed/inferred/unknown. If a model analyzes frames or transcripts remotely, describe that data flow; do not call the entire workflow offline.

### Supported inputs for the MVP

Support tested MP4/MOV video including reaction clips, JPG/PNG reaction images, WAV/MP3 audio including stings, and supplied TTF/OTF/WOFF2 fonts. File extensions alone do not prove decode support; probe and test the actual codec. GIFs, alpha overlays, LUT application, speed ramps, generated media and NLE project files stay out of the first milestone; offer a prepared supported representation with provenance when needed.

### Two-laptop handoff

GitHub carries tracked code and project metadata. `assets/*/*` and `out/` are git-ignored, and the proposed generated-media folder must also be ignored: **cloning/pulling does not copy footage, music, reaction files or fonts**. Transfer the selected original assets separately using the owner's chosen local copy method, retaining relative folder paths and their license/pack records. Do not upload personal media to another service as part of this plan.

On the main/personal laptop: restore the files, compare selected asset hashes with the manifest, install the project's pinned dependencies, discover local media binaries and regenerate prepared media locally. Report missing/hash-mismatched assets before rendering. `public/generated-media/` and renders are machine-local rebuildable outputs, not synchronization storage. Round-trip one project between laptops as an acceptance check.

At that handoff, remind the owner to install `@remotion/install-whisper-cpp` and choose a multilingual model **if speech transcription will be used**. The earlier small/medium preference is a starting choice; evaluate Hindi/Hinglish samples before accepting accuracy. Whisper and its model are local installs/downloads on that laptop; they are not supplied by a Git pull. Installation and transcription never block these music-and-text reels.

### Concrete safe-area defaults

For 1080×1920 organic Instagram reels, begin with an editable house preset:

```text
textSafeInsetsPx = {top: 192, right: 160, bottom: 420, left: 64}
textSafeRect = {x: 64, y: 192, width: 856, height: 1308}
```

Keep important text, reaction labels and CTAs inside that rectangle; maintain at least the repository's 64 px inset on every edge. Background footage may fill the canvas. Store the insets in project/style data; scale with canvas dimensions, validate that a positive safe rectangle remains, and allow overrides. These are concrete **house starting margins**, not verified universal Instagram UI dimensions. Test the actual app with captions and buttons visible; different devices, caption expansion and surfaces can obscure more. Use a distinct placement-specific preset and current preview if paid Reels ads are ever requested; [Meta's Reels ads guide](https://www.facebook.com/business/ads/facebook-instagram-reels-ads) provides a safe-zone checker but is not an organic UI guarantee.

### Remotion licence conclusion

Checked on 13 October 2026 against installed `node_modules/remotion/LICENSE.md` and [the upstream licence](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md): individuals qualify for free use. The owner explicitly confirms they alone operate this tool for a personal, non-commercial Instagram page. **This stated use qualifies for the Free License; no Company License is needed.** Login email is not an eligibility test. The [current FAQ](https://www.remotion.dev/docs/license/faq) likewise includes individuals and teams up to three people. Revisit only if ownership, operators, collaboration or use changes; no licence purchase or account signup is part of this plan.

Own footage remains the core; reaction memes are short emotional inserts. [Instagram's originality announcement](https://about.fb.com/ltam/news/2024/05/ayudando-a-los-creadores-a-encontrar-nuevas-audiencias/) distinguishes originals and substantive edits from identical reposts. The 0.5–2 second / 1–3 insert house preference serves this creative direction and is not a guaranteed eligibility exemption.

## Ordered implementation

| Stage | Scoped work and likely paths | Exit check |
|---|---|---|
| 0. Repair and verify the baseline | Align/pin Zod to the installed Remotion expectation using pnpm; verify Windows frame/output flag forwarding; reject unsupported flags; update stale workflow docs; fix short-span and overlap handling; correct contact-sheet labels; ignore only generated media; discover media executables | Existing projects validate/render; short cues/scenes work; impossible/ambiguous spans fail clearly; requested QA frames/output paths are honored; no package-version warning |
| 1. Build the agreed footage reel formats | v2 schema/resolver, `VideoClip`, selected-media preparation/rights manifest, mixed-script text runs, safe-area preset, layered music/ASMR/SFX, `reactionInsert` plus sting; hook-first, truthful tension, loop-match and send-line options | One 30–60 s own-footage recipe and one 3–10 s own-footage meme-style reel; correct crops/trims; mixed lines readable; reaction/sting works over footage; sound-on/off review; options demonstrated without forcing them into every reel |
| 2. Make revisions and creative choices reviewable | Cut-plan template, three flexible recipes, project design system, source contact sheets and immutable render snapshots | Three source-backed hook proposals; accepted opening/body/payoff trace to media; a text-only revision preserves approved trims |
| 3. Refine the first-reel controls | Polish ingredient/step presentation, reaction timing, manual beat markers, gain envelopes and loop behavior from actual pilot notes | The agreed Stage 1 capabilities become easier to revise; optional effects remain removable without changing the core story |
| 4. Optional automation after the pilot | Cache preparation by asset/settings/tool version; consider beat detection or Whisper for demonstrated needs; batch only if repetitive work justifies it | Changed inputs invalidate analysis; useful reuse is measured; no output collisions; speech-only features remain optional |
| 5. Add local upload controls | Local file picker, media list, preview, trims/crop, project save; use the same preparation/validation paths | Pick clips locally, save, reopen and reproduce the CLI render from the same project; loopback access only |

Stage 5 is part of the intended upload experience, but not a prerequisite for the first folder-based reel. No auth, database, cloud queue, paid generation service or public hosting is required. The eventual UI should expose useful creative controls, not implementation details.

Batch throughput and OTIO/NLE interchange are optional follow-ons after Stage 1 proves useful. They are not acceptance requirements for a single creator and must not delay the core edit or local upload experience. The earlier research plan's stage numbers are historical; use this table for execution order.

Do not install PySceneDetect, librosa, Whisper and another editor at once. Manual shot ranges and beat markers prove the workflow first. Add one analysis dependency when a demonstrated bottleneck and sample comparison justify it.

## Creative planning changes

The final operational playbook should remain short and contain:

1. Pick the viewer task: usable recipe, sensory transformation, useful technique or relatable moment.
2. Inspect available footage and recipe facts; name missing shots or unknown instructions.
3. Draft three different opening ideas, each paired with visual evidence and a payoff.
4. Select a structure: result-first recipe, texture/process montage, technique demonstration or own-footage mini-story.
5. Order source ranges by understandable action and meaningful progress. Reveal partial answers; reserve only the question that benefits from suspense.
6. Choose explicit fonts per Devanagari/Latin text run, reading exposure, music, cooking ASMR and SFX layers; confirm the muted version carries the instructions and joke.
7. Add optional reaction, loop or CTA only if it serves the selected story.
8. Review the actual cut, record timestamped notes and freeze accepted sections.

Retain the owner's short reaction-insert preference as a starting point, not a compliance or ranking threshold. Replace “make every ending match the opening” with an optional loop. Replace “text/cuts land on music” with optional alignment subordinate to action. Replace fixed word limits with wrap/readability checks. Rename the reel-log backlog purpose from “A/B testing” to “observational creative testing.”

No fake timer, made-up recipe quantity, “taste doubles” promise, unverified preparation time or forced health claim. Missing facts can stay unresolved in a draft; they must be removed or supplied before the final recipe copy is approved.

## Verification and acceptance

Use meaningful edge cases for the media contract, not tests that merely repeat component markup:

- Valid/invalid source trims, unknown fields, missing media, zero-frame cues, short fades and same-lane overlaps.
- Rotated portrait and landscape phone footage, mixed source/output fps, a variable-frame-rate example, and a clip without an audio stream.
- Hindi shaping and wrapping, Latin text, longest realistic ingredient line, and actual font readiness.
- Mixed Devanagari/Hinglish/English in one line with per-run fonts; safe margins and bottom/right UI guides; readable text with sound muted.
- Source audio on/off, trimmed music start/end, cooking ASMR, reaction stings, music attenuation, fade boundaries, peaks and the final muxed audio stream.
- Image and trimmed-video `reactionInsert` over different base scenes; moving/removing the insert and sting preserves approved footage trims.
- Both 30–60 s recipe and 3–10 s own-footage meme formats; hook-first, tension, loop and send-line controls demonstrate valid on/off states.
- Text-only revision preserving source ranges; hook replacement shifting the intended downstream timing; unique render paths.
- Contact-sheet labels matching source timestamps even with a missing input.

Inspect representative frames immediately before, at and after every scene boundary, plus text entrances and the reaction beat. Review full playback with sound and muted at phone scale; stills cannot prove editing rhythm or audio quality. Verify exported dimensions, fps, duration, video/audio streams and timestamps with ffprobe when available. Output duration should match the resolved timeline within one output frame; inspect source action boundaries against decoded frames.

The first real-media delivery includes `project.json`, prepared-asset manifest, cut plan, approved style choices, review MP4, representative stills/contact sheet and a technical report. Use existing output tooling where it fits. A synthetic fixture can verify mechanics, but does not satisfy real cooking creative review.

Local Stage 1 completion requires the two format pilots, rights notes preserved into the manifest, a mixed-script line, an audible aligned sting/ASMR moment, a muted comprehension check and identifiable saved project/revision outputs. Separately verify second-laptop media restore/regeneration for handoff readiness. If that laptop is unavailable, mark the handoff check pending without blocking the reviewed local pilots or claiming transfer verification.

Run `npm run validate` before each implementation handoff. Report separately: implemented features; structural/media checks; visual and playback review; unverified creative/distribution outcomes. Keep all Git changes local unless committing/pushing is explicitly authorized.

## Pilot inputs and learning

First pilot needs one own-footage set, recipe/shot notes, intended language, approximate duration and optional music/reference. None is present in `assets/footage/` at this audit. Implementation can proceed using a synthetic development fixture, but real-media acceptance remains pending those inputs. Fonts and music are supplied assets or separately selected local resources; do not invent them as existing inputs.

For quality learning, compare masked drafts from the same footage and approximately equal durations. Judge clarity, believable sequence, payoff, pace, typography and sound; do not automatically score virality. For publishing feedback, follow `REEL-PLAYBOOK.md` and explicitly record **skip rate, average watch time and sends per reach** when exposed, plus reel duration, metric definitions, audience mix and observation age. Compute sends per reach only from an actual send count and accounts reached; do not rename aggregate shares as sends. Unavailable values stay unknown. Use observations such as 24 h, 72 h and seven days. Compare 30–60 s recipes separately from 3–10 s moments; no account data was reviewed here.

## Plan self-review

| Risk or gap in the earlier proposals | Resolution in this plan | Remaining uncertainty |
|---|---|---|
| Incompatible fields silently ignored | Explicit strict v2 contract and v1 dispatch | Actual migration implementation and regression renders |
| Source/output duration disagreement | Speed 1 MVP; video duration derived from trims | Timestamp normalization on real phone samples |
| Typography and crop treated as styling details | Included in first end-to-end milestone | Supplied font files and representative source framing |
| Analysis tool detects cuts but not useful actions | Assistant clip review plus source-linked shot notes first | How reliably sample inspection finds brief actions |
| Tiny clips break existing fades | Reproduced runtime failure, explicit Stage 0 repair/checks | Render validation after the code fix |
| Earlier proposal deferred agreed reactions/stings | Plain playback first within Stage 1; reaction/sting and creative options included before Stage 1 closes | Which optional effects improve actual footage |
| Upload goal deferred indefinitely | Defined local file-picker milestone and round-trip acceptance | UI design follows the proven media contract |
| No revision or cache semantics | Immutable snapshots; hashes include relevant analysis settings | Performance on the owner's editing laptop |
| Structural checks presented as creative improvement | Separate media QA, playback review and masked comparison | No real reel or distribution results yet |
| Large infrastructure scope | Single local engine, sequential batch, optional tools | No blocker requiring a hosted service |
| Media missing after a Git pull | Explicit separate original-asset transfer, hash checks and local regeneration | Second laptop restore not yet tested |
| Licence eligibility unresolved | Owner confirms one-person personal non-commercial use; Free License conclusion checked | Recheck only if the use/entity changes |
| Mixed-script choice and audio layering implicit | Explicit text runs and music/ASMR/SFX/sting model in Stage 1 | Real font files and mix quality on supplied media |

The plan is ready for scoped implementation. The next concrete build is Stage 0 followed by the expanded Stage 1. Automatic transcription, automatic beat detection, batches and OTIO must not delay the two agreed editable reel formats.
