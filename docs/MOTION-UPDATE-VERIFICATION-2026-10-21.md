# Motion production update: verification record

Date: 21 October 2026. This records local checks, separate from source claims in
[the research report](MOTION-RESEARCH-2026-10-21.md). No commit or push was made.
Base commit: `f43faa4`, branch `engine/phase-0-1-contract`; changes are uncommitted.
Pre-existing untracked `.npm-cache/` was preserved. Dependencies remain pinned;
no package dependency was added or upgraded.

## Implemented

- Per-scene graphic motion settings and scene-local context. Immediate entry
  settles nested entrances and stat counting; cut exits retain wrapper opacity.
- Strict direction sidecar, global frame/absolute beat timing, cue/hold bounds,
  stable sample ordering, parsed-input hashes and exclusive plan-file writes.
- Adjacent direction validation within the repository validation command.
- Shared researched playbook, prompt templates, contract documentation,
  AGENTS/CLAUDE/GEMINI routing and two synthetic mechanics projects.

## Structural checks

The initial baseline passed lint, TypeScript, four projects and 16 tests; one
real-media preparation test was skipped because synthetic media inputs had not
been generated on this machine. Prior-PC results are not current local passes.

The final `npm.cmd run validate` passed ESLint, TypeScript and all six project
fixtures, including the adjacent direction sidecar. Test totals: 23 discovered,
22 passed, 1 skipped, 0 failed. The skipped test is the same real-media
preparation test requiring `npm.cmd run fixtures`; it was not reported as a pass.
`git diff --check` also passed.

`npm.cmd run video -- doctor` passed with normal process access: Remotion
4.0.529 packages aligned, Zod 4.5.4, bundled ffprobe/ffmpeg n7.1. The restricted
attempt returned a native ffprobe failure; the normal-access pass establishes
availability in that environment, not in every sandbox.

The square study exported H.264/yuv420p at 1080×1080, 30 fps, 8.0 seconds. The
runner's automatic metadata checks passed and its record is complete. Vertical
and landscape frame-zero PNG renders also completed.

The four-second graphic fixture exported with matching codec/pixel format,
1080×1080, 30 fps and 120 frames; automatic export checks passed.

Regression coverage includes absolute/fractional beat rounding, deterministic
frame sampling, ties, caption/cut samples, bad IDs, missing grids, unknown fields,
cross-scene holds, legacy opacity, short spans, planning without prepared media,
JSON stdout, missing explicit sidecars and refusing output overwrites.

## Visual review

Reviewed 31 planned encoded-frame samples of the main study, including scene
boundaries and holds, plus opening stills in vertical and landscape. See
[the project review notes](../projects/motion-study/review-notes.md) for exact
frames and observations.

Also inspected all 16 planned encoded-frame samples of the graphic fixture:
0/1/15/29 (stat), 30/31/45/59 (compare), 60/61/75/89 (chart), and
90/91/105/119 (quote). All four show complete settled content on entry and
retain it through the scene's last frame. The stat correctly displays `1,250+`
at frame zero; chart values show 20 and 40 immediately. No clipping was observed
in these square samples. These are synthetic data, not factual comparisons.

Fixture artifacts: `out/graphic-cut/1792578219731-c838937f/video.mp4`, matching
`record.json`, `out/graphic-cut/review-plan.json`, and
`out/graphic-cut/qa/contact-sheet.png`. Total reviewed: 47 encoded-frame samples
across both projects, plus two direct opening stills in other canvases.

## Machine/setup findings

- The first render could not download Chrome Headless Shell under restricted
  networking (`storage.googleapis.com` DNS failure). Rerunning with normal
  access downloaded Remotion's official browser and completed the render.
  The earlier failed render record was preserved under `out/motion-study/`.
- Bundled ffmpeg has a limited filter set and no `select` filter. The initial
  sample-extraction attempt failed. Successful extraction decoded all CFR frames
  to numbered PNGs, confirmed the count, then copied the planned indices. The
  image sequence starts at 1; engine frame indices start at 0. Keep that mapping
  explicit to avoid off-by-one QA labels.
- Output images and videos are local ignored artifacts. Regenerate from the
  tracked projects after moving machines; do not report these files as present
  after a Git-only restore.

## Not established

No full-speed playback, listening, phone-app UI review, real-Android media test,
music analysis, loop acceptance, audience improvement or cross-agent runtime
session was verified. The study is intentionally silent. Gallery research was
primarily prompt/metadata analysis, with one limited muted browser spot check;
access limits are explicit in the source report.

The next reel feature remains Stage 1 slice 3: fonts, explicit mixed-script text
runs, safe insets and overlays. This update does not mark that milestone done.
