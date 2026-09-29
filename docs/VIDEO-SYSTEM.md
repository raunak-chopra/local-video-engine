# Video system

## Pipeline

1. Define a focused brief and audience.
2. Approve the narration script.
3. Record or generate narration locally.
4. Transcribe final audio and derive word timings.
5. Convert timings into captions and visual cues.
6. Implement deterministic Remotion scenes.
7. Preview scene boundaries and representative frames.
8. Mix audio, validate, and render the final MP4.

## Source of truth

`src/video/project.ts` currently contains typed input for the demonstration.
Future videos should receive their own project data module and composition.

Timing is stored in frames at the composition frame rate. Audio-derived tools
may work in milliseconds, but should convert through a single helper before
being consumed by scenes.

## Deliberate exclusions

This repository does not include a web product, accounts, a database, cloud
rendering, job queues, billing, or multi-user editing.
