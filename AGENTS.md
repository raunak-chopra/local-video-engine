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
