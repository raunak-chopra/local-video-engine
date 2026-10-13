# Current task: Stage 1 reel engine (slices 1-2 done)


## Active work (2026-10-13)

Branch `engine/phase-0-1-contract`. Stage 0 pushed (`ae526a2`); slice 1 pushed
(`a132929`). Slice 1 gap fixes and slice 2 (footage clips) are implemented and
verified locally; commit status is in Git. Governing plan:
`docs/REELS-FINAL-UPDATE-PLAN.md`; Stage 0 evidence: `docs/STAGE-0-COMPLETION.md`.
Do not read the previous explainer's status as the current reel milestone.

Owner decisions: free OFL fonts now (Noto Sans Devanagari + Inter; Envato fonts
later); synthetic fixtures until real footage arrives; **owner shoots on an
Android phone** (portrait = rotated landscape frames, VFR in low light, optional
HDR10+/HLG).

### Slice 1: media contract and prepare (done)

- v2 project (`version: 2`, strict) with `assets[]` (id, kind, path inside
  `assets/`, optional rights). v1 unchanged. Deferred formats fail with a reason.
- `video prepare <project.json> [--check] [--accept-changes]`: SHA-256, bundled
  ffprobe, classify copy/convert/reject, prepared file under
  `public/generated-media/<hash>/` (hard link when possible), tracked
  `media.lock.json` (format 2). Changed sources refused unless accepted;
  `--check` is read-only verification for a restored laptop.
- Noto Sans Devanagari bundled as per-glyph fallback behind Inter.

### Slice 1 gap check (Android focus) and fixes

- G1 fixed: rotated clips that also need conversion were wrongly rejected. The
  bundled ffmpeg's default autorotate does rotate frames (verified visually), so
  they now convert to upright clips. Rotated-only clips keep the rotation flag;
  the renderer honours it (verified).
- G2 fixed: HDR (PQ/HLG) is tone-mapped to SDR BT.709 (zscale+tonemap).
- G3 fixed: prepared copies are hard links on the same drive (no 4K duplication).
- G4 fixed in slice 2: `video studio <project.json> [--port=N] [--no-open]`.
- Found and recorded: video often starts a few ms after the file start
  (`videoStartSec` in lock and media props).
- Open: VFR detection compares avg vs base rate (mildly variable clips <1% are
  copied; playback seeks by timestamp); 4K decode speed unmeasured; JPEG EXIF
  orientation dims; per-asset accept-changes; stale prepared-file cleanup;
  rights not cross-checked with LICENSES.md.

### Slice 2: footage clip scene (done)

- `clip` scene (v2 only): asset, inSec, outSec, fit cover|contain,
  focus {x,y}, sourceAudio {mute, gainDb}, optional transitionIn fade. No
  durationSec; length = round(outSec*fps) - round(inSec*fps). Asset must be a
  video. Trims checked against the prepared duration (half-frame tolerance).
- Rendered with `@remotion/media@4.0.529` `<Video>`; crop/focus via a box sized
  to the display aspect (no reliance on object-position). Hard cuts by default.
- Time convention (verified): trims use the file's own timeline (what a video
  player shows), not time since the first video frame.
- Render check now also requires an AAC track when any clip has audible sound.

### Verified (slice 2)

- `npm run validate`: lint, tsc, 4 projects, 17/17 tests.
- `projects/_fixtures/clip-smoke` (7 scenes, 210 frames): MP4 passed export
  checks (1080x1920, 30 fps, 7.0 s, AAC). Boundary frames: trim 1.0 s shows
  source frame 30; rotated clip from 0.5 s shows 15 and is displayed per its
  rotation; Android rotated+VFR clip upright after conversion; 0.1 s offset clip
  shows frame 27 at 1.0 s (file timeline); contain letterboxes; focus x=0 keeps
  the left edge; fade starts transparent.
- Audio per segment: each clip's own tone (440/550 Hz, peak 0.13), muted and
  silent clips and the end card are true silence.
- Studio preview of the v2 project loads prepared media (frame 0 = source 30).

### Not yet verified / open

- No real Android footage yet: confirm rotation, VFR, HDR and audio on a real
  clip (and HEVC: the bundled ffmpeg cannot make an HEVC fixture).
- Graphic scenes still fade from the background (reel opening on a graphic
  card starts empty). Decide cut/fade option with the text-overlay slice.
- Full-speed playback review and phone-app preview not done.
- One `npm run fixtures` run failed in a Remotion render and passed on rerun;
  cause not captured.
- Second-laptop restore check pending.

### Next: Stage 1 slice 3 (fonts and on-screen text)

Font registry (bundled packages or supplied files via `@remotion/fonts`, render
fails if any font does not load), mixed-script text runs, configurable safe
insets (192/160/420/64 at 1080x1920), text overlays in output time with lanes
(hook, step badge, ingredient card, tension, send line). Exit: mixed Hindi and
English line with conjuncts correct, longest ingredient line wraps inside the
safe rect, muted comprehension check.

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
