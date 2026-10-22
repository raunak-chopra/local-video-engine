# Reconciliation record — 13 October 2026

## Decision and source hierarchy

The owner confirmed `engine/phase-0-1-contract` contains the other PC's work.
This PC now tracks its remote at `f874842`. Preserve `codex/phase1-readiness`
(`ca232b2`) and local `main` (`d5a960b`) as recovery sources. These two engine
histories have no common Git ancestor; no automatic source merge was performed.

For implementation, use current code and README. For active scope and progress,
use the newest section of `docs/CURRENT-TASK.md` and the governing
`docs/REELS-FINAL-UPDATE-PLAN.md`. The Stage 0 report describes its earlier
milestone. Older research and archived results retain their date and engine context.

Two current documentation traps were found: VIDEO-SYSTEM.md still calls footage
planned despite slices 1–2 being implemented, and CURRENT-TASK.md retains earlier
open-issue sections below the current completion record. Read these as dated
history; do not use them to undo later work. They were not rewritten in this
knowledge-preservation pass.

## What carries forward

| Area | Reconciliation | Evidence / next action |
|---|---|---|
| Graphics scenes | Latest branch already contains stat, list, compare, chart and quote, plus hook, statement and endCard. | Current schema and scene registry; do not overwrite with the old video.tsx. |
| Project data | Latest engine uses strict versioned project.json, supplied scene IDs and back-to-back resolved scenes. Old briefs and overlap timing use another contract. | project-schema.ts and resolve-timeline.ts; any old brief conversion needs a deliberate importer and fixtures. |
| Footage | v2 media preparation, hashes, clip trims, source audio, focus/crop and Android conversion live on the current branch. | Current README, media tools and slice 1–2 handoff. Real phone footage acceptance is still open. |
| Creative direction | Shot/look planning, one idea per scene, reference critique, controlled opening variants and exact-frame repair remain useful. | Verbatim old prompts and research are archived; adapted current plan accompanies this record. |
| Static review and motion samples | Old calculated reading/contrast report and automated motion sampling are useful port candidates, not current CLI features. | Old scripts/review.mjs, preview.mjs, preview-frames.mjs and corresponding tests remain on the preserved branch. Port against the new resolved timeline, not old overlap math. |
| Reproducibility | Old clean-checkout, decoded-frame, concurrency and memory evidence is retained. | Archived phase1-readiness.md and phase1-evidence.json. Old Remotion 4.0.534 evidence does not certify current 4.0.529. |
| Render records | Current runner has unique run folders, project snapshots, incomplete files and ffprobe checks. | tools/video.ts. Broader old environment/browser/asset manifest and full decode checks are candidates for a focused port. |
| Brand film | Old brand-manager copy, planning and inspection findings are preserved. | Archived brand-manager-creative-video.md. The old branch retains briefs; ignored MP4 availability must be checked separately. No new deliverable rendered here. |
| Claude knowledge | Three old custom director/review/3D skills are preserved as historical files. Current CLAUDE.md imports AGENTS.md. | Do not activate archived skills with broken old commands; adapt them only when that workflow is requested. |
| 3D and tool selection | Deterministic adapters and measured handoff constraints remain useful. | Archived 3d-handoff.md and animation-tool-selection.md. Blender/AE execution is not established; the old claim that clips are unsupported is superseded by current v2. |
| Creator scope | Personal, faceless cooking reels; Hindi, English and Hinglish; original footage with short reaction inserts. | Current owner decisions in CURRENT-TASK.md. Optional Whisper is for speech; it is not a prerequisite for this silent channel. |
| Rights and deployment | Keep asset provenance and scientific claim gates. Current personal creator scope supersedes the old proposed SaaS roadmap. | Current AGENTS and handoff. Preserve old commercial/licence research as history; reassess only if intended use changes. No new licence determination made. |

## Current command map

Run from the repository root in PowerShell. Use npm.cmd for flags.

| Historical command | Current action |
|---|---|
| npm run check | npm.cmd run validate |
| render -- --brief briefs/name.json | npm.cmd run video -- render projects/name/project.json |
| preview --frames ... | Issue npm.cmd run video -- still projects/name/project.json --frame=N for chosen frames; each run records output separately. |
| review -- --brief ... | No equivalent CLI report yet. Use the current resolved timeline in planning; port the old report deliberately if needed. |
| preview --sample motion | No equivalent automatic sampler yet. Choose entrance/hold/exit/boundary frames explicitly. |
| provision / qa:repro / qa:render | Historical old-engine harnesses; not package scripts on this branch. |

## Recommended next sequence

1. Finish local dependency and structural verification. Preserve this knowledge
   package in Git so the other PC can receive it; local files alone are not synced.
2. Transfer selected real Android footage and needed licensed assets outside Git.
   Restore matching media locks and verify hashes; regenerate prepared outputs locally.
3. Validate a real clip for rotation, VFR/HDR where present, crop, trim and sound.
   Record playback and listening separately from probe checks.
4. Continue Stage 1 slice 3: font registry, mixed-script text and configurable
   safe areas. This is the active implementation priority in CURRENT-TASK.md.
5. During that slice, selectively port the old review/sampling tools so layout and
   reading holds can be reviewed on the new timeline. Keep feature status explicit.
6. Port stronger environment manifests/full-decode/reproducibility tests when
   establishing current-engine reproducibility. Do not import the old suite wholesale.

The historical archive is complete for tracked docs, prompts, three custom Claude
skills, and root workflow/package documents. It does not claim to capture unknown
chat history, unpushed edits on the other PC, ignored outputs, or original media.
