# Direction sidecar and review-plan CLI

Implemented 21 October 2026. Code: `src/engine/review-plan.ts`.
This optional sidecar documents intent and schedules review samples. Rendering
still takes `project.json`; it never executes the direction file as animation.

## Commands

```powershell
npm.cmd run video -- plan projects/motion-study/project.json
npm.cmd run video -- plan projects/motion-study/project.json --out=out/motion-study/review-plan.json
npm.cmd run video -- plan projects/motion-study/project.json --direction=projects/motion-study/direction.json --canvas=vertical
npm.cmd run validate
```

`plan` reads an adjacent `direction.json` automatically if present. An explicit
`--direction` path is resolved from the working directory and must exist. Without
a sidecar, scene/caption review frames are still generated. Output is JSON on
stdout; `--out` creates a new file exclusively and refuses overwrites. The
command does not mutate project/media files or require prepared media.

`npm.cmd run validate` checks all project files and any adjacent direction
sidecars, then runs tests. The narrower `video validate <project>` checks the
render project and its prepared media; use `video plan` to check a specified
direction sidecar. Preparation and rendering still perform the actual source
duration/hash checks. A successful plan is not evidence that footage exists.

## Input schema

All objects are strict: unknown fields fail. Example:

```json
{
  "version": 1,
  "projectId": "motion-study",
  "beatGrid": {
    "bpm": 120,
    "offsetSec": 0,
    "beatsPerBar": 4,
    "provenance": "Synthetic timing study; no music analyzed."
  },
  "cues": [
    {
      "id": "opening-hold",
      "sceneId": "opening",
      "at": {"beat": 0},
      "holdFrames": 60,
      "role": "hook",
      "purpose": "Inspect the complete opening copy and its reading exposure."
    }
  ]
}
```

| Field | Contract |
|---|---|
| `version` | Exactly 1: sidecar format version, independent of project version. |
| `projectId` | Must equal the parsed project's ID. |
| `beatGrid` | Optional. Constant BPM from 20–300; nonnegative offset in output seconds; 1–16 beats/bar, default 4; nonempty provenance. Use a frame cue instead for changing tempo. |
| `cues` | Optional array, default empty. IDs must be unique. Cues may overlap because they are review intentions, not rendered tracks. |
| `sceneId` | Must name an existing scene. |
| `at` | Exactly `{"frame": N}` or `{"beat": B}`. Frame is a nonnegative integer. Beat is a nonnegative number and can be fractional; requires a grid. |
| `holdFrames` | Positive integer, default 1. The full `[frame, frame + holdFrames)` must fit inside the named scene. This is a review intention, not a measured reading-time guarantee. |
| `role` | `hook`, `setup`, `progress`, `proof`, `payoff`, `cta` or `transition`. |
| `purpose` | Nonempty human-readable acceptance intention. |

Beat indices are zero-based: beat 0 occurs at `offsetSec`. Bars in generated
output are one-based; changing meter changes labels, not the beat times.
Absolute conversion is:

```text
frame = round((offsetSec + beat * 60 / bpm) * fps)
```

Never accumulate a rounded beat duration. All cue frames refer to the global
output timeline, unlike `useCurrentFrame()` inside a scene Sequence. For a cue
at global frame 75 in a scene starting at 60, its local frame is 15.

## Generated output

- Project ID, canvas, fps and total frame count.
- Scene ranges `[from, endFrame)`; resolved cues with `frame` and `endFrame`.
- Every whole beat that rounds to an exported frame, with beat and bar labels.
- Sorted, deduplicated `frames`, each with all contributing review reasons.
- First/final, scene first/next/midpoint/last, pre-cut, caption edges,
  cue pre-start/start/hold midpoint/hold last and beat samples.
- `projectHash` and `directionHash`: SHA-256 of `JSON.stringify()` of the parsed,
  default-applied inputs. These are semantic input snapshots, not raw-file
  hashes, media hashes, output hashes or verification of creative approval.
  JSON property order can affect them; do not treat them as canonical JSON hashes.

Out-of-range sampling candidates are discarded, but invalid cue ranges fail.
More than 10,000 beat samples is rejected; split unusually long projects for
review. A grid beginning beyond the exported timeline fails. No-grid projects
do not invent a music tempo.

The plan is deterministic and contains no creation timestamp. It does not
render stills, fit text, measure readability, detect beats, snap cuts, place SFX,
mix music, score quality, validate a loop or grant approval. Use its frame list
with the existing `still` command or extract those frames from the review MP4.

## Graphic motion controls

All eight existing graphic types in v1/v2 accept optional:

```json
"motion": {"enter": "cut", "exit": "cut"}
```

`enter` defaults to `spring`; `exit` defaults to `fade` when a partial object is
given. Omission preserves the existing graphic fade/spring behavior. Immediate
entry returns settled entrance values for nested elements and uses full wrapper
opacity. Cut exit disables only the wrapper exit fade. Neither changes scene
duration. Clip scenes do not accept `motion`; they keep their own `transitionIn`.
Captions also keep their independent cue/fade behavior.

See `projects/motion-study/` for four scenes exercising cut/cut, spring/cut,
cut/fade and cut/cut. This is a silent mechanics fixture, not a reference-film
recreation, music synchronization demonstration or completed cooking pilot.
