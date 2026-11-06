# Personal Video Engine

## Objective

Create polished, code-driven videos locally with Remotion. This is a personal
creator workspace, not a SaaS, render service, or multi-user editor.

## Working rules

- Read `docs/CURRENT-TASK.md` before changing files.
- For creative direction, motion, reference translation or video QA, read
  `docs/MOTION-DIRECTION-PLAYBOOK.md`. Research and adoption decisions are in
  `docs/MOTION-RESEARCH-2026-10-21.md`; reusable briefs are in
  `docs/MOTION-PROMPT-TEMPLATES.md`.
- For footage-based reels, read `docs/REEL-PLAYBOOK.md` before planning the edit;
  use its source-linked creative guidance and distinguish hypotheses from results.
- For any collaborating creative-lead bot (e.g. Brand Manager or Spunge),
  art-director handoffs, creative critique or "Grill me",
  read `docs/CREATIVE-COLLABORATION.md`. Preserve accepted direction and creative
  locks; the designated bot leads creativity and this engine follows. Show
  relevant options/tradeoffs from `docs/CREATIVE-OPTIONS.md`, label capability
  gaps and translate the selected direction into observable shots.
  "Grill me" activates a focused interview; do not re-ask established decisions
  or impose an interview on routine authorized work.
- Inspect the current Git diff and preserve unrelated work.
- Keep animation deterministic: derive visuals from props, the current frame,
  and the video configuration.
- Keep content and timing in typed project data; do not scatter copy or magic
  frame numbers across unrelated components.
- Keep the render timeline in `project.json`. Optional adjacent `direction.json`
  holds validated review intentions; `video plan` generates frame samples but
  does not move cuts, analyze music or establish creative approval.
- Prefer reusable scene primitives after a pattern has appeared twice.
- Do not add authentication, databases, queues, cloud rendering, analytics, or
  SaaS infrastructure unless explicitly requested.
- Do not add paid services when a practical local tool can do the job.
- Treat generated scripts, captions, claims, and timings as drafts until they
  have been reviewed against the source material.

## Quality bar

- Use `interpolate()` and `spring()` for frame-driven motion. Avoid CSS
  transitions and nondeterministic runtime animation.
- Keep important text inside a 64 px safe area.
- Check representative frames near every scene boundary.
- Run `npm run validate` before handoff.
- For visual changes, render a still or preview and inspect the actual output.
- Report separately what was implemented, structurally verified, and visually
  reviewed.
- Record full-speed playback, listening and target-phone review separately;
  still images cannot establish those checks. Preserve exact output/frame paths
  and known defects for the next agent.

## Commands

- Preview: `npm run dev`
- Validate: `npm run validate`
- Shot/beat review plan: `npm.cmd run video -- plan projects/<id>/project.json`
- Representative still: `npm run still:demo`
- Demo render: `npm run render:demo`
