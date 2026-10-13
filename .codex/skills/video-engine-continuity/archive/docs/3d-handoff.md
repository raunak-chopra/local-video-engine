# 3D assets and motion handoff

This is a planning workflow, not an installed Blender/AE integration. Use it when a
visual needs geometry, lighting, camera motion or rigging that the 2D template cannot
express. Keep text, captions and information graphics in Remotion when that is sufficient.

## Choose the artifact

| Need | Appropriate route | Current bot handoff |
|---|---|---|
| Product still with lighting | Approved model, local Blender render | Approved PNG/JPG/WebP under `public/` in an `image` scene |
| Animated camera, exploded view or character | Reproducible Blender scene/script and draft playback | MP4 or sequence requires a new scene/schema/media implementation |
| Editable meshes for a game | Asset pipeline, relevant topology/UV audits and export report | GLB/FBX/.blend is not a current brief input |
| AE-specific compositing | Existing AE project and approved scripting/connector | Exported media needs a supported handoff or explicit extension |

Use [the shot request](../prompts/3d-shot-request.md). Check actual executable and connector
availability first. Separate local script generation, draft rendering, final rendering and
optional external generation. A research link does not install a connector or approve
its assets. Do not move API keys into briefs or source.

## Audit the appropriate thing

For an asset, state units, scale, naming, relevant triangle budget, moving pivots,
material slots, required UVs and bake/export formats. Audit only properties required
by that use: a decorative video object does not automatically need game-engine UV rules.
Save a machine-readable report with pass/fail, measured values and chosen tolerances.

For an animated shot, specify contact intervals, allowed planted-foot displacement
in scene units, floor penetration tolerance, camera framing bounds and final pose.
These checks require a real scene and geometry; they cannot be inferred from the text
brief. Save contact-event frames and a draft MP4; inspect all camera changes and listen
to any supplied soundtrack. A pre-rigged approved model reduces an avoidable uncertainty.

For any later media-scene implementation, define source duration, trim/placement,
frame rate, aspect handling, alpha, audio policy and asset validation. Add source-length
and final-timeline checks plus rendered boundary-frame tests. Do not point the current
`image.src` at an MP4 or promise a model export is a completed video.

Optional generative finishing needs verified provider availability, an explicit cost
ceiling and approved assets. Preserve a local reference render and report changes in
identity, geometry or timing. The Reddit pipelines are useful examples of decomposition;
their version names and cost estimates are not requirements for this bot.
