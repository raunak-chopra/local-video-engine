# Using the video bot with Claude Code

Start Claude Code in the repository root. `CLAUDE.md` imports `AGENTS.md` and identifies
the project library. This setup targets Claude Code with repository access, a shell and
an image-viewing tool; a plain Claude chat cannot run these local commands automatically.
No Claude API integration is required for local Remotion rendering.

| Command in Claude | Use |
|---|---|
| `/video-director` followed by the request | Story/look plan, valid brief, custom motion when needed, review and final video |
| `/video-review` followed by a brief or defect | Timeline evidence, targeted preview frames and repairs |
| `/video-3d-plan` followed by the requested shot | Blender constraints, audit tolerances and a concrete handoff |

Use [the request prompt](../prompts/video-request.md) to supply approved copy and assets,
format, final duration and audio. [The shot plan](../prompts/shot-plan.md) captures visual
direction without inventing JSON fields. The skills refer to these maintained shared
resources rather than duplicating a separate Claude renderer or schema.

```powershell
npm run check
npm run review -- --brief briefs/demo.json --output out/demo-review.json
npm run preview -- --brief briefs/demo.json --output out/demo-preview
npm run preview -- --brief briefs/demo.json --output out/demo-motion --sample motion
npm run preview -- --brief briefs/demo.json --output out/demo-repair --frames 0,60,87,716
npm run render -- --brief briefs/demo.json --output out/demo.mp4
```

Read the JSON report for global frame numbers, reveal-ready state and readable hold.
Its contrast and reading flags are suggestions, not validation failures. Open the actual
preview PNGs using the image tool available to Claude. The HTML sheet has a phone-width
toggle; this is a size approximation and does not replace the intended device. Full MP4
playback and audio listening still matter. Report any session capability that prevented
those checks instead of claiming they were performed.

After adding the library, confirm the three skills appear in Claude's `/` menu. If the
session does not discover the new directory, start a fresh session from this root.
[Official skill documentation](https://code.claude.com/docs/en/skills) describes discovery;
[memory documentation](https://code.claude.com/docs/en/memory) describes imports. This pass
validates files and local bot commands, not a live Claude session or model comparison.

For continuation, save the brief, shot plan and concrete review notes together. Include
the final frame count, approved assets, affected frames and remaining checks. Only read
the relevant skill and source files on the next pass. There are no hooks, permission
overrides, automatic installs, background generation jobs or external service calls.
