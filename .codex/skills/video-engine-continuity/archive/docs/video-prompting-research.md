# Prompting JavaScript video generation

Research checked 11 October 2026. Scope: agents writing React/TypeScript/Remotion compositions, not diffusion-generated footage. The workflow below is a synthesis for this repository; it has not been tested in a controlled comparison of models or prompts.

## What the sources support

| Source | Evidence and useful finding | How to use it here |
|---|---|---|
| [Reddit: launch-video workflow](https://www.reddit.com/r/buildinpublic/comments/1szqxvj/used_claude_code_remotion_to_generate_my_apps/) | A practitioner reports that concrete entry/hold/exit descriptions and scene-by-scene iteration were useful; complex masking needed more work. Anecdote with product promotion, not an experiment. | Give one primary action per scene, preview it, then fix a specific failure. Pixel positioning still needs render inspection. |
| [Reddit: prompt format discussion](https://www.reddit.com/r/ClaudeCode/comments/1x29y8a/prompt_format_prompt_for_remotion/) | A recent discussion recommends explaining audience, story, delivery format, and visual examples before constructing the prompt. Sparse participation. | Supply the missing creative context; prompt length alone is not a quality measure. |
| [Reddit: shared ad prompt](https://www.reddit.com/r/VibeCodersNest/comments/1rmiqqt/made_with_remotion_what_do_you_think_prompt/) | A published prompt separates product truths, audience, creative direction, output, captions, and audio. It also requests external voice services and assets. Self-reported showcase. | Keep the structure; use approved local assets and this project's brief schema instead of copying its service requirements. |
| [Reddit: launch-video tips and criticism](https://www.reddit.com/r/ClaudeCode/comments/1tjm0z1/used_claude_code_to_build_a_full_launch_video/) | The author suggests consistent easing and layered audio. Commenters question promotion and an abrupt audio cut. | Consistent motion is a useful design constraint; full playback and listening remain necessary. Universal crossfades, grain, and three-second scenes are stylistic opinions. |
| [Remotion: deterministic rendering](https://www.remotion.dev/docs/flickering) | Official documentation explains frame synchronization and asset-loading requirements. | Drive motion from frame numbers; avoid CSS animation clocks, timers, and unseeded randomness. Await fonts before measuring. |
| [Remotion: transitions](https://www.remotion.dev/docs/transitioning) | Official documentation states that transition overlap shortens the final timeline. | Calculate the final duration after overlaps; align narration and captions to that timeline. |
| [Remotion: agent skills](https://www.remotion.dev/docs/ai/skills) and [prompt showcase](https://www.remotion.dev/prompts) | First-party technical guidance and inspectable prompt examples. Showcase popularity is not comparative quality evidence. | Use these as references for supported APIs and concrete motion descriptions. Do not import a large prompt pack or install skills automatically. |
| [Anthropic: context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | First-party guidance recommends clear sections, relevant examples, and enough context without exhaustive rules. | Provide the local schema, a canonical brief, approved assets, and measurable success criteria. Add instructions when observed failures justify them. |

The Reddit sample is small, self-selected, and often promotional. Savings, conversion, and quality claims are not verified. The strongest technical recommendations come from Remotion's documentation. The recommendation to combine a scene specification with a render-review loop is our inference from the sources and the project's implementation.

## A useful prompt has six inputs

1. **Purpose:** audience, platform, one intended takeaway, and the exact CTA.
2. **Grounded content:** exact copy, claims with evidence, asset paths, and permitted edits. A public URL is context, not permission to invent product capabilities or use all its images.
3. **Delivery:** aspect ratio, final duration after overlap, frame rate, and audio policy. Here the supported formats are portrait/landscape and 30 fps.
4. **Design:** colors, typography, layout hierarchy, and one reference described in concrete terms. Explain what to borrow: spacing, type scale, card layout, or motion rhythm. Use only approved visual assets.
5. **Scene contracts:** purpose, content, position, entrance, reading hold, exit, and transition. If the existing template cannot express the request, identify the smallest code extension needed.
6. **Acceptance:** valid brief, completed reveals, safe layout, readable text, accurate values, correct duration, reviewed audio, and a rendered artifact.

Keep creative planning separate from the executable JSON. The current schema has `calm`/`punchy` motion and `fade`/`slide`/`wipe`/`none` transitions; it does not support arbitrary keyframes, a camera, per-element coordinates, custom scene palettes, or beat markers. Describe advanced motion in the scene specification and implement it in `src/video.tsx`; do not silently add unsupported JSON fields.

## Improve vague requests with observable behavior

| Vague request | Concrete replacement |
|---|---|
| Make it premium | Use the supplied dark palette, one bold headline, generous spacing, a single accent, and restrained motion. Show a style frame before the full render. |
| Add cinematic transitions | Use an 18-frame fade only where the next message continues the previous one; use a clean cut when the subject changes. Account for overlaps. |
| Make the numbers exciting | Count toward the supplied value, preserve its decimals, finish before the reading hold, and keep the label visible. |
| Fix this scene | At frame 474 the third chart row collides with the detail. Fit the content into the available box, retain every value, and re-render that frame plus the transition. |
| Make a 30-second video | Make the final composition 900 frames at 30 fps after transition overlap, and show the calculated scene timeline. |

The exact 900-frame request may require durations expressed as multiples of 1/30 second. This renderer rounds scene durations to frames; a nominal scene-duration sum of 30 seconds will be shorter when transitions overlap.

## Work in four passes

**Story and specification.** Read `AGENTS.md`, `README.md`, `src/brief.ts`, and `briefs/demo.json`. Write a compact scene table and an evidence/asset list. Use clear placeholders for nonessential missing material. Ask only when a missing input is essential. For an authorized task, proceed through the remaining passes without an extra approval gate.

**Style and motion.** Render representative frames early. For new custom motion, implement one representative scene before expanding it. Specify entrance duration, stagger, easing/spring, and a reading hold in frames. Position elements in a known safe content area. An aesthetic adjective is not a layout instruction.

**Build and verify.** Prefer editing a brief for existing scene kinds. Use `npm run check`, then `npm run preview -- --brief briefs/<name>.json --output out/<name>-preview`. The contact sheet includes settled scenes, pre-exit frames, transition midpoints, and caption midpoints. Inspect longer headlines, maximum list/chart rows, and both formats when both are requested.

**Repair and finish.** Report the frame/time, visible problem, required behavior, and permitted scope. Re-render the affected frames. Then render the MP4, watch its motion, and listen to the complete soundtrack if present. Stills do not establish motion quality, intelligibility, or whether narration ends naturally.

## Audio and timing instructions that prevent common errors

Specify whether audio is absent, supplied narration, or supplied music. Do not ask the agent to select arbitrary tracks or generate a voice without approval. `audioOptions.start` is video time; `trimStart`/`trimEnd` are source times. Captions use the final video timeline, including transition overlap. A fade does not repair narration cut in the middle of a word: fix the script, trim, or scene duration.

This engine now checks reveal completion plus a minimum 0.5-second hold. That is an animation floor, not proof that someone can read the entire scene. For real copy, budget reading time based on its complexity and test playback with the intended audience. Reduce copy before shrinking it excessively.

## Evaluate the prompt, not just the generated code

Use the same approved copy, assets, format, renderer version, and model when comparing prompt variants. Record: validation failures, required repair passes, clipped elements in selected frames, completion of reveals, actual duration, decimal accuracy, audio ending, and a human readability judgment. Compare a vague prompt to the six-input prompt without changing the underlying content. Do not call an improvement proven from a single attractive render.

Reusable starting points: [video request](../prompts/video-request.md) and [frame-specific repair](../prompts/repair-video.md).

Follow-up research on directed motion, Claude skills and Blender pipelines is saved in
[motion workflow research](motion-workflow-research.md), with original-source tracing,
an unavailable-thread record, and implementation limits. The
[Claude workflow](claude-video-workflow.md) uses the same maintained resources.
