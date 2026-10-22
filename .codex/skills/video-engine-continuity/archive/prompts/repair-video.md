# Frame-specific repair template

```text
Repair [brief path / scene kind] in this repository.
Evidence: [preview image path], frame [number], time [seconds].
Visible problem: [concrete observation, e.g. the detail overlaps the fifth list row].
Required result: [concrete behavior, e.g. all five rows and the detail fit above captions].
Preserve: [exact copy, values, assets, palette, and timing that must stay].
Allowed changes: [brief copy/timing, or layout/motion implementation].

Inspect the current code and image. Fix the cause, not just that one timestamp.
Use npm run review -- --brief [path] to calculate the final timeline and suggested
frames. Contrast/reading flags are static hints, not a rendered visual verdict.
Use preview --frames [comma-separated global frames] for a targeted repair sheet.
For a broader entrance/transition pass, use --sample motion instead of --frames.
Check the fully revealed scene, its pre-exit frame, and both adjacent transitions.
Use frame-based animation and wait for loaded fonts before measurement.
Run npm run check, regenerate affected preview frames, and render the final MP4.
Report what changed and any remaining limitation supported by the preview.
```
