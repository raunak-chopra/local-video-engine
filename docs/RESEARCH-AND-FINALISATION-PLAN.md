# Video Engine: research findings and finalisation plan (historical)

Superseded for reel implementation by REELS-FINAL-UPDATE-PLAN.md. Its older job API/MCP-server phases are not authorized scope; no hosted queue or server is planned. Retained as research history, not the live implementation checklist.

Date: 2026-10-08. Companion to `ENGINE-PLAN.md` (architecture); this file adds the GitHub/Reddit research, a gap analysis of the current repo, and an ordered plan to finish the engine.

## 0. Honest notes on the research

- **GitHub:** repo facts below come from the repos' own READMEs (fetched) or search summaries; star counts vary by source and are approximate.
- **Reddit:** I retried on 2026-10-08. Reddit returns 403 to scripted requests, the in-app browser refuses reddit.com, and the one archive API I tried rate-limits agents. I did not use third-party mirrors to get around that block. I could not read Reddit directly. The Reddit threads linked in `ENGINE-PLAN.md` section 4 were not re-verified by me. Treat Reddit-derived claims as unconfirmed. Use the "Reddit queries to run by hand" list in section 6.
- Nothing here was benchmarked on your machine.

## 1. Where the repo is today

| Area | State |
|---|---|
| Stack | Remotion 4.0.529, React 19, Tailwind 4, TS, pnpm |
| Compositions | `VideoEngineDemo`, `Omega3Smeds*`, `ScienceExplainer*`, `Smeds*` (several overlapping product-specific compositions) |
| Data model | Typed TS modules per video (`src/video/project.ts`, `smedsProject.ts`, `omega3-smeds/project.ts`), `cues.json`. **No runtime schema, no JSON-driven generic composition.** |
| Tooling | `tools/contact_sheet.py`, `tools/sfx_synth.py`, a one-off `generate-scratch-audio.js`. No CLI. |
| Audio/captions | Hand-made VO wav + SFX; `WordCaption.tsx` exists, no automated transcription step |
| Agent setup | `AGENTS.md`, `CLAUDE.md`, Remotion skills in `.agents/skills` |

So: you have a good *workspace*, not yet an *engine*. The step change is going from "one hand-built composition per video" to "one generic composition driven by validated JSON".

## 2. GitHub findings

### Direct competitors / references (most relevant first)

| Repo | What it is | Take-away for you |
|---|---|---|
| [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | Apache-2.0. HTML+CSS+GSAP to MP4 via headless Chrome seek + FFmpeg. Packages: core, engine, producer, studio, player, shader-transitions, aws-lambda. CLI: `init / preview / lint / check / snapshot / render / doctor`. Ships 21 agent skills. Node 22+. | Best model for **CLI shape, lint/check/snapshot loop, golden-frame regression tests, skill-per-workflow**. Also the licensing-clean alternative to Remotion. |
| [gyoridavid/short-video-maker](https://github.com/gyoridavid/short-video-maker) | MIT. Kokoro TTS, whisper.cpp captions, Pexels footage, Remotion, FFmpeg. REST + MCP. Scene = `{text, searchTerms[]}` plus `config` (voice, music mood, caption position, orientation). | Closest JS "faceless short" pipeline. Copy its **scene schema + job API**. Its gaps (English only, Pexels only, no user footage, Windows unsupported) are your differentiators. |
| [remotion-dev/template-tiktok](https://github.com/remotion-dev/template-tiktok) | Whisper.cpp word-level captions with animated styling. | Reference for the caption pipeline. Docs: use `toCaptions()` then `createTikTokStyleCaptions()` (older `convertToCaptions` deprecated); word-level needs `tokenLevelTimestamps: true`; combine words within ~200ms to stop flicker. |
| [reactvideoeditor/remotion-templates](https://github.com/reactvideoeditor/remotion-templates) | ~81 frame-driven Remotion templates (charts, text, etc.). | Mine for scene components instead of writing everything. Check each licence. |
| [remotion-dev/remotion](https://github.com/remotion-dev/remotion) + [docs resources list](https://www.remotion.dev/docs/resources) | Core + community libs (Remocn, RemotionUI, Remotion Bits, Onda ~70 components / 18 transitions). | Component/transition supply. |
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | MIT, Python. Topic to script to keywords to stock footage to TTS to subtitles to music to render. WebUI + API + CLI + batch. | Reference for the **pipeline stages and batch mode**. Reviewers note mismatched footage and generic narration, so keep a human review gate. |
| [mifi/editly](https://github.com/mifi/editly) | Declarative JSON-ish edit spec on FFmpeg. | Reference for a declarative spec; not needed as a second compositor. |
| [chuk-mcp-remotion](https://glama.ai/mcp/servers/@chrishayuk/chuk-mcp-remotion/blob/4ea447a10374df4d4a92b6a83c464eda47acf509/README.md) | MCP server wrapping Remotion. | Pattern for exposing the engine to agents. |
| [snippetwizard/scenecraft_mcp](https://github.com/snippetwizard/scenecraft_mcp) | Pydantic Shot/Scene/Storyboard models, pluggable LLM provider incl. offline mock. | Provider-adapter + mock pattern for the "not tied to one AI API" requirement. |

### Remotion vs HyperFrames

- Remotion: React, strong Studio and Player, mature; source-available licence that needs a paid company licence above small-team thresholds. **This is personal work, not for any company, so that requirement should not apply; re-read the licence if the project ever becomes commercial.**
- HyperFrames: HTML/GSAP, Apache-2.0, built for agents, has Lambda renderer. Newer; a Remotion-to-HyperFrames porting skill exists.
- Both capture frames in headless Chrome and encode with FFmpeg, so a **renderer-agnostic project JSON + scene registry** keeps the option open. Recommendation: stay on Remotion (your 20+ components and skills already target it), but design the JSON contract so scenes are pure data and a second backend is possible later.

## 3. Reddit / community-derived lessons (unverified, see section 0)

From `ENGINE-PLAN.md` plus community write-ups found in search:

1. Drive everything from the current frame; wall-clock CSS transitions flicker in export (also in Remotion docs).
2. Don't estimate caption timing from word count; one write-up found a 140-word script took 38s on one voice and 44s on another. Always transcribe the final audio.
3. Agents are unreliable at free-form edits; give them a **validated structured timeline** and deterministic helpers.
4. App-Store-style deliveries may need an extra codec/profile conversion; verify the exported file.
5. Hardware encoding on Windows is version-dependent; default to software, test GPU encode explicitly.
6. FFmpeg `amix` normalises by default, so VO gets quieter when music is added; set normalisation off and duck music explicitly.
7. Output can be valid but semantically bad (wrong stock footage, generic script): keep a review gate.

## 4. Prompts and use cases worth building around

**Use cases ranked by fit to your repo:** (1) product/explainer motion graphics (what you already do), (2) faceless short with VO + captions + footage, (3) caption-an-existing-clip, (4) data/chart videos from JSON/CSV, (5) batch variants (hook/CTA/aspect ratio swaps).

**Prompt 1: storyboard to project JSON** (provider-neutral; paste into any LLM, validate output with the schema):

```
You are a video director. Output ONLY JSON matching the provided JSON Schema (no prose).
Brief: {{brief}}. Format: {{9:16|1:1|16:9}}. Duration: {{seconds}}s. Brand: {{brand.json}}.
Allowed scene types: {{registry list with props}}.
Rules: one idea per scene; narration lines <= 18 words; every scene has `intent`,
`narration`, `onScreenText` (<= 8 words), `assets` (ids from the manifest only), `motion` preset.
Never invent claims, prices or statistics; put anything uncited in `needsApproval[]`.
```

**Prompt 2: scene-component authoring (for a coding agent)**

```
Add a scene `{{Name}}` to src/scenes and register it in scene-registry. Constraints:
frame-driven only (useCurrentFrame/interpolate/spring), no CSS transitions or Date.now,
seeded randomness, props validated by a Zod schema, safe margins from layouts.js,
must render correctly at 9:16, 1:1 and 16:9. Add a fixture project and run
`npm run video -- stills` for frames 0, mid, last-1 and review them.
```

**Prompt 3: review pass**

```
Given these stills and the resolved timeline, list: text overflow, safe-margin violations,
caption/VO desync, scene-boundary gaps or double frames, and unsupported claims. Return JSON.
```

## 5. Finalisation plan (ordered, with exit gates)

Builds on `ENGINE-PLAN.md` phases; this reorders them around what the repo already has.

| # | Work | Exit gate |
|---|---|---|
| 0 | **Baseline + housekeeping.** Run `pnpm install`, `validate`, one render. Move Omega3/Smeds/Science into `projects/` as examples; stop adding product-specific compositions to `src/`. | Clean install renders from a path with spaces (yours has one). |
| 1 | **Project contract.** `src/engine/project-schema.ts` (Zod): canvas, fps, brand, assets manifest, scenes[], audio[], captions[], seed, version. `resolve-timeline` to integer frames. Generic `<ProjectComposition>` reading `project.json` via `calculateMetadata`. | Invalid JSON fails with scene/field path; demo renders from JSON only. |
| 2 | **CLI** `tools/video.mjs`: `validate`, `stills`, `render`, `batch`, `doctor`, `lint` (copy HyperFrames' verbs). Argument arrays, `shell:false`. | One command from JSON to MP4 + contact sheet + render record. |
| 3 | **Scene registry + migration.** Extract reusable scenes from existing work (Hook, Hero, Benefit, Detail, EndCard, Explainer/Chart, WordCaption). Reuse `reactvideoeditor` templates where licences allow. | Same scene renders in 3 aspect ratios without code edits. |
| 4 | **Audio + captions pipeline.** `tools/transcribe.mjs` (whisper.cpp via `@remotion/install-whisper-cpp`, word tokens, 200ms combine) to `captions.json`; replace Python helpers (`sfx_synth.py`, `contact_sheet.py`) with Node or keep as optional. Explicit music gain/duck envelopes. | VO in, timed captions out, no hand timing. |
| 5 | **Provider adapters (optional, swappable).** Interfaces `planner`, `tts`, `image`, `stt`; implementations: `manual`, `mock`, local (Kokoro, whisper.cpp), and any cloud API. Output is always a local file + JSON. | Deleting every API key still renders saved projects. |
| 6 | **Job API + MCP.** Small Express/Fastify server: `POST /render` accepting project JSON, status, download; MCP wrapper mirroring short-video-maker. Sequential queue first. | An LLM agent can submit JSON and fetch an MP4. |
| 7 | **QA + regression.** Golden stills per scene/ratio (pixel tolerance), `ffprobe` export check (resolution, fps, codec, duration), failed renders marked incomplete. | `pnpm test` guards scenes. |
| 8 | **Templates for use cases** (faceless short, product ad, chart explainer, caption-a-clip) as `projects/_templates/*`. | Each produced end-to-end from a brief. |

Suggested first slice (about one focused session): phase 1 + a minimal phase 2 `render`, using your existing `VideoEngineDemo` content converted to `project.json`.

## 6. Reddit queries to run by hand (to confirm section 3)

- r/remotion: "captions flicker", "render slow concurrency", "Lambda vs local"
- r/ClaudeCode and r/ClaudeAI: "remotion skill", "hyperframes"
- r/SideProject and r/n8n: "faceless video pipeline", "short video automation"
- r/videography and r/ffmpeg: "amix volume drops", "h264 yuv420p profile for upload"

If you paste any threads here, I'll fold them into this plan.
