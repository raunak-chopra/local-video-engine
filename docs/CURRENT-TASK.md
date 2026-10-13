# Current task: Stage 0 repairs and reel readiness


## Active work (2026-10-13)

Stage 0 is committed and pushed (`ae526a2`, branch `engine/phase-0-1-contract`).
Stage 1 slice 1 (media contract and preparation) is implemented and verified,
but not yet committed. Governing plan: `docs/REELS-FINAL-UPDATE-PLAN.md`;
Stage 0 evidence: `docs/STAGE-0-COMPLETION.md`.
Do not read the previous explainer's status as the current reel milestone.

Owner decisions this session: commit and push Stage 0; use free OFL fonts now
(Noto Sans Devanagari + Inter; Envato fonts plug in later); build on synthetic
fixtures until real footage is supplied; stop after fixes + slice 1 for review.

### Implemented (slice 1 + post-audit fixes)

- F2: bundled Noto Sans Devanagari Variable 5.3.0 (OFL) as per-glyph fallback
  behind Inter; render waits for its Devanagari subset. Hindi no longer uses the
  Windows system font (machine-dependent).
- F5: resolver reports every caption overlapping a long cue; scene errors use
  `scenes[i] (id)` paths.
- v2 project contract (`version: 2`, strict) with `assets[]`: id, kind, path
  inside `assets/`, optional rights. v1 unchanged; version picks the schema.
  Deferred formats (GIF, WebM/alpha, LUT, NLE files) fail with a reason.
- `video prepare <project.json> [--check] [--accept-changes]`: SHA-256, bundled
  ffprobe, classify (copy / convert / reject), prepared copy under
  `public/generated-media/<hash>/`, tracked `media.lock.json` next to the project.
  Converts VFR -> CFR at project fps, non-H.264 -> H.264, odd pixel formats,
  non-AAC/MP3 audio. Rotated clips are copied with a note; rotated clips that
  also need re-encoding are rejected (bundled ffmpeg has no transpose filter).
- still/render of v2 projects pass a prepared-media map in props; the
  composition refuses missing media. Render refuses missing lock, wrong project,
  unprepared assets and missing/altered prepared copies.
- `npm run fixtures`: Remotion-rendered counter clips (frame number + timestamp
  + top-left marker) and ffmpeg-derived variants in ignored `assets/_fixtures/`;
  fixture project `projects/_fixtures/media-smoke` (its lock is git-ignored).

### Verified

- `npm run validate`: lint, tsc, 3 projects, 12/12 tests (6 new media tests,
  including a real-media prepare test on the fixtures).
- Fixture prepare: 9 assets, VFR (avg 22.6 fps) converted to CFR 30; rotated
  clip recorded 90 degrees with display size 540x960; idempotent re-run left
  the lock byte-identical; `--check` verified; one-byte source change refused by
  both modes; deleted prepared copy blocked render then was rebuilt.
- v2 MP4 render: complete, 1080x1920 yuv420p 30 fps 2.0 s (53 s elapsed).
- Visual: v2 still with mixed English/Devanagari line renders in Noto; v1 demo
  frame 60 unchanged.

### Not yet verified / open

- No scene plays media yet, so decoded orientation of rotated clips, VFR
  playback and trims are untested in the renderer (slice 2).
- `prepare` probes via the Remotion CLI (~3 s per file); fine for a reel, slow
  for large batches.
- HEVC sources: conversion path exists but untested (bundled ffmpeg cannot
  encode a HEVC fixture). Test with a real iPhone clip.
- Second-laptop restore check pending.

### Next: Stage 1 slice 2 (footage scene)

`clip` scene `{asset, inSec, outSec, fit, focus, sourceAudio}` via
`@remotion/media@4.0.529` `<Video>`; duration derived from trims (reject
`durationSec`); trims validated against lock duration; hard cuts by default,
fade only when requested (fixes frame-0-empty for reels). Exit: frames
before/at/after cuts match ffmpeg-extracted source frames; rotated and VFR
fixtures display correctly; MP4 with AAC passes export checks.

## Historical explainer status

The 18-second CGI explainer `Omega3SmedsExplainer` (540 frames @ 30 fps) has been fully built, structurally validated, and rendered to 1080p MP4.

## Historical explainer objective

Deliver the deterministic CGI-style explainer contrasting traditional omega-3 softgels with Self-Micro Emulsifying Delivery System (SMEDS) softgels inside a stylized aqueous chamber according to `projects/smeds-omega3-cgi/GEMINI-EXECUTION-PLAN.md`.

## Deliverables Generated

- Review video: `out/omega3-smeds-review.mp4` (1080p, 18s @ 30fps)
- 5 Representative QA stills:
  - `out/omega3-smeds-review-frame-intro.png` (frame 20)
  - `out/omega3-smeds-review-frame-traditional.png` (frame 120)
  - `out/omega3-smeds-review-frame-transition.png` (frame 205)
  - `out/omega3-smeds-review-frame-microdroplets.png` (frame 385)
  - `out/omega3-smeds-review-frame-endcard.png` (frame 500)
- Timeline & Cues: `projects/smeds-omega3-cgi/cues.json`
- Verification report & review notes: `projects/smeds-omega3-cgi/review-notes.md`

## Claim Gate Status

- Marked with persistent `DRAFT - CLAIMS UNVERIFIED` watermark and `Illustrative visualization - not to scale`.
- `public/audio/smeds-omega3-vo.wav` exists, but final studio/review status is unconfirmed. Product SKU approval and clinical citation text remain unresolved; file existence does not approve the narration or claims.

## Engine build (branch `engine/phase-0-1-contract`)

Plan: `docs/RESEARCH-AND-FINALISATION-PLAN.md` (phases) and `ENGINE-PLAN.md` (architecture).

- Phase 0 baseline: `npm run validate` passes. Package manager is pnpm 11 (`npx pnpm@11.19.0 add ...`); `pnpm` is not installed globally.
- Phase 1 (project contract) implemented: `src/engine/project-schema.ts` (Zod), `resolve-timeline.ts`, `scene-registry.tsx`, `scenes/` (hook, statement, endCard), `ProjectComposition.tsx` registered as `ProjectAd`, sample `projects/demo-ad/project.json`.
- Phase 2 (minimal CLI): `npm run video -- validate|still|render <project.json> [--canvas=vertical|square|landscape] [--frame=N] [--out=file]`.
- Verified: lint + tsc, invalid-project errors with field paths, stills in all three canvases, 10 s vertical MP4 render.
- Visually reviewed: vertical and landscape frame 45 only. Not yet reviewed: square, scene boundaries, full playback, end card.
- Not done: ffprobe export check, golden-frame tests, captions from audio, remaining scenes, provider adapters.

## Session 2026-10-13 (reels direction)

- Goal: upload own footage plus licensed assets, get reels (Cardboard / Yonko-style local pipeline). Whisper runs locally, free (`@remotion/install-whisper-cpp`); not yet installed.
- `assets/` drop folder created (footage, broll, music, sfx, motion-graphics, overlays-and-luts, fonts, images-and-logos, voiceover, references). Media is git-ignored; `assets/LICENSES.md` logs sources. Owner states all supplied assets are cleared.
- GitHub `origin/main` is an older unrelated-history baseline. This work is pushed as branch `engine/phase-0-1-contract`; do not force-push `main`.
- Ported scenes from the old baseline: `stat`, `list`, `compare`, `chart`, `quote` (`src/engine/scenes/`), sample `projects/scene-showcase/project.json`.
- Verified: `npm run validate` passes; project validates. Visually reviewed vertical stills for stat, list, compare, chart, quote (frames 60/150/260/380/470). Not yet reviewed: transitions, square and landscape canvases.
- Channel: cooking, faceless, no speech. Music plus on-screen text in Hindi (Devanagari), English and Hinglish (Roman-script Hindi). Whisper is OPTIONAL: only for transcribing a spoken clip. Owner edits on the main/personal laptop; when this branch is synced there, prompt the owner to install Whisper (`@remotion/install-whisper-cpp`, `small`/`medium` model; Hindi/Hinglish needs medium or larger).
- Next (no Whisper needed): video-clip scene with trims, ingredient and step text scenes, multilingual font loading (Devanagari + Latin, e.g. Noto Sans Devanagari, Hind, Poppins), beat-synced cuts from music (local audio analysis), design-system file, then optional ingest/captions.
- Added: meme-template short format (3-10 s). `assets/memes/` folder. Planned `meme` scene: reaction clip or image template + top/bottom text (Devanagari/Hinglish/English) + audio sting + punchline timing; also an `expectationReality` split layout. Not built yet.
- Reel research playbook: `docs/REEL-PLAYBOOK.md` (draft, third-party sources). Drives the hook-first template, beat sync, tension overlays, loop-match ending, sends/saves components and reel log.
- Decision: reels are original content; meme images/reaction clips are short emotion inserts (0.5-2 s, 1-3 per reel), not standalone content. Planned `reactionInsert` overlay usable in any scene; the 3-10 s format is built on own footage plus an insert.

## Final plan reconciliation (2026-10-13)

- Execution plan: `docs/REELS-FINAL-UPDATE-PLAN.md`. Stage 0 fixes precede an expanded Stage 1 with 30–60 s recipes and 3–10 s own-footage meme-style reels, reaction overlay/stings, mixed-script font runs, layered music/ASMR/SFX and optional hook/tension/loop/send-line controls. Plan only; these features remain unbuilt.
- Owner confirms one-person operation for a personal, non-commercial Instagram page. Installed/upstream Remotion licence eligibility covers this stated individual use for free; no paid licence is needed.
- Git does not transfer git-ignored media/fonts or generated media. Main-laptop handoff needs separate selected-asset copying, hash verification and local preparation. Remind the owner to install Whisper/model files there if transcription is wanted; optional for this channel.
- Envato kit and `assets/LICENSES.md` provenance must flow into the prepared manifest. Organic vertical text-safe house insets: top 192, right 160, bottom 420, left 64 px, configurable and checked in the actual app.
- Batch throughput and OTIO remain optional after the first useful pilots. No video/editor implementation or two-laptop restore has been verified in this reconciliation.

## Readiness audit (2026-10-13)

- Inventory and next build: `docs/REELS-READINESS-AUDIT-2026-10-13.md`. No reel feature code has been implemented in this conversation; existing v1 graphics engine is the working foundation.
- Fresh checks: lint/type check and both demo project validations pass. Direct Remotion frame-45 still rendered outside the sandbox and was inspected; no full playback or cooking footage QA performed.
- Open Stage 0 issues: Zod 4.6.5 versus Remotion's expected 4.5.4; npm frame/output flags dropped in this environment; zero-frame/overlapping captions; short fade failures; contact-sheet label pairing; stale VIDEO-SYSTEM.md; generated-media ignore not yet added.
- Next is Stage 0 repairs, then the two Stage 1 reel pilots. Local pilot completion and second-laptop handoff verification are separate checks. Footage/fonts remain absent; synthetic mechanics can be built while real inputs are pending.


## Stage 0 completion (2026-10-13)

- Current evidence: docs/STAGE-0-COMPLETION.md supersedes the earlier open-issue audit. Six regressions and all project JSON fixtures pass; dependencies align; actual short-span and 10-second demo MP4s pass bundled ffprobe export checks.
- Local Inter loading and safer generic caption placement are implemented. Footage/audio/mixed-script/reaction capabilities remain Stage 1. No real-media or full-playback review has been completed.
- Use npm.cmd in PowerShell; render records and props are unique per run. No commits, pushes, media transfer, composition removal or skill cleanup performed.
