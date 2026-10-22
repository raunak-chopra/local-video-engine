# Video system

## Current pipeline

1. Brief: cooking recipe, sensory montage, technique or own-footage mini-story.
2. Inspect supplied media/recipe notes and propose source-linked shots.
3. Author one validated project.json. Generic v1 graphics work today; v2 footage
   and audio are planned in REELS-FINAL-UPDATE-PLAN.md.
4. Resolve timings once to integer frames; reject collapsed/overlapping cues.
5. Preview via ProjectAd and render representative boundaries and a review MP4.
6. Review playback with sound and muted, then revise a saved project snapshot.
7. Verify the exported streams and record the result separately from creative QA.

Transcription/narration is an optional speech branch, not a music-only prerequisite.
Reels use original footage plus optional emotion inserts, Hindi/Hinglish/English,
and supplied music/ASMR/SFX. No generic v1 audio/media support is claimed.

## Source of truth

projects/<id>/project.json drives ProjectAd; src/engine owns schema/resolution/
registry. Existing demo/scientific compositions keep their own reviewed data.
Do not create a second engine or a separate composition for every generic reel.
Current contract: v1, strict fields, eight graphic scenes, one caption lane.
Seed is reserved until a frame-driven random effect actually uses it.

## Delivery and limits

Use npm.cmd in PowerShell for flags. Each render has a unique record and project
snapshot. A failed attempt stays failed/incomplete; publishing names appear only
after validation. MP4 checks cover dimensions, fps, duration and yuv420p. Local
Inter is bundled; multilingual font selection is still Stage 1.

REELS-FINAL-UPDATE-PLAN.md supersedes the older research phases. No hosted job
API, MCP render server, queues, accounts or cloud rendering are part of this
personal creator workspace. Local upload controls follow useful reel pilots;
batching and OTIO are optional. Preserve older compositions and historical docs.
