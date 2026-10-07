# Local video engine

Create short, crisp motion graphics from a structured JSON brief. Remotion renders React and CSS at each frame and exports an MP4 locally. An AI coding assistant can draft or refine the brief and scene component; rendering itself is deterministic and needs no AI API key.

## Start

Requires Node.js 20 or newer. Run:

```powershell
npm install
npm run studio
```

The Studio opens a live preview of the example. Edit `briefs/demo.json` to define your story, then render:

```powershell
npm run render -- --brief briefs/demo.json --output out/demo.mp4
```

On Windows, the renderer uses an installed Chrome or Edge browser when found. If yours is elsewhere, pass `--browser "C:\\path\\to\\chrome.exe"`. Otherwise, Remotion may download Chrome Headless Shell during the first render.

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

Run `npm run check` for TypeScript and brief validation tests. Output files under `out/` are ignored by Git.

## Why this stack

Remotion gives frame-based timing, a local preview, and deterministic MP4 rendering. Browser `MediaRecorder` is useful for quick canvas capture, but MP4 support depends on the browser and recorder MIME type. A full cloud pipeline adds infrastructure before it helps this local bot. Remotion's license terms depend on team size and automation usage, so review them before deploying this as a commercial service.
