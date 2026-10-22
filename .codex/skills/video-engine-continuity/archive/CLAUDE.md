@AGENTS.md

# Claude Code video bot

Work from this repository root. Rendering is local Remotion; Claude writes briefs
and frame-based code. No Anthropic SDK or API key is needed to render.

Project skills:
- `/video-director`: plan and build a video, then inspect and repair it.
- `/video-review`: diagnose a brief or rendered frame using timeline evidence.
- `/video-3d-plan`: specify a Blender shot or asset handoff when real 3D is needed.

Read skill details only for the current task. Use `docs/motion-workflow-research.md`
for the new source findings and `docs/claude-video-workflow.md` for setup and limits.
The same maintained prompts and source schema serve Claude and Codex.
New briefs use schemaVersion 1 and stable unique scene IDs. Preserve IDs on edits
and reordering; migrate legacy briefs to a new file with `npm run migrate` first.
Use Node/browser versions in `config/render-environment.json`; provision the
browser with `npm run provision` before render/preview. Render sidecars record
input and environment evidence, not a quality verdict. See `docs/phase1-readiness.md`.
Use `docs/animation-tool-selection.md` for library choices,
`prompts/reference-critique.md` for references and `prompts/opening-variants.md`
for requested hooks. Do not infer an audience winner from a render.

Run `npm run review -- --brief briefs/<name>.json --output out/<name>-review.json`
before rendering. It reports timeline, contrast references, and reading-time flags;
it does not inspect pixels or certify aesthetics. Use reported frame numbers with
`npm run preview -- --brief briefs/<name>.json --output out/<name>-preview --frames 0,60,90`.
Open the actual PNGs with the image-viewing tool available in your Claude session.
Record observed failures and re-check affected frames; do not invent an 8/10 score.
Use `preview --sample motion` instead of `--frames` for automatic motion-state sampling.

Keep shot descriptions and review notes outside the executable brief. Only portrait
and landscape at 30 fps are supported. Blender, AE, MCP, square output, beat analysis,
multiple audio tracks, and generated footage are not installed integrations here.
Continue authorized local work without imposing the external workflow's shot-list
approval gate; honor approval gates when the user explicitly requests them.
