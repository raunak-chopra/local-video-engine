# JavaScript product-ad video engine: research and build plan

Research date: 5 October 2026. Status: proposed architecture and implementation backlog; the engine has not been built or benchmarked in this workspace.

## 1. Recommended direction

Build a local Node.js + React + Remotion production system for product ads and motion graphics. Keep the video project, assets, scene components, and render pipeline independent of AI providers. A person or any coding assistant can author a project; an optional provider can contribute a storyboard, image, or voice track. Once those inputs are saved locally, rendering needs no AI key.

Use JavaScript ESM for orchestration and JSX for visuals. Runtime schema validation is mandatory. TypeScript is an optional authoring aid, particularly when reusing the existing TSX components; it does not introduce an AI dependency. FFmpeg and Chromium are native rendering dependencies, so this is a JavaScript-controlled system, rather than a pure-JavaScript codec implementation.

Start with 15–30 second ads at 30 fps. Support 1080×1920, 1080×1080, and 1920×1080. Use a lower-resolution review export and a 1080p final export. Add 4K and advanced 3D only after representative renders work reliably.

The first product should be an engine with useful scenes and a reliable preview/export workflow. A full timeline editor is a separate later project.

## 2. What exists locally

The current `C:\Users\raunak.chopra\Desktop\Video System` folder was empty at inspection.

An earlier project exists at `C:\Users\raunak.chopra\Desktop\Al Bots\Video Engine`. Its README, package manifest, scene files, types, and handoff document were inspected read-only. It contains:

- React/Remotion, with Remotion packages pinned to 4.0.529 in the manifest.
- Preview, validation, still, and composition-specific render scripts.
- Typed project data, caption components, backgrounds, and deterministic motion utilities.
- Demo and scientific explainer compositions, including draft claim labels.

This is a useful source of components and workflow conventions. It is not yet evidence of a general product-ad engine. Its current renders, installation health, visual quality, and performance were not verified during this planning task.

Implementation should selectively reuse reviewed components, preserving the earlier workspace. Do not copy its `node_modules`, generated outputs, or product-specific claims into a new generic engine. Keep one package manager and lockfile. Start with the compatible existing package set, then upgrade in a separate verified step if needed.

The local-first scope follows the earlier personal-tool preference, confirmed by the older project's current README. The user selected **product ads and motion graphics** as the first-version priority in this conversation.

## 3. GitHub findings and selection

Project capabilities below come from first-party repositories or documentation. The selection judgments are recommendations for this use case, not measured performance rankings.

| Project | Verified capability | Decision for this engine |
|---|---|---|
| [Remotion](https://github.com/remotion-dev/remotion) | React-based programmatic video creation; local Node rendering is documented separately. | Primary scene and rendering framework. Fits reusable branded compositions and existing local work. |
| [Motion Canvas](https://github.com/motion-canvas/motion-canvas) | TypeScript generator-based animation and preview editor, specializing in informative vector animation synchronized to voiceovers. | Alternative if the scope shifts mainly to vector explainers. Avoid maintaining two scene systems in v1. |
| [Editly](https://github.com/mifi/editly) | Node/FFmpeg declarative assembly of clips, images, audio, and titles, with a CLI and JS API. | Useful reference for declarative edits; do not adopt as a second mandatory compositor. |
| [Diffusion Studio Core](https://github.com/diffusionstudio/core) | TypeScript browser compositor using Canvas/WebCodecs, with playback and final rendering. Its README documents watermark/license-key conditions. | Revisit for a browser timeline product. It adds a different scene model and browser requirements. |
| [Mediabunny](https://github.com/Vanilagy/mediabunny) | TypeScript media toolkit for reading, writing, and converting audio/video, built around WebCodecs. | Consider for later browser media tools; it does not replace a branded scene library. |
| [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) | Maintainer marks it deprecated, unmaintained, and incompatible with recent FFmpeg versions. | Avoid. Use small Node wrappers around executable argument arrays where external FFmpeg is needed. |

Remotion provides a [Node renderer](https://www.remotion.dev/docs/renderer) and [renderMedia API](https://www.remotion.dev/docs/renderer/render-media). Let it handle composition rendering and its normal encoding path. Use external [FFmpeg](https://ffmpeg.org/ffmpeg.html) for input normalization or a necessary delivery conversion, and [ffprobe](https://ffmpeg.org/ffprobe.html) to inspect input/output streams. Avoid an automatic second lossy encode on every export.

License checkpoint: Remotion uses a special license, rather than MIT. Read the [current license](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) for the actual operating entity before regular commercial production. Do not assume personal-tool architecture determines a company's eligibility. Record package versions and license references in the implemented project.

## 4. Reddit findings translated into engineering decisions

Reddit supplies practitioner reports and useful failure hypotheses. These posts are anecdotal, sometimes promotional, and do not establish universal speed, quality, or cost claims.

| Discussion | Reported experience | What to do here |
|---|---|---|
| [Browser rendering versus Remotion + FFmpeg](https://www.reddit.com/r/SaaS/comments/1s6gjh8/title_why_i_swapped_clientside_rendering_for/) | Users describe browser resource pressure and prefer a controlled rendering environment. | Start with local Node rendering. Benchmark resource use instead of promising browser-only exports or fixed render times. |
| [Agent-assisted media editing](https://www.reddit.com/r/AI_Agents/comments/1qdojmh/ai_agents_for_imagevideo_editing_looking_for/) | Contributors describe fragile agent-to-render handoffs and stress deterministic operations. | Validate a structured timeline before rendering; keep exact timing in engine code. |
| [Programmatic App Store previews](https://www.reddit.com/r/indiehackers/comments/1r43r7g/my_workflow_for_generating_app_store_preview/) | A commenter reports needing an additional codec/profile conversion for delivery. | Verify the exported file itself against the chosen delivery preset. |
| [Code-driven launch videos and After Effects](https://www.reddit.com/r/ClaudeCode/comments/1r1esyn/just_built_a_full_saas_launch_demo_with_remotion/) | Discussion distinguishes repeatable product-demo workflows from compositing and design work that still needs visual judgment. | Build reusable ads, but keep storyboard, still, and full-video review in the workflow. |

One reported flicker cause is independently supported by [Remotion's animation documentation](https://www.remotion.dev/docs/animating-properties): visuals should be driven by the current frame; wall-clock CSS transitions can flicker in exports.

A [Windows hardware-encoding issue report](https://github.com/remotion-dev/remotion/issues/10698) describes configuration-dependent software fallback. Treat it as a version-specific report: begin with a reliable software export and verify hardware encoding on the installed version before advertising acceleration. Faster encoding does not necessarily accelerate scene rendering.

## 5. Architecture

```text
Human brief / optional coding assistant / optional provider
                         |
             Editable project + local assets
                         |
        Validate schema, assets, timing, and layout inputs
                         |
                Resolve and freeze timeline
                         |
           Shared React scene composition
                  /                 \
          Studio preview        Local Node render
                                     |
                            Export verification
                                     |
                     MP4 + thumbnail + render record
```

Use a single validated project and shared scene code for preview and export. A project references scene types from an explicit registry. Scene code owns layout and frame math; project data owns copy, assets, duration, and allowed visual parameters.

### Core modules

1. **Project schema:** versioned JSON, project ID, canvas preset, fps, seed, brand reference, asset manifest, scenes, audio, and captions. Use Zod or an equivalent runtime validator.
2. **Timeline resolver:** converts author-friendly durations into integer frame ranges once. Reject invalid ranges, unsupported scenes, references to missing assets, and unintended gaps. Define ranges as start-inclusive/end-exclusive. Keep fps fixed at 30 for v1.
3. **Asset preparation:** local image/video/audio/font import; duration and dimensions inspection; crop/focal point; normalization only when needed. Store provenance and usage notes alongside assets.
4. **Scene registry:** controlled templates with clear props and layout rules. New bespoke scenes are reviewed JSX/TSX components registered explicitly, not executable strings in project JSON.
5. **Brand presets:** fonts, colors, spacing, product treatment, logo placement, motion choices, and ratio-specific safe margins. Load local font files before a frame is captured.
6. **Render runner:** project selection, preset selection, validation, progress, cancellation, output location, and error report. Bound concurrency to available memory; process batch jobs sequentially initially.
7. **QA and delivery:** contact sheet, review MP4, technical metadata report, and a render record containing resolved timeline, asset hashes, versions, and settings.

Keep secrets and provider SDKs outside scene modules. Resolve remote inputs to local files before preview or render. Rendering must never call an AI service, fetch changing stock assets, or depend on live web content.

### Optional AI layer

V1 needs no integrated AI SDK. An assistant can write project JSON or reviewed scene code using the same file contract as a person. Manual copy, real packshots, recorded narration, supplied music, and supplied captions must be sufficient.

If integrated assistance becomes useful, add separate capability adapters for storyboard, image, speech, and transcription. Add only a capability that is actually used. Each adapter produces a normalized local artifact rather than inserting vendor-specific objects into the timeline.

```js
// Proposed interface, not implemented code.
const storyboard = await planner.createStoryboard({brief, sceneTypes});
const image = await imageProvider.createImage({prompt, size});
const speech = await speechProvider.synthesize({text, voice});
// Validate, review, and save these results before the renderer sees them.
```

Provider selection is explicit. Missing keys should disable the optional operation, not prevent preview/export of an existing project. Add timeouts, cancellation, and a cost confirmation only if a paid adapter is introduced. Do not silently switch providers or regenerate approved assets.

This system makes motion graphics and composes media. Realistic original filmed scenes require supplied footage, a separate generative model, or a separately authored 3D scene. Swapping a renderer does not create that capability.

## 6. Product-ad scene library and creative workflow

Build six scenes first:

| Scene | Purpose | Editable inputs |
|---|---|---|
| Hook | Establish the creative idea quickly | Headline, accent, background, motion preset |
| Product hero | Show a real product clearly | Packshot, scale, placement, crop, shadow |
| Benefit | Express one approved proposition | Short text, icon/diagram, emphasis |
| Detail | Show packaging or a product feature | Detail asset, callout anchors, camera crop |
| Proof | Present supplied evidence or a quote | Approved statement, source, disclosure |
| End card | Brand and next action | Logo, CTA, approved offer, URL |

Provide a few restrained motion primitives: fade/slide, scale reveal, stagger, mask wipe, and a slow camera move over an image. Use frame-derived motion and seeded randomness. Avoid introducing several unrelated animation libraries into the renderer.

Treat 9:16, 1:1, and 16:9 as distinct layouts. A narrow vertical headline, packshot, and caption stack should reflow for landscape; resizing the canvas alone is insufficient. Safe margins should be configurable by format and checked visually. Do not claim automatic current-platform compliance.

Define three initial creative directions, sharing primitives but changing composition and pacing:

- **Editorial product:** spacious packshot, restrained typography, slower movement.
- **Bold kinetic:** short hooks, sharp graphic blocks, faster reveals.
- **Technical detail:** controlled diagrams, product details, concise approved callouts.

Creative sequence: brief → storyboard → representative stills → review MP4 → revisions → final variants. Vary one creative decision at a time when producing an experiment: hook, proof point, CTA, or pacing. Generating many variants does not establish that any will perform better.

Keep logos, packaging, prices, and product facts supplied and reviewable. Generated imagery can support backgrounds or concepts, but should not quietly replace real product packaging. For a regulated product, approval/source fields and unresolved-claim draft labels are conditional production requirements.

### First reference ad

Use a generic demo product with supplied assets and placeholder copy, avoiding invented claims:

| Time | Scene | Review objective |
|---|---|---|
| 0–2 s | Hook | One readable message |
| 2–6 s | Product hero | Correct packaging and strong hierarchy |
| 6–10 s | Benefit | One supplied proposition |
| 10–12 s | Detail | A visible, factual product detail |
| 12–15 s | End card | Clear brand and CTA |

Produce this ad in all three aspect ratios before extending the feature set. A second example should use existing footage plus text overlays, so the architecture is tested beyond a packshot slideshow. Add a proof scene only when actual supporting material is supplied.

Audio is optional. Support local narration, music, and effects with gain and fades. Set scene timing from the reviewed narration when narration drives the story. Import timed captions rather than estimating word timing from text length; allow manually authored cues. Start with explicit music gain envelopes, adding automatic ducking only if needed.

## 7. Suggested project structure

```text
Video System/
  package.json
  src/
    Root.jsx
    engine/
      project-schema.js
      resolve-timeline.js
      scene-registry.js
      layouts.js
    scenes/
      Hook.jsx
      ProductHero.jsx
      Benefit.jsx
      Detail.jsx
      Proof.jsx
      EndCard.jsx
    components/
      ProductImage.jsx
      BrandLogo.jsx
      Caption.jsx
  tools/
    video.mjs
    inspect-media.mjs
    verify-export.mjs
  brands/
    demo.json
  projects/
    demo-ad/
      brief.md
      project.json
      review.md
  public/
    assets/demo-ad/
    fonts/
  docs/
    ENGINE-PLAN.md
  out/
```

This structure is proposed. Reuse existing TSX files in place when practical; do not convert working code just for extension consistency. Version source/project data; ignore temporary render caches, secrets, and output media. Assets need intentional storage decisions based on size and rights.

Proposed user commands, to implement behind one local CLI:

```powershell
npm run dev
npm run video -- validate projects/demo-ad/project.json
npm run video -- stills projects/demo-ad/project.json --preset vertical
npm run video -- render projects/demo-ad/project.json --preset vertical --quality review
npm run video -- render projects/demo-ad/project.json --preset square --quality final
npm run video -- batch projects/demo-ad/project.json --presets vertical,square,landscape
```

These commands do not exist yet. In an implemented version, failures must identify the project/scene/asset and relevant field. Use Node child processes with executable paths and argument arrays, `shell: false`, and Windows-safe path handling for native media tools.

## 8. Ordered implementation backlog

| Phase | Deliverables | Exit gate |
|---|---|---|
| 0. Establish baseline | Inspect reusable source and relevant instructions; record Node/package versions; check Chromium/media binaries; render a simple local composition. | Preview, a still, and a 1080p MP4 work from a path containing spaces. Record baseline render time and memory. |
| 1. Project contract | Runtime schema, version field, asset manifest, frame resolver, scene registry, generic composition, validation CLI. | Invalid inputs fail before rendering. A saved project renders without AI configuration. |
| 2. Product scenes | Six scenes, shared primitives, local fonts, brand preset, three aspect-ratio layouts. | Reference ad reviewed in each ratio; long text and unusually shaped packshots handled explicitly. |
| 3. Media and delivery | Clip import/trim/crop, local audio and captions, review/final presets, contact sheets, export verification and render records. | Packshot ad and footage-led example pass technical checks and full playback review. |
| 4. Repeatable production | Hook/CTA overrides, sequential batch CLI, cancellation, useful errors, documented examples. | Change copy/assets without editing shared scene code; make all three ratio exports; cancel and restart without losing the project. |
| 5. Optional extensions | Add one genuinely needed provider adapter or advanced visual module. | Provider failure cannot break rendering saved projects. Extension passes the same visual and timing checks. |

Phases 0–4 define v1. Phase 5 is optional. Avoid parallel scene-engine rewrites while the basic render pipeline is unproven.

Optional 3D can use [Remotion's Three integration](https://www.remotion.dev/docs/three). Start with one controlled product scene, frame-derived camera motion, and a reviewed model. Photorealistic materials, complex fluids, and arbitrary product-model reconstruction are separate scope and performance decisions.

## 9. Acceptance checks that finalise v1

### Functional and technical

- A clean documented installation can preview and export the example projects locally.
- With AI credentials absent and no remote assets, a prepared project renders without AI/network service calls. Initial dependency/browser downloads are a separate setup step.
- Schema/timeline checks cover invalid duration, missing asset, unknown scene, captions outside the timeline, and a clip trim longer than its source.
- Scene ranges and transitions have deliberate frame arithmetic; no accidental gaps or double-counted overlap.
- Every preset has the expected resolution, fps, stream codecs, and duration, verified from the exported file. Allow for audio encoder padding rather than requiring identical audio/video stream lengths.
- Use a broadly compatible H.264 MP4/yuv420p video baseline; include AAC when audio exists. Verify actual playback locally. Specialized platform profiles require separately checked requirements.
- Compare selected stills from sequential and out-of-order frame evaluation in the same pinned environment. Use an appropriate pixel tolerance; do not require binary-identical MP4s across machines or encoders.
- Benchmark the 15-second reference ad and a 30-second mixed-media example; record wall time, peak memory, settings, versions, and failures. Compare a few bounded concurrency settings. Choose a repeatably stable default.
- A failed/cancelled render is recorded as incomplete and does not masquerade as a finished MP4. Outputs use unique run directories or explicit overwrite behavior.

### Visual and audio

- Inspect first/last frames and frames immediately before/at/after scene boundaries.
- Watch the complete review export with sound: still images cannot prove smooth motion, timing, or sync.
- Check packshot accuracy, logo visibility, typography, captions, crops, and end-card dwell time in each ratio.
- Confirm the selected visual direction holds across the ad; a six-scene template should not become six competing styles.
- Review captions against narration, narration intelligibility against music, and any clipping or abrupt audio cuts.
- Have the user review the reference ads for creative quality. Passing code checks establishes structure, not polish or ad performance.

## 10. Decisions and remaining inputs

Chosen for planning: local Node rendering, JavaScript ecosystem, Remotion as the primary compositor, optional AI assistance, product ads/motion graphics first, and reusable scenes plus JSON project data.

Inputs needed for the first actual branded ad, not for implementing the generic engine:

- Product packshot/logo and any footage to use.
- Approved copy, offer, CTA, and any proof/source material.
- A visual reference or preferred initial direction.
- Narration/music assets if the ad uses sound.

Hardware performance, dependency compatibility, rendered quality, and license applicability remain to be checked during implementation. No dependencies were installed, no old project was migrated, and no engine render was run for this plan.

The first implementation action is Phase 0 followed by the project contract and one product-hero/hook/end-card path. Prove a complete editable ad export before filling out the rest of the library.
