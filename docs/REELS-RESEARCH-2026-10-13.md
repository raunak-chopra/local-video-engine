# From uploaded footage to editable reels

Research date: 13 October 2026. Scope: public product workflows, GitHub building blocks, Reddit practitioner reports, and the current local Video Engine. This is a researched implementation proposal, not a completed footage editor or a quality benchmark.

Updated with owner decisions on 13 October 2026. Execute [the final update plan](REELS-FINAL-UPDATE-PLAN.md), which governs stage order and the exact contract. Its Stage 1 includes 30–60 s recipes and 3–10 s own-footage meme-style reels, mixed-script text runs, reaction inserts/stings and layered cooking audio. This research file retains evidence and a matching high-level scope.

## Recommendation

Extend this engine into a personal assistant-directed footage editor. Keep Remotion for composition and export. Add media ingest, source trims, footage inspection, cooking-specific edit recipes, music, and a revision record. Prove one real reel before building a drag-and-drop editor or adding more AI models.

The desired interaction is:

1. Add footage, music, references, and recipe notes to a local project.
2. Ask for a reel with a duration, language, and creative direction.
3. The assistant inspects timestamped frames, identifies candidate moments, and writes an editable cut plan.
4. Review a draft and give notes such as “show the finished dish first”, “hold the pouring shot longer”, or “move this text above the bowl”.
5. Apply those notes to the saved timeline and render another revision.

The initial channel direction comes from the live `docs/CURRENT-TASK.md`: faceless cooking, music and on-screen text, Hindi, English and Hinglish. Speech transcription is an optional branch.

## Evidence and limits

- Cardboard's public page was read through web browsing. Yonko's exact Editing OS page and selected FAQs were read in the in-app browser after web extraction failed.
- Product pages establish advertised workflows, not the software internals, model choices, creative quality, or throughput. No paid handbook was purchased and no private implementation was accessed.
- GitHub evidence is from upstream repository pages, documentation and selected source files. Candidates were not cloned, installed or benchmarked. Repository license labels describe those projects; bundled models and dependencies may have separate terms.
- Reddit search returned indexed post text and some comments. Direct opens of three selected threads failed. Findings below distinguish those excerpts from full-thread inspection. Promotional creator posts are weak evidence of quality.
- The local checkout was clean before this research. The project schema, registry, composition, timeline resolver, CLI, package manifest and asset folders were inspected. Older planning documents contain superseded statements; the live code takes precedence.

## What to learn from the two products

### Cardboard

[Cardboard](https://www.cardboard.ai/) advertises footage or prompt input, an editable first cut, chat and timeline revisions, captions, reframing, media generation, reference-led editing, and exports. Its browser offering and Apple Silicon desktop offering differ; its public local-processing language should not be generalized to our Windows setup.

Transferable ideas: make source clips individually replaceable, preserve editability, accept a reference, and revise a saved cut. Do not assume its private architecture, rendering-speed claims, or advertised automation can be reproduced from this page alone.

### Yonko Creator Editing OS

[Yonko Editing OS](https://yonkomedia.com/editing-os) describes a step-by-step handbook, eleven prompts, and a personal design system used with a local editing workflow and a separate Claude subscription. It advertises footage preparation, transcription/script alignment, jump cuts, reference-led editing, and draft revisions. Its montage FAQ explicitly calls for footage, music and shot-list notes, with cuts driven by music rather than speech. Its language FAQ asks users to check transcripts and font/layout support.

Useful principles: prepare media once, read the design system before editing, use timestamped notes, retain the edit between revisions, and treat taste as direction supplied by the creator. The public page does not identify enough implementation detail to establish its exact underlying stack. Its headline also mentions ChatGPT, while several practical sections require Claude; tool compatibility should be tested rather than assumed.

**Feasibility:** independently implement these public workflow ideas. The assistant handles interpretation and creative decisions; deterministic tools execute and verify the saved edit. Reference analysis should extract pacing, typography, shot roles and sound relationships rather than copy another creator's footage.

## What this repository can do today

| Capability | Live evidence | Gap for footage reels |
|---|---|---|
| Validated project data | Zod schema in `src/engine/project-schema.ts` | No asset manifest, video trims, music tracks, or crop coordinates |
| Timeline | Sequential scene resolution in `resolve-timeline.ts` | No source-time mapping or overlapping media tracks |
| Scenes | Eight registered text/graphic types | No generic video-clip scene or cooking overlay scene |
| Captions | Timed text cues and a shared caption component | No ingest transcription, automatic alignment, or multilingual font-loading contract |
| Rendering | `tools/video.ts`: validate, still, render; three canvas presets | No media-preparation command or export metadata report |
| Asset intake | Existing `assets/` categories and license log | Drop folders are not an upload UI, index, or searchable library |
| QA helpers | Existing contact-sheet tool and still commands | Need footage contact sheets, boundary checks and full playback review |

The generic `ProjectAd` schema has no audio field. Product-specific compositions and their audio do not establish generic reel support. Merely setting `brand.fontFamily` does not ensure a Devanagari font is installed or loaded.

Current media folders contain guidance, but no cooking footage was supplied during this research. A real-media reel cannot yet be evaluated.

## GitHub selection

Selection is based on fit and documented functionality, not stars or measured superiority.

| Source | Relevant capability / license signal | Decision |
|---|---|---|
| [Remotion](https://github.com/remotion-dev/remotion), [official agent skills](https://github.com/remotion-dev/remotion/blob/main/packages/skills/README.md) | React video composition and agent guidance; [special license](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) | Keep the existing engine and skills. Check APIs against installed 4.0.529 before implementing current-doc examples. |
| [FFprobe](https://ffmpeg.org/ffprobe.html), [FFmpeg](https://ffmpeg.org/ffmpeg.html) | Stream metadata, input processing, frame extraction, audio analysis and delivery checks | Core ingest tooling. Resolve an actual executable and report its version. Remotion's rendering binaries do not automatically prove an external ffprobe command exists. |
| [PySceneDetect](https://github.com/Breakthrough/PySceneDetect) | Cut/transition detection and representative frames; BSD-3-Clause | Optional candidate segmentation for long or already-edited inputs. A continuous take of cooking actions still needs temporal visual inspection. |
| [librosa](https://github.com/librosa/librosa), [beat-tracking source](https://github.com/librosa/librosa/blob/main/librosa/beat.py) | Music analysis and estimated beat locations; ISC | Add after clip playback. Save beat times as data, with manual correction; action completion takes priority over automatic beat snapping. |
| [whisper.cpp](https://github.com/ggml-org/whisper.cpp), [Remotion integration](https://www.remotion.dev/docs/install-whisper-cpp) | Local speech transcription | Optional for spoken clips. Test Hindi/Hinglish on real samples before selecting model size; speech recognition cannot describe silent cooking actions. |
| [Auto-Editor](https://github.com/WyattBlue/auto-editor) | Automatic editing using signals including loudness; Unlicense | Useful for speech cleanup, optional later. Silence removal is a poor default for this channel. |
| [FunClip](https://github.com/modelscope/FunClip) | Transcript/speaker-based selection, subtitles and LLM-assisted clipping; MIT | Study transcript-to-source mapping for speech workflows. Its ASR dependencies and language support need sample testing; not the cooking MVP backbone. |
| [OpenTimelineIO](https://github.com/AcademySoftwareFoundation/OpenTimelineIO) | Editorial timeline interchange with external media references; Apache-2.0 | Consider later for handoff. It is not a media container and cannot guarantee our animated overlays round-trip into an NLE. |
| [Mediabunny](https://github.com/Vanilagy/mediabunny) | TypeScript browser media reading/conversion; MPL-2.0 | Consider if a browser media picker/player becomes useful. Avoid adding a second rendering system now. |
| [OpenCut](https://github.com/OpenCut-app/OpenCut) | MIT editor; upstream states a rewrite is underway, with API/MCP/headless features planned | Study UI and timeline concepts. Do not base our delivery on announced features; upstream points to [Classic](https://github.com/OpenCut-app/opencut-classic) for current use. |
| [Local Studio](https://github.com/misaalkhan/local-ai-based-video-editor) | MIT local chat/timeline editor; README describes a Mac workflow and Claude requests | Relevant design reference for reversible edits and media preparation. Windows fit and privacy details need code review. A creator post is not an independent evaluation. |
| [floomhq/opencut](https://github.com/floomhq/opencut) | Separate MIT Remotion/Whisper project advertising declarative reels and music synchronization | Study examples, not a drop-in replacement. Distinct from OpenCut-app/OpenCut despite the shared name. |

Do not install a broad collection of community skills. The existing official Remotion skills cover API use. What is missing is a focused editing workflow, usable media operations, and recorded creator preferences.

## Reddit findings translated into requirements

These are anecdotal needs and failure hypotheses, not verified product comparisons.

| Indexed discussion | Evidence available | Implication |
|---|---|---|
| [Hairdresser / cooking auto-cut request](https://www.reddit.com/r/ContentCreators/comments/1n9a4r2/title_any_ai_tools_that_can_autocut_long_videos/) | Search excerpt describes many short action clips or a long take, then manual selection and assembly; direct page failed | Solve visual moment selection and ordering before polishing caption effects. |
| [Cooking editing workflow](https://www.reddit.com/r/VideoEditing/comments/1asubs9/) | Search excerpt reports time spent organizing and reviewing footage; direct page failed | Generate timestamped contact sheets and stable asset IDs; separate preparation from repeated editing. |
| [Cuts between phrases](https://www.reddit.com/r/VideoEditing/comments/12y5vmr/) | Indexed post and comments distinguish silence markers from deleting silence | Offer candidate cut markers, handles and manual overrides. A detected event should not automatically become a destructive trim. |
| [Silence removal and ripple deletion](https://www.reddit.com/r/VideoEditing/comments/1bc3p0h/) | Search excerpt raises gaps left after removal | Preserve source-to-output mapping and validate contiguous output. |
| [AI editing plugins](https://www.reddit.com/r/VideoEditing/comments/x0gfhi/) | Search excerpt mentions transcription and music beat markers | Treat transcripts and beats as separate analysis artifacts. |
| [Creator's local AI editor post](https://www.reddit.com/r/VideoEditingTips/comments/1x44pif/i_built_a_local_ai_video_editor_for_reels_that/) | Indexed self-promotion links Local Studio; direct page failed | Discoverable example, weak quality evidence. Evaluate the upstream repo and our own outputs. |

Avoid drawing a “Reddit consensus” from this sample. No evidence here demonstrates that any tool reliably produces strong cooking reels unattended.

## Proposed local workflow and data

```text
Local media + brief + references
              |
Probe files -> timestamped frames / optional transcript / optional beats
              |
Assistant selects moments and writes a cut plan with reasons
              |
Validate source ranges, crop, text, audio and recipe sequence
              |
Remotion preview -> review MP4 -> timestamped revisions -> final MP4
```

Use the current project format as the foundation, extending it with explicit assets and track/clip data. Do not write another competing project system. Migrate the schema version if the existing contract becomes incompatible.

- Asset records: stable ID, hash, relative managed path, duration, dimensions, rotation, source fps, audio presence, rights note and prepared-file references.
- Analysis records: source asset ID, source-time range, timestamped frames, observed action, uncertainty, optional transcript/beat events. Preserve the difference between observed and inferred.
- Clip records: asset ID, source in/out, playback speed, output start, crop/focal point, audio policy and story role. Derive output duration from source duration and speed, with one documented rounding policy.
- Text: content, language/script, loaded font, timing and placement. Recipe quantities, temperatures and instructions must come from supplied notes.
- Mixed lines require explicit per-run `fontId` choices for Devanagari and Latin/Hinglish with grapheme/conjunct-safe spans; do not rely on OS fallback.
- Reaction overlay: `reactionInsert` references an image or trimmed clip from `assets/memes/`, output cue/duration/placement and optional sting from the licensed local kit.
- Audio: music, retained cooking sound, optional cooking ASMR layers, edit SFX and reaction stings, each with trims/gain/fades. Lower music deterministically around selected sound moments; verify no clipping/doubled source sound. Text must carry instructions and the joke with sound off.
- Rights: carry source, item/pack ID, license/basis and notes from `assets/LICENSES.md` into the manifest. Use `assets/ENVATO-SHOPPING-LIST.md` for the small supplied kit; preserve the standing cleared-assets statement without re-asking permission.
- Revisions: project snapshot, requested changes, accepted timeline and render record. Lock approved trims so revising text does not reshuffle footage.

For frame math, distinguish source fps from output fps, and use start-inclusive/end-exclusive output ranges. Test variable-frame-rate phone footage and rotation metadata. Validate missing files, trims outside media, speed/duration mismatch, timeline gaps, silent audio when music is expected, and text font availability.

`assets/` currently sits outside Remotion's standard `public/` asset root. Add a deliberate preparation step that copies only selected inputs into a git-ignored managed render folder, or configure a verified local serving path. Do not pass arbitrary Windows filesystem paths as browser media URLs. See [Remotion video documentation](https://www.remotion.dev/docs/offthreadvideo); choose the supported component and trim props for the installed version.

The footage can stay local for preparation and rendering. Assistant analysis is not automatically offline: transmitting sampled frames, transcripts or media to an external model is a separate data flow. Document whichever analysis route is actually chosen. A fully local visual model is optional and should be justified by hardware and a measured benefit.

## Making the bot better at editing

For primary-source research on hooks, story tension, retention, distribution
and test design, see [the creative research guide](REEL-CREATIVE-RESEARCH-2026-10-13.md).
Use `REEL-PLAYBOOK.md` as the operational starting point for footage reels.

### A compact creative playbook

Create one cooking editing guide that routes between three recipes:

1. **Result-first recipe:** finished-dish reveal, short promise, essential actions, return to plated result.
2. **Texture / process montage:** sensory action, preparation progression, longer holds for pours/sizzles/reveals, restrained text.
3. **One useful technique:** visible problem, technique demonstration, observable result and a concise takeaway.

These are starting structures, not mandatory timings. Choose durations from the footage and the viewing task. Show enough of an action to understand it. Use tighter cuts for repetitive preparation, slower holds for the payoff, and avoid layering effects over every shot.

All three recipes expose the owner's hook-first, source-backed story-tension, loop-match ending and “send this to…” end-line options. Add an own-footage mini-story for the 3–10 s meme format. Reactions, loops, timers and CTA lines are supported controls, not forced treatments; demonstrate them during Stage 1.

Reference analysis should produce a short style card: shot cadence, opening strategy, text hierarchy, recurring crop, transition frequency, sound cues and what the creator likes. Use actual timestamped samples; a URL or a sparse contact sheet alone is insufficient to establish motion quality.

### Feedback that persists

Save approved choices to a project design-system file: typography, colors, text placement, pace preference, sound intensity, and examples with specific reasons. Record only preferences the user accepts. “Too fast at 00:08” should become a longer source hold, not a generic instruction to make all videos slower.

Generate variants by changing meaningful choices such as the opening shot, narrative emphasis or caption phrasing. Reuse analysis and approved body edits. Do not regenerate the entire project for every revision.

### Evaluate improvement

Use three real inputs: multiple short cooking clips, a continuous cooking take, and a spoken clip only if relevant. Compare equal-duration drafts from the same assets with masked labels. Judge hook clarity, action comprehension, sequence accuracy, pacing, text readability, crop quality, sound balance and repetitive styling. Record revision count, preparation time and render time separately.

Structural tests prove the files and timing are valid. They do not prove better taste, higher retention, or more sales. Use actual playback review for editorial quality; audience outcomes need later observed results.

The publishing log explicitly includes skip rate, average watch time and sends per reach when exposed, with exact platform definitions and observation age. Do not substitute aggregate shares for sends or unavailable metrics with zero. Group recipe and short-moment formats separately.

## Ordered build plan

| Stage | Implement | Completion evidence |
|---|---|---|
| 1. Agreed reel formats | Probe/import; video trims/crop; mixed-script font runs; rights manifest; music/ASMR/SFX; `reactionInsert` + sting; hook/tension/loop/send-line options | One 30–60 s recipe and one 3–10 s own-footage meme-style reel; readable mixed lines, correct sound and muted comprehension |
| 2. Assistant preparation | Timestamped contact sheets, candidate source ranges, optional scene detection and shot notes | Each selected range can be traced to and reviewed against its source; preparation reused on revision |
| 3. Creative workflow | Three editing recipes, reference style cards, project design system and saved revisions | A new instruction changes the intended part of the reel while preserving approved sections |
| 4. Music / optional speech | Beat candidates and overrides; optional Whisper and caption remapping | No drift at cuts; no chopped words; multilingual text reviewed; silence logic disabled for non-speech edits |
| 5. Optional throughput after pilot | Add batch CLI or caching only for a demonstrated bottleneck | Measured useful reuse/throughput; not a first-reel requirement |
| 6. Local upload UI; optional interchange | File picker, player, clip list and crop/trim controls; OTIO only if an NLE handoff is requested | UI uses the same contract; OTIO is not required for this creator |

For the first milestone, use folder intake and this chat. A local upload UI can follow once the edit contract works. Bind any future local server to loopback and avoid account/cloud infrastructure.

The final update plan includes separate media transfer between laptops: Git does not sync git-ignored footage/music/fonts/memes or prepared media. Restore selected originals, verify hashes and regenerate the managed render folder on the main laptop. Remind the owner there to install Whisper/model files if spoken-content transcription is wanted; it remains optional and never blocks music-only reels.

The owner confirms they alone operate this tool for a personal non-commercial Instagram page. The installed and [upstream Remotion licence](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) list individuals as eligible for free use, so no paid licence is needed for this stated scope. See the final plan for checked sources and change-of-use conditions.

Recommended implementation locations: extend `src/engine/project-schema.ts`, `resolve-timeline.ts`, `scene-registry.tsx` and `ProjectComposition.tsx`; add a footage scene and media/audio helpers; extend `tools/video.ts` with a preparation command; store each reel under `projects/<reel-id>/`. Retain existing demo and scientific compositions.

## Acceptance and next input

Supply one real project: raw footage, a music track if desired, recipe/shot notes, language, approximate duration and one or two references with what you like about them. Put footage in `assets/footage/`, music in `assets/music/`, and reference files in `assets/references/`; share the folder/project path in chat. Those folders exist today, but automatic ingest does not.

The pilot must deliver editable projects for both formats, source-linked cut plans, review MP4s, boundary stills and export checks. Use the final plan's organic 1080×1920 house text insets: top 192, right 160, bottom 420, left 64 px, configurable and subject to actual-app preview. These are not universal platform UI measurements. Review full playback with sound and muted, not only stills.

Run `npm run validate` before implementation handoff. Report implemented behavior, structural validation and visual/playback review separately. This research changes documentation only; no footage editor, dependency installation, new composition, benchmark or final video is claimed here.
