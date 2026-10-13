# Current task

## Status

The 18-second CGI explainer `Omega3SmedsExplainer` (540 frames @ 30 fps) has been fully built, structurally validated, and rendered to 1080p MP4.

## Objective

Deliver the deterministic CGI-style explainer contrasting traditional omega-3 softgels with Self-Micro Emulsifying Delivery System (SMEDS) softgels inside a stylized aqueous chamber according to `GEMINI-SMEDS-OMEGA3-EXECUTION-PLAN.md`.

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
- Awaiting final studio VO (`smeds-omega3-vo.wav`), product SKU approval, and clinical citation text.

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
