# Personal Video Engine

## Objective

Create polished, code-driven videos locally with Remotion. This is a personal
creator workspace, not a SaaS, render service, or multi-user editor.

## Working rules

- Read `docs/CURRENT-TASK.md` before changing files.
- For footage-based reels, read `docs/REEL-PLAYBOOK.md` before planning the edit;
  use its source-linked creative guidance and distinguish hypotheses from results.
- Inspect the current Git diff and preserve unrelated work.
- Keep animation deterministic: derive visuals from props, the current frame,
  and the video configuration.
- Keep content and timing in typed project data; do not scatter copy or magic
  frame numbers across unrelated components.
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

## Commands

- Preview: `npm run dev`
- Validate: `npm run validate`
- Representative still: `npm run still:demo`
- Demo render: `npm run render:demo`
