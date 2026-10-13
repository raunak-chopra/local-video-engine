# Current shot and review plan template

Save a filled version beside the project.json. Keep these planning fields out of
the strict JSON contract. Continue authorized work after planning unless the owner
explicitly requests a review gate.

```text
Purpose, audience, intended takeaway, final action:
Approved recipe/copy/claims and source evidence:
Approved assets, source ranges, rights notes, missing inputs/placeholders:
Canvas, fps, target final frame count and audio policy:
Look: palette, bundled/supplied fonts, hierarchy, spacing, reference properties:
Format-specific safe area and actual target-phone review:

For each shot:
- Project scene ID and supported scene type.
- One idea, exact copy, focal action and source-time range if a clip.
- Final output-frame range from src/engine/resolve-timeline.ts.
- Entry, reading hold and exit in frames; cut/fade and continuity rationale.
- Audio/caption cue in output time; planned unsupported layers labelled deferred.
- Inspection frames: first, entrance, fully revealed, hold, pre-exit, last.
- Adjacent boundary frames and longest-copy case for each requested canvas.
- Observable acceptance result, not a subjective numeric quality score.

Reference critique, if supplied:
- Timing, framing, typography, colour, transitions and sound properties to borrow.
- What the current schema can express; smallest needed extension if it cannot.

Opening variants, if requested:
- Change the opening only; preserve body, assets and timing for comparison.
- State hypotheses and evaluation criteria; do not invent an engagement winner.

Review log:
- Exact project/commit, output path, frame/time, observed defect, expected result.
- Allowed repair and preserved content/timing.
- New image evidence at the defect and neighbouring boundary frames.
- Structural checks, visual checks, full-speed playback, muted comprehension,
  listening and target-phone checks recorded separately as performed or pending.
```

Use `npm.cmd run validate`; for stills use
`npm.cmd run video -- still projects/<id>/project.json --frame=N`.
Use `npm.cmd run video -- render projects/<id>/project.json` for the review MP4
and `npm.cmd run video -- probe out/<actual-run>/video.mp4` for metadata.
These paths are placeholders to replace with the actual project/run.

Current scenes are back-to-back. Do not subtract the old brief transition
overlaps from the final duration. Static palette/reading flags, if later ported,
remain suggestions; they cannot verify rendered contrast, audio or motion.
