# Reel implementation readiness audit

Historical baseline: Stage 0 issues below were subsequently repaired. Current evidence and remaining limits are in [STAGE-0-COMPLETION.md](STAGE-0-COMPLETION.md).

Date: 13 October 2026. Checked the live checkout after the final plan reconciliation. This is an implementation inventory and targeted smoke audit, not a completed reel or full regression suite.

## Current state

| Capability | Actual status |
|---|---|
| v1 project schema, scene registry, deterministic sequential timing | Implemented; demo and scene-showcase projects validate |
| Eight graphic scene types | Implemented: hook, statement, stat, list, compare, chart, quote, endCard |
| Generic rendering | A frame-45 demo still rendered through the direct Remotion CLI outside the sandbox and was visually inspected |
| Caption timing/rendering | Partial: ordinary demo cue renders, but zero-frame cues and short fades remain defective; overlaps are accepted and only the first active cue is shown |
| Project validation | Partial: shape/timing checks exist, but unsupported fields such as audio are silently stripped |
| CLI | Partial: validate/still/render runner exists; argument forwarding and output/revision behavior need repair |
| Asset folders and rights guidance | Implemented as folders/docs only; no footage/music/font/meme ingest or manifest generation |
| v2 media contract, video clips/trims/crops | Unbuilt |
| Mixed-script font runs and platform-safe text rectangle | Unbuilt; CSS fontFamily and fixed caption styling do not implement them |
| Music/ASMR/SFX/sting mixing in ProjectAd | Unbuilt; product-specific audio is separate |
| Reaction inserts, footage-led hook/tension/loop controls | Unbuilt; existing graphic Hook/EndCard do not constitute these footage features |
| Source-linked cut plans, locked revisions and media hashes | Unbuilt |
| Metrics log | Described only; no populated account results or implemented log template |
| Local upload UI, optional Whisper/beat detection/batches/OTIO | Unbuilt and correctly later/conditional |
| Two-laptop media restore | Documented only; not tested |

Only guidance and placeholders were found in `assets/`; no pilot footage or font files are available there. `ffmpeg` and `ffprobe` still do not resolve on PATH. Another installed location may exist; no claim of total absence is made.

## Checks and unresolved issues

- `npm run validate`: passed.
- Demo-ad and scene-showcase project validation: passed (300 and 495 frames respectively).
- Runtime probes: caption 0.001–0.002 s resolves to frame 0–0; overlapping captions are accepted; fade inputs `[0,8,4,12]` and `[0,0,1,1]` throw monotonic-range errors. No source fix has been applied.
- Remotion 4.0.529 reports Zod 4.6.5 installed where it expects 4.5.4. The manifest uses `^4.6.5`; the lockfile contains both versions. Align with the installed Remotion release and pin exactly, using pnpm, before expanding the schema. Do not upgrade the entire rendering stack as part of this fix.
- A sandboxed still failed during bundling. The same graphics composition rendered outside the sandbox, both directly and through the wrapper. The Zod warning persisted. The warning is a dependency gap, not a proven cause of that bundling failure.
- The npm still command with `--frame=45 --out=out/readiness-audit/demo-f45-wrapper.png` completed but actually wrote `out/demo-ad-vertical-f0.png`. Thus its frame/output flags were not forwarded in this environment. The direct Remotion CLI honored frame 45 and the requested path. Direct invocation of the TypeScript CLI honors canvas flags, as checked with `--canvas=square`.
- The wrapper also silently ignores unsupported flags; passing `--log=verbose` through npm exposed an npm configuration warning rather than yielding usable renderer logs. Define supported flags and reject unknown ones, with documented working Windows invocation.
- `.gitignore` excludes footage/fonts but not the proposed `public/generated-media/`. Add that exact generated directory ignore before preparing media; do not broadly ignore all of `public/`, which contains existing assets.
- Contact-sheet helper still risks mislabeled images when an earlier input is missing. Fix pairing and make missing files visible.
- `docs/VIDEO-SYSTEM.md` is stale: narration/transcription are mandatory and each new video gets a composition. Replace those instructions with the generic project path and speech-only branch.

Visual inspection was limited to [demo frame 45](../out/readiness-audit/demo-f45.png). Text/graphics and an ordinary cue are visible; the caption is near the bottom and does not implement the planned organic overlay-safe rectangle. No full MP4, cooking edit, audio mix, scene-boundary sweep, Hindi typography or phone-app preview was reviewed in this audit.

## Plan gaps clarified

1. The second-laptop restore must be a separate handoff check. It should not prevent declaring a correctly reviewed local Stage 1 pilot complete; report transfer readiness separately.
2. Stage 1 needs a saved editable project and identifiable revision output. Stage 2 can add convenient locked-cut revision tooling. The initial pilot cannot depend on a feature scheduled later without naming a minimal manual snapshot convention.
3. Early footage must not inherit automatic graphic-scene fades that make the first frame empty or dip each cut to the background. Default footage cuts should be direct; transitions are explicit creative choices.
4. “Font loading”, “asset library”, “caption support” and “render CLI” must not be marked complete merely because fields, folders or components exist. Each must have the stated media or playback acceptance check.

## Next build

Start Stage 0 now as the next implementation task: dependency pinning, reliable argument forwarding, short-span/overlap handling, contact-sheet labels, precise generated-media ignore and current workflow docs. Verify ordinary/short cues and scene boundaries in actual renders while preserving existing projects.

Then Stage 1: media manifest/preparation, footage scene, trims/crop, explicit font runs, safe placement, music/ASMR/SFX, reaction overlay/sting and the agreed optional creative controls. Prove a 30–60 s recipe and a 3–10 s own-footage meme-style reel. Keep a project snapshot and unique output path from the first pilot.

The owner can meanwhile provide a single raw-footage set, recipe notes, music/SFX/reaction assets and font files in the existing folders. Synthetic fixtures can verify implementation while those are pending; they cannot establish cooking quality. No Whisper installation is required for these pilots.

This audit changed documentation only. It did not pin packages, repair source code, implement reel features, commit, push or transfer media.
