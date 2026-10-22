# Local video engine

Create short, crisp motion graphics from a structured JSON brief. Remotion renders React and CSS at each frame and exports an MP4 locally. An AI coding assistant can draft or refine the brief and scene component; rendering itself is deterministic and needs no AI API key.

## Start

Pinned rendering uses Node.js 24.11.1 (see `.node-version`). Run:

```powershell
npm install
npm run provision
npm run studio
```

The Studio opens a live preview of the example. Edit `briefs/demo.json` to define your story, then render:

```powershell
npm run render -- --brief briefs/demo.json --output out/demo.mp4
```

Render and preview use the Chrome Headless Shell version pinned in
`config/render-environment.json`. `npm run provision` downloads it once; renders
fail if it is absent or mismatched rather than downloading at render time.
For development with another browser, pass `--browser "C:\\path\\to\\chrome.exe"`.
An explicit browser is recorded in render evidence and may differ from the reference.

The renderer accepts `portrait` (1080×1920) or `landscape` (1920×1080), always at 30 fps. Every scene has a `kind`, `headline`, optional `detail`, `duration` in seconds, and an optional `transition` into the next scene (`fade` default, `slide`, `wipe`, `none`). Kinds and their extra fields:

| Kind | Extra fields | Motion |
|---|---|---|
| `title`, `point` | — | word-by-word reveal |
| `stat` | `value`, e.g. `"1,250+"` | number counts up |
| `list` | `items`: 2–5 strings | bullets stagger in |
| `quote` | `detail` is the attribution | |
| `compare` | `left`, `right`: `{label, text}` | cards rise in turn |
| `chart` | `bars`: 2–6 `{label, value}`, optional `unit` | bars grow |
| `image` | `src`: image in `public/` | slow zoom |
| `outro` | `detail` becomes a call-to-action pill | |

The brand needs `name`, `background`, `foreground` and `accent` hex colors, and optionally `secondary`, `font` (`Inter`, `Space Grotesk`, `Poppins`, `Montserrat`, `Playfair Display`, loaded from Google Fonts at render time), `logo` (image in `public/`) and `motion` (`calm` or `punchy`). See `briefs/demo.json`, which uses most kinds.

To include narration or music, put an MP3, WAV, or M4A file in `public/` and add a relative `audio` path to the brief, such as `"audio": "voiceover.mp3"`. Audio begins at the first frame. Prepare and time the audio to the scene durations before rendering.

For a new video, duplicate the example brief and ask your coding assistant to turn your script and brand rules into scenes. Supply approved logos, fonts, assets, factual claims, and a call to action. Check every claim and preview the entire result before publishing. Advanced motion or 3D work can be added directly to `src/video.tsx` while retaining the same render command.

Run `npm run check` for TypeScript and brief validation tests. Optional `npm run qa:render` runs browser integration checks with long text in both formats, the demo's existing Inter font, and synthetic media under ignored `out/`. The QA font and its OFL notice are bundled under `tests/assets/`; these checks need browser access but do not fetch fonts. Output files under `out/` are ignored by Git.

## Versioned briefs and reproducibility

New briefs should use `"schemaVersion": 1` and a unique `id` on every scene
(1–64 letters, numbers, `_` or `-`, starting with a letter). Preserve IDs when
editing or moving scenes; give copied/new scenes new IDs. Existing briefs without
a version remain supported. Their generated positional IDs become stable only
when you persist them before editing:

```powershell
npm run migrate -- --brief briefs/demo.json --output briefs/demo-v1.json
npm run qa:repro
```

Migration writes a new file and refuses to overwrite an existing one. Unknown
versions and duplicate IDs fail validation. Review reports and preview metadata
include scene identity. Rendering saves `<output>.brief.json` and
`<output>.manifest.json` with normalized input, source/asset hashes, environment,
browser and encoder evidence, output hash and elapsed time. Status `rendered`
means encoding completed, not visual approval or a fully validated release.

`qa:repro` renders ten synthetic fixtures three times at concurrency 1, 2 and 4,
compares decoded still/video pixels, checks dimensions/fps/frame count and fully
decodes media streams. It uses draft scale 0.2; inspect full-resolution output
and playback before delivery. See [phase-1 evidence](docs/phase1-readiness.md)
for the baseline, reference-platform limits and remaining release gates.

## Preview and quality checks

Create a contact sheet of settled scenes, pre-exit frames, transition midpoints, and caption midpoints:

```powershell
npm run preview -- --brief briefs/quality-demo.json --output out/quality-preview
npm run render -- --brief briefs/quality-demo.json --output out/quality-demo.mp4
```

Open `out/quality-preview/index.html`. Preview defaults to 40% scale; use `--scale 1` for full-resolution stills. Rendering also accepts `--scale` (0–1, excluding 0) for drafts and `--concurrency` (integer 1–32, default 4). Both commands accept `--browser`. An explicit missing browser path is an error.

Scene groups fit within the header/footer safe area, with extra space reserved when captions are present. Fit is computed after fonts load and is independent of entrance transforms. Long copy can still become too small to read: shorten it and review the preview. Charts retain supplied fractional values. Validation now rejects scenes too short to finish their reveals and retain a minimum 0.5-second hold before the outgoing transition; this is not a full reading-time assessment.

The final duration subtracts each transition overlap (18 frames for calm, 10 for punchy). The demo's 27.5-second scene sum produces a **23.9-second** MP4. The 120-second limit applies to the final rendered duration.

## Audio controls and captions

Existing `"audio": "voiceover.mp3"` briefs work unchanged. Add optional controls in seconds:

```json
{
  "audio": "approved-narration.wav",
  "audioOptions": {
    "volume": 0.8,
    "start": 0.5,
    "trimStart": 1,
    "trimEnd": 20,
    "fadeIn": 0.2,
    "fadeOut": 0.5
  },
  "captions": [
    {"text": "Approved transcript text.", "start": 0.5, "end": 3}
  ]
}
```

These fields are added to a complete brief. `start` places audio on the final video timeline; `trimStart` and the exclusive `trimEnd` select source audio. `volume` is 0–1. Rendering probes the actual source length, rejects trims outside it, and fades relative to the placed clip. Audio is cut at the video end; listen for unfinished speech and adjust timing. Captions are manually supplied, ordered, nonoverlapping cues of at most 100 characters, timed against the final video. Automatic transcription/voice generation is not included. Captions can also be used without audio.

## Approved local fonts

For offline fonts, add files to `public/` and use this brand option instead of the Google font:

```json
"localFont": {
  "family": "Approved Brand Font",
  "faces": [
    {"src": "fonts/brand-regular.woff2", "weight": "400"},
    {"src": "fonts/brand-bold.woff2", "weight": "700"},
    {"src": "fonts/brand-extra-bold.woff2", "weight": "800"}
  ]
}
```

WOFF2, WOFF, TTF, and OTF are supported. Variable fonts may use a weight range such as `"100 900"`. Local fonts take precedence over `brand.font`; fonts are not downloaded or copied automatically. Supply the weights your design uses and confirm your asset approval. A brief with a Google font still needs network access for that font.

## Better video prompts

Read the [Reddit and primary-source research](docs/video-prompting-research.md), then use the [video request template](prompts/video-request.md) and [repair template](prompts/repair-video.md). The workflow is a grounded story and scene specification followed by rendered feedback. Ordinary requests should modify a brief rather than regenerate the engine.

## Claude and directed motion workflow

Claude Code can use the repository skills `/video-director`, `/video-review`, and
`/video-3d-plan`. `CLAUDE.md` imports the shared instructions. See the
[Claude workflow](docs/claude-video-workflow.md) and the
[new Reddit source research](docs/motion-workflow-research.md), including its unavailable source.
Use the [shot plan](prompts/shot-plan.md) to define composition and movement before code.

```powershell
npm run review -- --brief briefs/demo.json --output out/demo-review.json
npm run preview -- --brief briefs/demo.json --output out/demo-repair --frames 0,60,87,716
```

`review` checks brief validity and referenced asset existence, then produces a JSON
timeline with suggested review frames, reading-time flags, and opaque palette contrast
ratios. It needs no browser and does not inspect visuals or audio. `preview --frames`
selects exact final-timeline frames for repairs; omit it for the regular contact sheet.
The sheet's phone-width toggle displays images at 360 CSS pixels wide. Use full-size
frames and playback too. Blender/AE and animated external media remain planned handoffs,
described in [3D handoff](docs/3d-handoff.md), rather than installed integrations.

## Why this stack

For a broader review sheet, run `npm run preview -- --brief briefs/demo.json
--output out/demo-motion --sample motion`. It adds scene starts, entrances, reveal-ready
states and the final frame to settled/transition/caption samples. It sparsely samples
motion, not every-frame glitches. Use either `--sample` or exact `--frames` selection.
See [tool selection](docs/animation-tool-selection.md),
[reference critique](prompts/reference-critique.md) and
[opening variants](prompts/opening-variants.md) for the latest research applications.

Remotion gives frame-based timing, a local preview, and deterministic MP4 rendering. Browser `MediaRecorder` is useful for quick canvas capture, but MP4 support depends on the browser and recorder MIME type. A full cloud pipeline adds infrastructure before it helps this local bot. Remotion's license terms depend on team size and automation usage, so review them before deploying this as a commercial service.
