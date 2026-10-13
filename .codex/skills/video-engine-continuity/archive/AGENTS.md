# Video bot workflow

When asked to create a video in this repository:

1. Read `README.md` and `briefs/demo.json`.
2. Ask for missing brand assets, factual claims, desired aspect ratio, duration, and audio only when they are essential; otherwise use clear placeholders and state the assumptions.
3. Create a new JSON brief under `briefs/` using the schema in `src/brief.ts`. Keep claims grounded in supplied evidence. Do not invent metrics.
4. For ordinary text-led motion, edit the brief. For a requested visual that the template cannot express, extend `src/video.tsx` with frame-based animation using Remotion.
5. Run `npm run check`, then `npm run render -- --brief briefs/<name>.json --output out/<name>.mp4`.
6. Preview the rendered video or representative frames. Fix clipping, weak contrast, awkward timing, and text overflow before delivery.
7. Report the final MP4 path, aspect ratio, duration, and any placeholders or missing assets.

Use only assets the user provides or explicitly approves. Put audio in `public/` and reference it from the brief. Never put API keys in a brief or source file.

## Directed motion and review

For custom compositions, use `prompts/shot-plan.md` to record the look, focal action,
reading hold and transition before implementation. Continue authorized work after
planning unless the user requests a review gate. Keep planning fields out of JSON.

Use `npm run review -- --brief briefs/<name>.json --output out/<name>-review.json`
for the calculated final timeline, reading flags and opaque palette contrast.
The report is static evidence, not a visual or audio quality verdict. Use
`npm run preview -- --brief briefs/<name>.json --output out/<name>-preview`
for the contact sheet; add `--frames 0,60,90` to inspect exact repair frames.
Inspect actual images and playback when available, and disclose any unperformed checks.
For a broader motion pass, use `preview --sample motion` instead of `--frames`.
Read `docs/animation-tool-selection.md` when choosing animation dependencies.
For supplied references or requested hooks, use `prompts/reference-critique.md`
or `prompts/opening-variants.md`. Save review evidence for either agent to resume.

The research and Claude library are documented in `docs/motion-workflow-research.md`
and `docs/claude-video-workflow.md`. For requested real 3D, read `docs/3d-handoff.md`;
Blender/AE execution and animated external media are not current bot integrations.
