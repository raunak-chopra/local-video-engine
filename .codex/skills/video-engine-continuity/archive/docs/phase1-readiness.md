# Phase 1 implementation and evidence

Started 12 October 2026. This document records implemented mechanisms separately
from release acceptance. Phase 2 has not been started.

## Baseline and identity

Reviewed baseline commit: `d5a960b` (source, briefs, prompts, docs and tests from the
previous working tree). The original 24 tests passed again before that commit.
No credentials or generated outputs were included. Phase-1 implementation is a
subsequent change; manifests record its actual commit and dirty-tree status.

Version 1 briefs persist unique scene IDs. The CLI normalizes legacy briefs,
and `npm run migrate` writes their normalized form to a new path. Never reorder
a legacy brief before migration and expect its positional IDs to retain identity.
Review evidence includes IDs; manifests include source/brief/asset hashes.

## Reference environment

- Windows 11 is the reference platform; actual OS build/version is in manifests.
- Node 24.11.1, Remotion 4.0.534, Chrome Headless Shell 157.0.8080.0.
- H.264, yuv420p and CRF 18; encoder version and binary hash are recorded.
- Provision browser before rendering. The render path does not download it.
- Online Google-font briefs remain development-compatible. Approved local fonts
  are the release default; customer font files/rights must be supplied before a
  customer release. No customer branding was substituted in existing briefs.

The GitHub workflow uses Ubuntu for portable checks and Windows Server 2025 for
browser checks. Server CI is a separate portability environment, not proof of
Windows 11 pixel identity. It must be run after push; no hosted CI result is
claimed by adding its YAML. A local clean checkout on Windows 11 is required for
reference acceptance. Browser/OS/encoder updates require a reviewed new baseline.

## QA contract

`npm run qa:render` covers all nine scene kinds with long copy in portrait and
landscape, local-font loading, source audio metadata, trims and fade rejection.
`npm run qa:repro` creates ten deterministic fixture briefs from the versioned
generator in `tests/fixtures.mjs`, renders them three times, changes concurrency
1 → 2 → 4 and reverses still request order on run 2. It compares decoded RGBA
pixels for stills and full video, probes dimensions/fps/frame counts, checks audio
stream presence and performs a full media decode. Synthetic image/audio and the
existing demo Inter font are used; no external brand assets are fetched.

Evidence is saved under `out/phase1-qa/` and `out/integration-qa/`. QA artifacts
are not release assets. Draft scale is 0.2; visual playback, listening and
full-resolution legibility remain separate checks. Node max RSS is recorded,
and a Windows monitor samples the worker and child-process working set every
500 ms plus enumeration overhead. This is an approximate peak, not an exact
high-water mark. Timing includes
checks and still rendering in fixture manifests, not just MP4 encoding.

## License and approval gate

The user stated "no commercial license". Record this as no purchased commercial
license held, not as proof of business-size eligibility or permission to deploy.
Local development/evaluation proceeds. Commercial deployment remains pending
the intended-use/eligibility decision.

The [license for pinned Remotion 4.0.534](https://github.com/remotion-dev/remotion/blob/v4.0.534/LICENSE.md)
lists free eligibility categories and requires a company license outside them.
Check the entity and use against those terms before commercial release or hosting.
No company eligibility or purchase was inferred from the user's response.

The QA Inter file carries its upstream SIL OFL 1.1 notice in `tests/assets/`.
Its source URL and SHA-256 are recorded there. This clears the bundled test asset's
redistribution provenance; it does not approve a customer's brand font. Check
embedding, redistribution and service-use rights for each supplied customer font.

## Acceptance status

Verified rendering implementation: `7c1b3e703149c38bc99d08efdcf648a2d87201cb`
on `codex/phase1-readiness`. The compact [evidence ledger](phase1-evidence.json)
records result hashes and all ten fixture comparisons.

- TypeScript and 28 Node tests passed in the working tree and fresh checkout.
- Browser integration QA passed all nine kinds in both formats, source audio
  metadata, invalid trims and excessive fades. Expected rejection tests emitted
  an upstream page-close warning; the process exited successfully.
- Thirty fixture renders passed across concurrency 1, 2 and 4, with identical
  decoded still/full-video pixels, correct dimensions/fps/frame count and full
  decode of all streams. This suite started in the working tree before the final
  commit; its manifests preserve that provenance.
- A fresh clone of the implementation commit completed `npm ci` (zero reported
  vulnerabilities), provision verification, all 28 tests and one ten-fixture pass.
  Every normalized brief, scene-ID list, decoded still/video hash and browser
  binary hash matched the original suite. Its manifests show clean Git status.
- The clean pass sampled worker/child working set 199 times: approximate peak
  1,352,953,856 bytes (1.26 GiB). This includes browser/encoder children and
  excludes the monitor and npm launcher; short peaks can be missed. Draft QA
  memory is not a full-resolution capacity limit.
- Actual portrait stat and landscape comparison long-copy images were inspected.
  They remained inside the visible scene area; this limited review is not a
  full-resolution readability, motion or audio verdict.
- Synthetic CLI rendering, normalized sidecars, migration and static review were
  exercised successfully. CLI smoke MP4: `out/cli-smoke/video.mp4` (216×384,
  30 fps, 162 frames / 5.4 seconds), with synthetic copy and no audio.

Full evidence remains under `out/phase1-qa/`,
`out/phase1-clean/out/phase1-clean-qa/`, `out/integration-qa/` and
`out/phase1-clean-comparison.json`. The isolated checkout is QA scratch space
under ignored `out/`; it is not a separate development worktree.

The reference reproducibility and sampled-memory checks have passed. The overall
phase-1 gate remains open for hosted CI execution and intended commercial/customer
font rights. Full-resolution playback and listening remain later release checks.
Phase 2 has not started; no dependent production-readiness claim is made.
