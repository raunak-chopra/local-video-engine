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

`validate` runs lint, TypeScript, every projects/**/project.json and the test
suite. `npm test` runs just the tests; the real-media test is skipped until
`npm.cmd run fixtures` has generated its inputs. The npm.ps1 launcher on
this machine drops flag arguments; use npm.cmd or `node node_modules/tsx/dist/cli.mjs tools/video.ts ...`.

Each render gets out/<project-id>/<unique-run>/props.json and record.json.
Outputs are named incomplete until rendering and (for MP4) export checks pass.
An explicit --out must be new; existing files are never intentionally replaced.
The record includes requested frame, settings, versions, elapsed time and status.
The runner requests H.264/yuv420p using PNG frames and probes the result.
Bundled ffprobe/ffmpeg need no system PATH install. Some sandbox configurations
block child processes; rerun the same local command with normal process access.

## Media for v2 reel projects

A `version: 2` project lists its media under `assets` (paths relative to
`assets/`, optional rights notes). Prepare it before rendering:

```powershell
npm.cmd run video -- prepare projects/my-reel/project.json
npm.cmd run video -- prepare projects/my-reel/project.json --check
```

`prepare` hashes each source, probes it with the bundled ffprobe, then copies it
(or converts variable-frame-rate/non-H.264 video to H.264 MP4) into the ignored
`public/generated-media/<hash>/`. It writes `media.lock.json` next to the project;
commit that file. Re-running is a no-op for unchanged media. A source whose
bytes differ from the lock is refused unless `--accept-changes` is given;
`--check` re-hashes and verifies without writing (use it after restoring media on
another laptop). Rotated phone clips are accepted with a note; ones that also
need re-encoding are rejected, since the bundled ffmpeg cannot rotate.

`npm.cmd run fixtures` generates synthetic counter clips, tones and a font into
`assets/_fixtures/` for `projects/_fixtures/media-smoke` and the real-media test.

## Current limits

Generic v1 projects support eight graphic scenes and one non-overlapping caption
lane. Unknown fields, zero-frame spans and overlapping captions fail validation.
Graphics bundle and wait for Inter Variable plus Noto Sans Devanagari (per-glyph
fallback, so Hindi no longer depends on an OS font). v2 projects can declare and
prepare media, but no scene plays it yet: footage clips, supplied fonts,
mixed-script runs, overlays and audio are the next Stage 1 slices. The seed field is
reserved; current graphic scenes have no random behavior. Three canvas sizes
are supported; dedicated landscape editorial layouts remain a later visual task.

The recipe and meme pilot targets are 30–60 s and 3–10 s. Read docs/REEL-PLAYBOOK.md
for creative guidance. No retained scientific composition or duplicate skills
were removed during Stage 0.

## Handoff

AGENTS.md is shared guidance; CLAUDE.md imports it. CURRENT-TASK.md is the active
handoff. See the Stage 0 completion report and Stage 1 sequence there.
Git does not carry assets/ media, out/, or public/generated-media/. Copy selected
original clips/fonts/music/memes separately, preserve rights notes and regenerate
prepared media on the main laptop. Whisper is optional for spoken clips.
