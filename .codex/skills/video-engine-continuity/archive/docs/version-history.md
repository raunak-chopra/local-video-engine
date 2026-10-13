# Version history

## 2026-10-12 — Animation tools and iterative design follow-up

- Read all three new supplied Reddit threads; traced the automated iterative-workflow
  summary to its author and inspected the explainroo README linked from the Codex
  discussion. Checked Remotion's current third-party, GSAP, Lottie and Three guidance.
  Saved source limitations and a tool-selection table without installing dependencies.
- Added reference critique and requested opening-variant prompts. Codex's shared
  instructions and Claude's instructions/director/review skills now route to them.
  Opening comparisons preserve body timing and do not assume an engagement winner.
- Added `preview --sample motion` for automatic start/entrance/ready/hold/pre-exit/
  transition/caption/final samples. Default settled sampling and exact-frame selection
  remain; conflicting flags fail before browser work. Metadata records sampling mode.
- Verification: TypeScript and all 24 tests passed; four new tests cover frame selection,
  overlap/cuts, captions, punchy timing and invalid CLI options. Both changed Claude
  skills passed the skill validator. Browser rendering produced 40 unique demo samples
  under `out/research-motion-preview/` at 40% scale. Inspected entrance frame 23,
  transition frame 96 and chart frame 447. Sparse samples do not verify every-frame
  motion or audio; no new MP4, live Claude test or audience experiment was performed.
- Pre-existing edits remain. No commit, publication, new asset or external generation.
  Roll back this pass selectively through the preview module/tests and documented
  prompt/instruction additions; do not discard earlier workspace changes.

## 2026-10-12 — Directed motion research and Claude Code library

- Researched the four supplied ClaudeWorkflows links. Three accessible automated
  summaries were traced to their original Reddit posts; the motion-director README
  was also inspected. The essential-workflow link remained unavailable after several
  retrieval attempts and is recorded as pending, without invented conclusions.
- Added original Claude Code project skills for directing, reviewing and planning 3D.
  `CLAUDE.md` now imports `AGENTS.md`; both agents share the source schema, prompt
  library and review workflow. Added look/shot and 3D request templates plus source,
  Claude usage and 3D handoff documents. No external skill was installed or executed.
- Added `npm run review`: validated local brief/assets, overlap-adjusted timing,
  recommended frame samples, opaque palette contrast references and heuristic reading
  flags. It explicitly does not certify visual, audio or aesthetic quality.
- Added exact-frame `preview --frames` selection and a 360px image-width review toggle.
  Existing preview defaults and the executable brief schema remain unchanged.
- Verification: TypeScript and all 20 tests passed, including five new report/CLI/frame
  tests. The skill-creator validator passed all three skill files. Browser preview
  initially failed on a sandbox loopback restriction; an approved retry rendered
  frames 0, 60, 87 and 716 from the existing demo. Visually inspected frames 60 and 716
  for layout and contrast. The preview metadata reports 717 frames / 23.9 seconds.
- Limits: no live Claude session, Blender/AE pipeline, phone-toggle UI interaction,
  full MP4 playback or audio-sync test was performed in this update. No new film,
  dependency, asset, credential or paid service was added. Pre-existing workspace
  edits were retained. No commit, push or publication was performed.
- Rollback: remove this pass's skills/docs/review module/tests, restore the earlier
  instruction/prompt/preview/package-script edits selectively, and retain any wanted
  review artifacts. Avoid discarding the earlier uncommitted engine work.

## 2026-10-11 — Rendering quality and researched prompting workflow

- Behavior: fit scene content after font loading within header/footer/caption space; wrap long headline words; preserve final stat strings and decimal chart values; validate animation reveals, transition overlap, and a minimum reading hold with shared timeline functions.
- Added an HTML contact-sheet preview command, optional placed/trimmed audio with volume and fades, manually timed captions, and approved local font loading. Existing plain audio paths and demo briefs remain supported. Very short scenes that cannot complete their reveals now fail validation with a minimum-duration message.
- Dependencies: all installed Remotion packages aligned to 4.0.534; promoted renderer, bundler, fonts, and media utilities to direct dependencies. Updated the compatible source-map-js patch to remove its reported advisory. React and TypeScript versions are unchanged.
- Prompting: researched four Reddit discussions plus Remotion and Anthropic primary sources; saved an evidence table, scope/limitations, a practical workflow, and two original request/repair prompt templates. These are a synthesis, not a measured claim that one prompt outperforms another.
- Verification: `npm run check` passed TypeScript and all 15 tests; `remotion versions` confirmed version alignment; npm reported zero vulnerabilities after the targeted patch. `npm run qa:render` rendered all nine scene kinds with long copy in portrait and landscape, loaded the demo's Inter font locally, rendered a synthetic soundtrack, and rejected invalid source trims and excessive fades. Expected invalid-metadata cases emitted nonfatal Remotion browser-page cleanup warnings.
- Visual/audio QA: reviewed baseline and upgraded MP4 scene frames, landscape previews, and long-copy stress frames. Synthetic audio waveform checks confirmed delayed placement, attack/release ramps, and ending silence. Extreme copy fits but can become small; the README and prompts recommend shortening it and reviewing readability. Representative-frame review does not replace full motion/audio review for publication.
- Deliverable: `briefs/quality-demo.json` renders a silent portrait example at 1080×1920, 30 fps, 717 frames (23.9 seconds), with clearly labeled placeholder brand, metrics, chart data, quote, captions, and CTA. QA fixtures and rendered outputs remain under ignored `out/`; no new production assets were downloaded.
- Rollback: restore the previous tracked source/manifests and run `npm ci`; retain any wanted brief or prompting documents separately. No commit, push, or publication was performed in this pass.

## 2026-10-07 — Preserve the video-engine baseline

- Behavior: record the existing 0.1.0 Remotion video engine in Git; keep local environment files out of source control. This is source preservation, not a rendered-video or commercial-release approval.
- Changed files: baseline README/instructions, package manifests and lockfile, TypeScript configuration, briefs, source, renderer/validation scripts, tests; added environment exclusions in `.gitignore` and this history file.
- Reason: the local and remote repositories had no commits, leaving the working source without a GitHub backup.
- Verification: `npm run check` passed TypeScript checking and all seven existing tests. Video rendering was not run in this Git preservation pass.
- Rollback: retain the initial source commit as the baseline; revert subsequent maintenance commits on a feature branch if needed. Remove the added environment-ignore rules only if a reviewed configuration policy replaces them; never commit actual secrets.
