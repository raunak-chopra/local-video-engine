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

`prepare` hashes each source, probes it with the bundled ffprobe, then
hard-links or copies it into the ignored `public/generated-media/<hash>/`, or
converts it to H.264/AAC MP4 when needed: variable frame rate (common on Android
in low light) becomes constant at the project fps, HEVC/10-bit becomes 8-bit
H.264, HDR (PQ/HLG) is tone-mapped to SDR, and a rotated clip that needs
converting is rotated upright. Rotated clips that need nothing else keep their
rotation flag, which the renderer honours. It writes `media.lock.json` next to the project;
commit that file. Re-running is a no-op for unchanged media. A source whose
bytes differ from the lock is refused unless `--accept-changes` is given;
`--check` re-hashes and verifies without writing (use it after restoring media on
another laptop).

### Footage clips

```json
{"id": "pour", "type": "clip", "asset": "pour-01", "inSec": 3.2, "outSec": 5.0,
 "fit": "cover", "focus": {"x": 0.5, "y": 0.4},
 "sourceAudio": {"mute": false, "gainDb": -3}}
```

`inSec`/`outSec` are the times your video player shows for that file (the file's
own timeline, which can differ by a few milliseconds from "time since the first
frame" on phone clips). A clip's length comes from its trim; it takes no
`durationSec`. Clips cut hard by default; add `"transitionIn": {"type": "fade",
"frames": 8}` for a fade. `cover` fills the 9:16 frame and crops (`focus`
chooses which part stays, 0–1); `contain` shows the whole frame with bars.
Trims past the end of the prepared source fail before rendering. Renders with
audible clip sound must contain an AAC track.

Preview a reel with its prepared media in Remotion Studio (ProjectAd):

```powershell
npm.cmd run video -- studio projects/my-reel/project.json
```

`npm.cmd run fixtures` generates synthetic counter clips (frame number and
timestamp on screen), Android-like rotated/VFR and HDR clips, tones and a font
into `assets/_fixtures/` for `projects/_fixtures/*` and the real-media test.

## Current limits

Generic v1 projects support eight graphic scenes and one non-overlapping caption
lane. Unknown fields, zero-frame spans and overlapping captions fail validation.
Graphics bundle and wait for Inter Variable plus Noto Sans Devanagari (per-glyph
fallback, so Hindi no longer depends on an OS font). v2 projects play trimmed
footage clips with their source sound. Graphic scenes preserve their legacy
fades by default; optional `"motion": {"enter": "cut", "exit": "cut"}` reveals
all scene content immediately and holds it through the final frame.
Supplied fonts, mixed-script runs, text overlays, music/SFX layers and reaction
inserts are the next Stage 1 slices. The seed field is
reserved; current graphic scenes have no random behavior. Three canvas sizes
are supported; dedicated landscape editorial layouts remain a later visual task.

The recipe and meme pilot targets are 30–60 s and 3–10 s. Read docs/REEL-PLAYBOOK.md
for creative guidance. No retained scientific composition or duplicate skills
were removed during Stage 0.

## Handoff

AGENTS.md is shared guidance; CLAUDE.md imports it and GEMINI.md routes
Antigravity/Gemini to it. CURRENT-TASK.md is the active
handoff. See the Stage 0 completion report and Stage 1 sequence there.
Git does not carry assets/ media, out/, or public/generated-media/. Copy selected
original clips/fonts/music/memes separately, preserve rights notes and regenerate
prepared media on the main laptop. Whisper is optional for spoken clips.

## Motion direction and source research

Start with [the shared production playbook](docs/MOTION-DIRECTION-PLAYBOOK.md).
The [research report](docs/MOTION-RESEARCH-2026-10-21.md) assesses Prompt Motion,
the supplied Reddit discussion and related briefs with access/evidence limits.
[Prompt templates](docs/MOTION-PROMPT-TEMPLATES.md) work across agents.

Optional adjacent `direction.json` records scene intentions and frame/beat cues.
Generate deterministic review samples before rendering:

```powershell
npm.cmd run video -- plan projects/motion-study/project.json
npm.cmd run video -- still projects/motion-study/project.json --frame=0
npm.cmd run video -- render projects/motion-study/project.json
```

The [direction contract](docs/DIRECTION-CONTRACT.md) covers rounding, provenance,
holds, validation and output hashes. Planning does not require media preparation
and does not alter the edit or analyze audio. `npm.cmd run validate` also checks
adjacent direction files. The silent eight-second motion study exercises the
new graphic edge controls; it is not a completed cooking pilot.

For later channel experiments, [the Namak Kum Tha prompt lab](projects/namak-kum-tha-lab/README.md)
contains 20 original briefs and an empty result template. The owner deferred
testing. [The Prompt Motion catalog](docs/references/prompt-motion/README.md)
stores source-link metadata rather than a verbatim copy of the prompt collection.
