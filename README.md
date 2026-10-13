# Personal Video Engine

Local Remotion workspace for one creator. Generic JSON-driven graphics work;
footage reels are the next milestone, governed by docs/REELS-FINAL-UPDATE-PLAN.md.

## Install and preview

Use the pinned pnpm lockfile (pnpm 11). `pnpm install --frozen-lockfile`.
In Windows PowerShell, use explicit `.cmd` launchers to preserve arguments:

```powershell
pnpm.cmd install --frozen-lockfile
npm.cmd run dev
```

Studio includes ProjectAd, VideoEngineDemo and preserved scientific compositions.
For generic graphics, edit projects/demo-ad/project.json or create another
project.json under projects/. Do not fork a composition for each generic video.

## Validate and render

```powershell
npm.cmd run validate
npm.cmd run video -- doctor
npm.cmd run video -- validate projects/demo-ad/project.json
npm.cmd run video -- still projects/demo-ad/project.json --frame=60 --canvas=square
npm.cmd run video -- render projects/demo-ad/project.json
npm.cmd run video -- probe out/path/to/video.mp4
```

`validate` runs lint, TypeScript, every projects/**/project.json and the Stage 0
regression suite. `npm test` runs just the regressions. The npm.ps1 launcher on
this machine drops flag arguments; use npm.cmd or `node node_modules/tsx/dist/cli.mjs tools/video.ts ...`.

Each render gets out/<project-id>/<unique-run>/props.json and record.json.
Outputs are named incomplete until rendering and (for MP4) export checks pass.
An explicit --out must be new; existing files are never intentionally replaced.
The record includes requested frame, settings, versions, elapsed time and status.
The runner requests H.264/yuv420p using PNG frames and probes the result.
Bundled ffprobe/ffmpeg need no system PATH install. Some sandbox configurations
block child processes; rerun the same local command with normal process access.

## Current limits

Generic v1 projects support eight graphic scenes and one non-overlapping caption
lane. Unknown fields, zero-frame spans and overlapping captions fail validation.
Generic graphics bundle and wait for local Inter Variable; other supplied fonts,
mixed-script runs, footage, images and audio are Stage 1 work. The seed field is
reserved; current graphic scenes have no random behavior. Three canvas sizes
are supported; dedicated landscape editorial layouts remain a later visual task.

The recipe and meme pilot targets are 30–60 s and 3–10 s. Read docs/REEL-PLAYBOOK.md
for creative guidance. No retained scientific composition or duplicate skills
were removed during Stage 0.

## Handoff

AGENTS.md is shared guidance; CLAUDE.md imports it. CURRENT-TASK.md is the active
handoff. See the Stage 0 completion report and Stage 1 sequence there.
Plans/code are currently local changes until explicitly committed and pushed.
Git does not carry assets/ media, out/, or public/generated-media/. Copy selected
original clips/fonts/music/memes separately, preserve rights notes and regenerate
prepared media on the main laptop. Whisper is optional for spoken clips.
