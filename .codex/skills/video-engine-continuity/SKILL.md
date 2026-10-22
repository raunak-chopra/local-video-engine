---
name: video-engine-continuity
description: Reconcile this video engine across PCs and branches, recover historical motion research, preserve production learnings, and resume work using the current project contract and verification evidence.
---

# Video engine continuity

Use this skill for cross-PC handoffs, branch reconciliation, lost workflow knowledge,
or continuing work informed by the older brief-based engine. Read
`AGENTS.md`, `docs/CURRENT-TASK.md`, and `README.md` from the repository root first.
Use [the reconciliation record](references/reconciliation.md) to distinguish
current implementation, retained lessons, historical evidence, and unported features.

## When not to use

For ordinary scene implementation, use the installed Remotion skills and the active
engine schema. For footage editing, read `docs/REEL-PLAYBOOK.md` and
`docs/REELS-FINAL-UPDATE-PLAN.md`. This skill preserves continuity; it does not
replace the governing reel plan or introduce a second renderer.

## Resume safely

1. Inspect `git status --short --branch` and `git branch -vv`. Preserve local edits.
2. Treat `engine/phase-0-1-contract` as the confirmed working branch as of
   2026-10-13. Fetch before comparing PCs. Use `git pull --ff-only` only on a
   clean branch with no divergent commits; investigate divergence instead of resetting.
3. Use `projects/<id>/project.json`, `src/engine/project-schema.ts`,
   `src/engine/resolve-timeline.ts`, and `tools/video.ts` for current work.
   Archived `briefs/`, `src/brief.ts`, and `scripts/` commands are historical.
4. Restore dependencies with `pnpm.cmd install --frozen-lockfile`. Do not reuse
   node_modules from the old branch or substitute its package-lock.json.
5. Run `npm.cmd run validate` and `npm.cmd run video -- doctor`.
   Record their actual results; previous-PC passes do not establish a local pass.
6. Copy selected original media separately, preserving `assets/` relative paths
   and rights records. For an existing v2 project and its media lock, use
   `npm.cmd run video -- prepare projects/<id>/project.json --check`.
   Do not accept changed hashes merely to get a render through.
7. Use [the adapted shot and review plan](references/shot-and-review-plan.md)
   for directed motion. Keep plans and review findings in Markdown beside the project.
8. Save a handoff with source commit, project, source ranges, observed defects,
   actual QA results, and remaining checks. Update the active handoff when carrying
   out subsequent implementation work.

## Preserve these lessons

- Derive animation from frames, props and configuration. Pause and seek optional
  animation adapters; do not export wall-clock animations.
- Prototype a representative scene; inspect actual images before expanding it.
- Separate entrance, readable hold and exit. Inspect boundaries and longest copy,
  including target phone size and each requested canvas.
- Treat contrast calculations and word-count heuristics as flags, not creative QA.
- Use source-backed claims and approved assets. Research anecdotes and opening
  variants do not establish audience results.
- Separate structural checks, visual review, playback and listening in the report.
- Compare decoded frames in a pinned environment for reproducibility; MP4 byte
  equality and old-engine test passes are insufficient evidence for this engine.
- Preserve failed render records. Current unique props/record output isolation
  is useful but is not proof of cancellation recovery or hosted readiness.

## Evidence and historical archive

[Archive manifest](archive-manifest.json) lists 23 verbatim files and SHA-256 hashes
from `ca232b26e2a421c479a1398db31e21fda0e08e48`. Historical custom Claude skill
files are nested under `archive/`; they are source material, not newly installed
Claude skills. Read only relevant historical files and translate any instructions
through the current command/schema map. The full old implementation remains on
`codex/phase1-readiness`; no code merge or old-brief migration is claimed.

## Provenance and maintenance

Reconciled 2026-10-13 against active commit `f874842` and old commit `ca232b2`.
Source evidence: current README, AGENTS, CURRENT-TASK, package.json,
project-schema, resolve-timeline, runner, media tests, and the archived documents.
Verification from this PC is recorded in [local checks](references/local-checks.md).
Factual, doctrine and usability review were performed sequentially; no sub-agents
were used. Recheck volatile facts when dependencies, branches or scope change:

```powershell
git status --short --branch
git branch -vv
git log -1 --oneline
npm.cmd run validate
npm.cmd run video -- doctor
```

For source recovery, inspect `git show codex/phase1-readiness:<path>` before porting
selected old code. Never merge unrelated histories just to import these notes.
