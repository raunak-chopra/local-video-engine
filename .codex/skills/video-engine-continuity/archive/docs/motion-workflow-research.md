# Motion workflow research: Claude and the local bot

Checked 12 October 2026. These findings extend [the existing research](video-prompting-research.md).
The three accessible ClaudeWorkflows posts explicitly identify themselves as automated
database summaries. Their value/confidence scores are editorial metadata, not independent
benchmarks. Relative dates and model/version labels from the posts are not a verified release
history. No imported third-party skill or script was executed.

## Source ledger

| Supplied thread | Trace and evidence | Decision here |
|---|---|---|
| [AI-directed motion](https://www.reddit.com/r/ClaudeWorkflows/comments/1wsyjaj/workflow_claude_code_skill_for_aidirected_motion/) | Traced to the [author's post](https://www.reddit.com/r/ClaudeCode/comments/1wswg22/i_built_an_opensource_claude_code_skill_that/) and [repository README](https://github.com/abdullatif06/claude-motion-director). The author describes a HyperFrames director layer, per-scene clips, spring motion, measured audio, contact sheets, phone review and multiple aspect ratios. It is a self-reported fictional-product demonstration; the audio is a placeholder and website capture is described as untested. | Adopt explicit shot/look planning and targeted visual feedback. Do not infer aesthetic correctness from an 8/10 self-score, impose mandatory springs/handoffs, switch renderers, or claim its audio-sync guarantee here. |
| [Essential workflow / integrate](https://www.reddit.com/r/ClaudeWorkflows/comments/1x3u070/workflow_essential_claude_code_workflow_integrate/) | Unavailable through canonical, short, JSON and old-Reddit URLs; search did not recover the body. | Retain as a pending source. No findings inferred from the URL title. |
| [Blender asset pipeline](https://www.reddit.com/r/ClaudeWorkflows/comments/1x3qczp/workflow_automated_blender_3d_asset_pipeline_with/) | Traced to the [original asset-build account](https://www.reddit.com/r/ClaudeAI/comments/1x3l63i/i_gave_claude_opus_55_a_textonly_design_brief_and/). It reports a constrained text brief, shared procedural geometry/material helpers, audits before baking, and model/report exports. The production-time claim and completeness of audits have not been reproduced. | Specify measurable asset constraints and audit before costly output. Keep game-mesh requirements conditional; this is not an animation quality demonstration. |
| [Automated 3D motion](https://www.reddit.com/r/ClaudeWorkflows/comments/1x20fvp/workflow_automated_3d_motion_graphics_with_claude/) | Traced to the [original motion account](https://www.reddit.com/r/ClaudeCode/comments/1x1wt39/3d_motion_graphics_by_opus_via_blender_and/). The original distinguishes headless Blender from MCP, recommends an existing rig, describes contact/framing checks and local playback before optional paid image/video stages. It links [a custom skill](https://github.com/MattiTynka/Opus-Blender-Motion-Video); its README could not be fetched in this pass. | Separate asset building, shot animation, and optional generative finishing. Carry audit tolerances and review artifacts into a handoff. Do not reproduce advertised costs or assume named models are available. |
| [Earlier AE discussion](https://www.reddit.com/r/ClaudeAI/comments/1w0pm56/anyone_here_that_made_good_motion_graphic_videos/) | A practitioner describes scripting After Effects and inspecting rendered frames, using measured footage/voice timing. Anecdotal advice, not a renderer comparison. | Borrow the render-inspect-repair loop; AE remains optional when its capabilities are actually needed. |

## Primary technical checks

- [Claude Code skills](https://code.claude.com/docs/en/skills): repository skills live in
  `.claude/skills/<name>/SKILL.md` with YAML metadata and can be invoked by name.
  The new library uses this structure with focused descriptions and links to shared resources.
- [Claude project memory](https://code.claude.com/docs/en/memory): an `@AGENTS.md` import
  shares maintained instructions. Replaced the previous informal pointer in `CLAUDE.md`;
  this avoids relying on Claude choosing to open it.
- [W3C contrast reference](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html):
  opaque relative-luminance ratios and the 4.5:1 normal-text reference inform a review flag.
  This is not a WCAG compliance test for a video. Rendered opacity, image backgrounds,
  text size and font weight need inspection.
- Existing [Remotion timing](https://www.remotion.dev/docs/transitioning) and
  [determinism](https://www.remotion.dev/docs/flickering) guidance remains applicable.
  A 30 fps video has approximately 33.3 ms frame steps; a claim of audio alignment within
  10 ms requires sample-level measurement and audio tooling, not visual frame placement alone.

## What we built from the research

Our synthesis is a director layer over the current renderer: a look/shot plan, a static
review report, exact-frame preview selection, a phone-width sheet mode, and a Claude skill
library. Existing briefs remain executable with the same schema. The report uses the shared
overlap-adjusted timeline and suggests entrance, settled, pre-exit and transition frames.
It flags reading holds using three words per second as a planning heuristic. It does not
claim to see frames, detect glitches, measure sound peaks, or rate design.

Keep a review log with observed defect, frame/time, expected behavior, repair and new
evidence. Review all requested formats independently. Shape handoffs, springs and visual
metaphors are choices to prototype when they help explain the content. A single strong
representative scene is better evidence than an elaborate untested toolchain.

Square format, multiple audio tracks, beat/drop detection, automatic transcription,
animated external clip ingestion and Blender/AE execution remain future extensions.
Use [the 3D handoff](3d-handoff.md) when the task actually needs them. No services,
credentials, external assets or new dependencies were added in this update.

## Additional threads: tool choice and visual iteration

Checked 12 October 2026. All three additional threads were accessible.

| Source | Evidence and limits | Application |
|---|---|---|
| [Frontend libraries](https://www.reddit.com/r/Frontend/comments/ypgba4/which_js_animation_library_do_you_use_looking_for/) | An older discussion offers preferences for timelines, React interaction, 3D and AE exports. Size/performance comments conflict and supply no benchmark; mouse/scroll/SEO concerns refer to websites. | Choose by visual task; do not infer a fastest library from votes or transplant website clocks. See [tool selection](animation-tool-selection.md). |
| [Videos with Codex](https://www.reddit.com/r/codex/comments/1wsof03/how_are_you_creating_videos_using_codex/) | Replies distinguish generative footage, repeatable API orchestration and code-rendered graphics. A later reply links [explainroo](https://github.com/vincentsch/explainroo); its [README](https://raw.githubusercontent.com/vincentsch/explainroo/main/README.md) describes separate narration/scene files, local speech, word alignment, canvas rendering and QA artifacts. These features were not tested here. | Keep reusable rendering separate from agent decisions. Speech generation/alignment remain future modules. Free-hosting and model-ranking claims are not verified. |
| [Iterative workflow](https://www.reddit.com/r/ClaudeWorkflows/comments/1wzqtut/workflow_iterative_motion_graphics_workflow_with/) | Automated summary traced to the [original author](https://www.reddit.com/r/ClaudeAI/comments/1wzofim/i_wanted_a_60s_motion_graphics_launch_video_for/). They report text-heavy drafts, improvement after reference analysis, targeted redesigns and four opening variants still being tested. No comparative audience results are supplied. | Use one idea per scene, concrete reference breakdowns and targeted critique. Offer controlled opening variants when requested. Do not inherit another project's 4K/footage capabilities or claim engagement improvements. |

Our resulting bot addition is `preview --sample motion`: automatically inspect scene
starts, entrance midpoints, reveal-ready states, settled holds, pre-exit states,
transitions, caption midpoints and the final frame. This sparse sample is not a glitch
detector. The lighter default remains. Shared prompts and Claude skills now route to
tool selection, [reference critique](../prompts/reference-critique.md) and
[opening experiments](../prompts/opening-variants.md). No external packages were installed.
