# Choosing animation tools for the bot

The bot exports arbitrary video frames; a website responds to time and user input.
The older [Frontend discussion](https://www.reddit.com/r/Frontend/comments/ypgba4/which_js_animation_library_do_you_use_looking_for/)
offers preferences, not current performance or bundle-size rankings.

| Visual need | Starting point | Bot requirement |
|---|---|---|
| Text, charts, diagrams, SVG shapes and cards | Existing React/CSS layout and Remotion interpolation/springs | Small frame-driven scene extension |
| Complex reusable tween timelines | GSAP with a Remotion adapter | Optional dependency; frame synchronization and render tests |
| React hover, gestures or interactive layout | Motion/Framer Motion | Translate website interaction into a reproducible video timeline |
| Approved AE vector animation export | Lottie through Remotion | Optional adapter; test actual export features and frame timing |
| Procedural geometry, camera and lighting | Three.js through Remotion | Optional adapter; deterministic scene and asset loading |
| Modeling, rigging and baking | Blender | Separate [3D handoff](3d-handoff.md) |
| Photoreal footage | Supplied/approved media or authorized generation | Current brief schema lacks animated clip ingestion |

[Remotion's integration guide](https://www.remotion.dev/docs/third-party) requires
frame synchronization, lists GSAP/Lottie/Three adapters and describes Framer Motion
as lacking an official integration. The [GSAP adapter](https://www.remotion.dev/docs/gsap)
pauses and seeks the timeline using the current frame instead of the wall-clock ticker.
[Lottie](https://www.remotion.dev/docs/lottie) and [Three](https://www.remotion.dev/docs/three)
also have Remotion packages. These optional packages are not installed here; check
compatibility and keep Remotion versions aligned before adding one.

Use CSS for layout and frame-derived styles. Free-running CSS animations,
requestAnimationFrame loops and live mouse/scroll events do not define an export
timeline. A synchronized adapter may support an alternate implementation.

For comparisons, hold copy/assets, dimensions, frame count, machine, renderer and
concurrency constant. Measure render time/memory and inspect identical frames and
playback. Website startup/bundle measurements answer a different question. Weak
composition alone is not evidence that another library will fix the video.
