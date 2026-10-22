# Stage 0 repairs and next build

Date: 13 October 2026. Stage 0 implementation and its targeted checks are complete. This report supersedes the open-issue state in the earlier readiness audit; Stage 1 footage capabilities remain to be built.

## Implemented

- Bounded shared fades cover the full 1–16 frame caption failure range and 1–3 frame scene range. One/two-frame spans have a stable opacity instead of invalid duplicate keyframes.
- Frame resolution rejects collapsed captions/scenes and overlapping single-lane captions, including unsorted inputs. Adjacent cues remain valid.
- All v1 project, scene, props, brand and caption objects reject unknown fields. Mistyped fields no longer validate and disappear.
- Caption cues use the engine's resolved type rather than the legacy video type. Generic captions wrap responsively, inherit the project font and clear the vertical bottom 420/right 160 px bands. This is the house default; platform-specific configurable style contracts remain Stage 1.
- Generic graphics bundle Inter Variable 5.3.0 from Fontsource locally and explicitly wait for its weights. Default v1 font is Inter Variable. Custom/mixed-script supplied fonts are not implemented yet.
- Zod is pinned exactly to 4.5.4 in package and pnpm lockfile; Remotion stays 4.0.529. A frozen install passed with registry metadata review. Offline install initially lacked policy metadata; it was not a manifest/lock mismatch.
- CLI preserves additional `=` characters in values, rejects invalid/out-of-range frames, invalid/repeated/unsupported flags and existing output paths, and reports failed child starts with their actual error. In PowerShell the documented launcher is `npm.cmd`; the external npm.ps1 behavior cannot be repaired inside this repo. If npm passes consumed flags as configuration to the app, it now errors rather than silently accepting them.
- Unique run directories hold immutable parsed props and a render record. Rendering writes an incomplete filename; success publishes the requested filename after output checks. Errors leave a failed record and incomplete output rather than a final-labelled file.
- New `doctor` and `probe` commands use bundled ffprobe/ffmpeg. No system PATH install is needed for supported formats. They need normal child-process access; this sandbox can block the bundled binaries.
- MP4 rendering requests H.264/yuv420p with PNG source frames. Before publishing, it verifies video dimensions, fps, duration and pixel format via bundled ffprobe. Existing full-range historical exports were not rewritten.
- Contact sheets reject missing inputs explicitly, so labels cannot silently shift. Only `public/generated-media/` is newly ignored; existing public assets stay tracked.
- `npm run validate` now checks lint, TypeScript, all `projects/**/project.json` files and the six-case regression suite. README, VIDEO-SYSTEM and playbook instructions are current; older hosted-job/API research phases are explicitly superseded.

## Verified

- Six regression tests pass. Short-fade coverage evaluates every frame in durations 1–17, plus known invalid schema/timing and flag cases.
- Both project fixtures validate: demo-ad 300 frames / three scenes; scene-showcase 495 frames / five scenes.
- `doctor` reports aligned package versions and working bundled ffprobe/ffmpeg outside the sandbox.
- Invalid `--frame=abc`, out-of-range frame 300 and attempts to reuse an existing `--out` fail clearly. `npm.cmd` preserves requested frame, output and canvas.
- Python contact-sheet checks pass for valid inputs and explicitly reject a missing first image.
- Actual 63-frame short-span fixture rendered successfully, including all previously failing durations. Its final MP4 is 2.1 s at 30 fps, 1080×1920, yuv420p.
- Actual demo MP4 rendered and passed the same checks: 300 frames, 10 s, 30 fps, 1080×1920, yuv420p. Run records show 56.17 s and 81.11 s respectively for these two cold-ish local attempts. These are single observations, not throughput benchmarks. Peak renderer/browser memory was not measured.
- Visually inspected vertical frame 60, square frame 60, landscape frame 260, and demo frames 0/89/90/91/209/210/211/299 around its boundaries. Caption placement and local font changes are visible. Graphic-scene fades still produce dark opening/boundary frames as before; new footage scenes must use direct cuts by default. Landscape remains the existing left-oriented graphic layout, not a redesigned editorial layout.

Artifacts: `out/stage0-demo-f60.png`, `out/stage0-square-f60.png`, `out/stage0-landscape-f260.png`, `out/stage0-boundaries/`, and unique demo-ad/short-spans run folders under `out/`. The two MP4 run records contain stream metadata and elapsed times.

No full-speed playback or sound-mix evaluation was performed. The generic demo/fixture has no audio. No real cooking footage, Hindi/mixed-script output, Instagram-app preview or second-laptop restore has been reviewed. These remain Stage 1 acceptance and handoff checks.

## Stage 1 sequence

1. **Media contract and preparation:** add strict v2 dispatch while preserving v1, stable asset IDs/hashes/rights notes, selected-file preparation under the ignored public folder, metadata and supported-codec checks. Reuse bundled media tools and existing LICENSES/Envato guidance.
2. **Footage scene:** source in/out trims, direct cuts, explicit focal crop/fit and source-audio policy. Prove rotation and variable-frame-rate examples against actual decoded frames.
3. **Typography and text:** supplied Devanagari/Latin fonts, explicit text runs, configurable safe insets, ingredient/step overlays and muted comprehension.
4. **Audio and reaction:** music plus selected cooking ASMR/SFX, deterministic gains/fades, reaction image/trimmed video and aligned sting. Avoid duplicated source sound.
5. **Creative options and pilots:** hook-first opening, truthful tension, optional loop and send line; one 30–60 s recipe and one 3–10 s own-footage meme-style reel. Keep source-linked cut plans and named project/revision snapshots.

Each increment should validate/render before the next is layered on. Font files, raw footage and selected music/reaction assets are still absent from assets/. Development can use synthetic fixtures while these are pending, but real-media quality cannot be declared from them.

Upload controls follow useful pilots. Whisper is optional and should be installed on the main laptop only when speech transcription is wanted. Batch rendering, OTIO, a full editor UI and media-generation services do not delay this build.

## Scope and remaining housekeeping

No existing composition, audio file or duplicate skill folder was removed. Historical scientific narration/claim approval remains unresolved despite the existing WAV. `seed` is documented as reserved because the current scenes contain no random effects. Complete multi-process memory benchmarking and a landscape redesign are separate tasks, not evidence of Stage 0 failure.

All code/docs remain local, uncommitted and unpushed. The main laptop will not receive them via GitHub yet. When transfer is authorized, code/lockfile/docs can sync through Git; media needs a separate original-file copy and local preparation.
