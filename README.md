# Personal Video Engine

A local Remotion workspace for producing code-driven videos with Antigravity,
Codex, and Claude Code. It is intentionally a creator tool, not a SaaS.

## Start

```powershell
npm install
npm run dev
```

Remotion Studio will show the `VideoEngineDemo` composition.

## Verify and render

```powershell
npm run validate
npm run still:demo
npm run render:demo
```

Rendered files are written to `out/` and ignored by Git.

## Working with agents

- `AGENTS.md` is the shared project contract for Codex and Antigravity.
- `CLAUDE.md` imports that same contract for Claude Code.
- `docs/CURRENT-TASK.md` records the active objective and handoff state.
- Change the typed video input in `src/video/project.ts`.
- Add reusable visuals under `src/components/` and compositions under `src/`.

Before switching agents, run `npm run validate` and record unfinished work in
`docs/CURRENT-TASK.md`. Use separate Git worktrees if two agents must edit at
the same time.
