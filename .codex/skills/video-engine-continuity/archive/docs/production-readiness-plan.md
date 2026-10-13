# Production readiness: research and implementation plan

Researched 12 October 2026. Scope: turn this local Remotion bot into a dependable tool for producing approved branded motion graphics, with a hosted service as a later option. Phase estimates below are planning estimates for one engineer, not measured delivery promises.

## Recommendation

Keep Remotion. Strengthen the director, media, review and job layers around it. First prove a dependable local production workflow; introduce hosted workers only when volume or collaboration requires them. Treat visual quality and operational reliability as separate release gates.

Implementation has started with phase 1; see [implementation and acceptance evidence](phase1-readiness.md).

## Research ledger

Sources were read as documentation and practitioner reports. External repositories were not installed or executed, and their demonstration videos were not independently assessed. No speed, cost, engagement or aesthetic score is treated as a verified benchmark.

| Source | Finding | Application and limit |
|---|---|---|
| [Anthropic: Claude Motion](https://support.claude.com/en/articles/17454997-get-started-with-claude-motion) | Official Motion is a code-generated animation artifact with editing and MP4 export, currently described as a Team/Enterprise beta. | Benchmark the editable workflow. It does not establish this bot's quality or reliability. |
| [GitHub: whaleyxbt/claude-motion](https://github.com/whaleyxbt/claude-motion) | Independent toolkit describes motion rules, contact-sheet review, a shared timeline, synthesized sound and deterministic simulation capture. | Borrow timeline-linked cues and review artifacts. Sound/mastering and simulation capabilities are README claims, not reproduced results. This is distinct from Anthropic's product. |
| [GitHub: official Remotion skills](https://github.com/remotion-dev/skills) | Maintained guidance covers markup, media, timing, captions, rendering and SaaS. | Audit and pin relevant guidance alongside the existing director skills; avoid duplicate or contradictory rules. |
| [GitHub: official prompt-to-motion template](https://github.com/remotion-dev/template-prompt-to-motion-graphics-saas) | Separates prompt validation, skill selection, generated code, compilation and preview. | Useful product reference. Text sanitization and compilation are not sufficient security isolation for arbitrary generated code. |
| [GitHub: Motion Director](https://github.com/abdullatif06/claude-motion-director) | HyperFrames-based director describes look cards, shot plans, scene isolation, sound cues and critique logs. | Build on the shot planning already present here. Its sync guarantees and self-scores require independent tests; a renderer migration is not justified by a README. |
| [GitHub: explainroo](https://github.com/vincentsch/explainroo) | Describes separate scripts and scenes, local narration, word alignment, ducking and layout/speech checks. | Reference architecture for optional narration and captions. Voice quality and alignment accuracy need evaluation with our own fixtures. |
| [Reddit: iterative launch-film account](https://www.reddit.com/r/ClaudeAI/comments/1wzofim/i_wanted_a_60s_motion_graphics_launch_video_for/) | Author reports weak text-heavy drafts and improvements through references and targeted redesign. | Use concrete visual metaphors and localized repairs. No audience experiment proves the hooks work. |
| [Reddit: motion-design skill](https://www.reddit.com/r/ClaudeAI/comments/1wz1621/agent_skill_for_motion_design_remotion_demo/) | Author describes concept, storyboard, implementation, sound and render review. | Preserve a reviewable storyboard and bounded repair loop. This bot's existing authorization rules govern approval gates. |
| [Reddit: launch-video account](https://www.reddit.com/r/ClaudeCode/comments/1tjm0z1/used_claude_code_to_build_a_full_launch_video/) | Reports scene-by-scene React iteration, consistent easing, selective sound and tighter editing. | Treat these as creative options, not mandatory grain, fades or a universal three-second rule. The headline's zero-cost claim is not a total-cost benchmark. |
| Instagram investigation | Exact and broad searches for Claude Motion, Remotion and Claude Code did not recover relevant Instagram post bodies. Direct requests to the [Remotion profile](https://www.instagram.com/remotion/) and [creator profile mentioned on Reddit](https://www.instagram.com/_robintamba_/) failed. | Instagram findings remain unverified. Profile identification does not verify tooling. A follow-up should inspect accessible reference reels, timestamp their hooks/holds/transitions and trace creator tooling to primary evidence. |

Technical anchors: [Remotion determinism](https://www.remotion.dev/docs/flickering), [rendering options](https://www.remotion.dev/docs/render), [frame-load timeout](https://www.remotion.dev/docs/options/timeout), and [Remotion license source](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md). Keep animation frame-derived, preload immutable data/assets, and distinguish per-frame loading timeouts from whole-job deadlines. Confirm applicable license terms before commercial rollout.

## Repository assessment

Inspected README, demo brief, schema, shared runtime, renderer, validation, fitting, QA script and existing research. During the original research pass on 12 October 2026, the agent ran `npm run check`: TypeScript and all 24 Node tests passed. This historical result was not rerun during this plan revision and does not certify later edits. The assessment describes the uncommitted working tree, not a reproducible release. HEAD at revision inspection was `ef0472fdc9a2dc9ed92c2d6de0a77abab2b9d0e0`, with numerous tracked modifications and untracked additions. This was a targeted inspection, not a full security audit. Browser integration QA, current rendered frames, full playback, audio listening and third-party demos were not checked in this pass.

Already present: aligned Remotion package versions and lockfile; nine scene kinds; portrait/landscape at 30 fps; overlap-aware timeline; reveal-duration validation; public-asset checks including realpath containment; approved local fonts; one audio source with placement/trims/fades; captions; static review; exact-frame and motion contact sheets.

Gaps visible in the inspected implementation:

- Rendering is a synchronous CLI subprocess with no application job lifecycle, cancellation, whole-job deadline, durable history or atomic publication of verified output.
- Installed-browser discovery and optional online Google Fonts leave the environment partly variable.
- FitContent can shrink long copy; fitting alone does not establish phone readability. Static contrast and reading flags cannot judge actual frames or motion.
- Render QA generates fixtures/stills and verifies metadata and invalid trims; it does not automatically assert pixel-level layout or listen to audio.
- Schema is constrained to two formats and a single audio file, without clip ingestion, stable scene IDs or schema migrations. TypeScript types and handwritten validation need protection from divergence.
- No tracked CI workflow appeared in the file inventory. No production workload or machine-capacity measurements were collected.

## Implementation sequence

| Phase | Estimated effort | Accountable role | Concrete work | Exit evidence |
|---|---|---|---|---|
| 1. Baseline and reproducible renders | 4–6 days | Engineering lead; project owner decides gate | Start from the reviewed baseline described below. Add `schemaVersion`, stable unique scene IDs and legacy-brief normalization before manifests depend on them; preserve IDs through edits/reordering and reject duplicates. Add CI for npm ci/check and browser integration QA. Establish Windows 11 as the reference platform; record OS build, Node, browser, Remotion and encoder versions. Pin dependencies/browser provisioning and record source/brief/asset hashes, schema version, scene IDs and settings in manifests. Verify Remotion and font usage rights. Create ten representative fixtures. | Clean checkout reproduces selected decoded frames on the reference platform; schema/ID compatibility checks pass. Local-font fixture works offline. Licensing decisions and render time/memory/output size are recorded. |
| 2. Reliable job runner | 4–6 days | Engineering lead | Replace blocking orchestration with cancellable worker execution. Add queued/running/validating/succeeded/failed/cancelled states, unique job directories, bounded attempts, whole-job deadlines, disk/memory guards and structured logs. Snapshot inputs, render to temporary output, verify, then publish atomically. | Cancellation and crash recovery work; missing/corrupt assets and insufficient disk fail clearly; duplicate requests cannot overwrite another job or expose partial MP4s. |
| 3. Quality gates | 5–7 days | Engineering lead for checks; creative reviewer for playback | Add measured text bounds and minimum effective text-size flags after font load, format-specific safe-area profiles, deterministic frame regression checks, dense transition samples and full-file decode/probe checks. Measure loudness/true peak and expected audio placement. Key review evidence by brief hash, schema version, scene ID and final frame/time. Save observed defect/frame/repair evidence with a repair-attempt cap. | Fixtures catch clipping, too-small type, font failures, transition defects, corrupt output and audio truncation. Each release records actual playback and audio review; automated checks never claim aesthetic approval. |
| 4. Reusable creative and media layer | 2–4 weeks, provisional; re-estimate after a clip/audio prototype | Engineering lead; project owner selects scope; creative reviewer accepts films | Extract scene registry and motion tokens; extend phase-1 versioning with named event IDs and migrations for new media fields. Build product walkthrough, diagram, chart story and kinetic typography components. Deliberately expand current limits with square/4:5 layouts, timed clips and narration/music/SFX tracks. Optional transcription/voice adapters remain outside frame rendering. Update README, CLAUDE.md, workflow docs and affected skills when tested support lands. | Three representative films pass the same gates in each supported format. Retiming named events moves captions and cues consistently; old briefs still render or migrate explicitly. Documentation accurately identifies supported integrations. |
| 5. Hosted product, if needed | Not estimated; requires separate design and workload sizing | Project owner sponsors; engineering/security/operations owners assigned before start | Add preview/edit form and job progress. Separate API/queue from isolated workers; choose long-running workers or Lambda from measured workloads. Add authentication, tenant-scoped storage, quotas, signed delivery, retention/deletion, monitoring and rollback. Execute custom generated code only in restricted ephemeral workers with no host secrets and controlled network access. | Cross-tenant isolation, quota enforcement, hosted pilot/load/cancellation tests, recovery drill and measured per-job resource/cost budgets. |

Roles above are proposed responsibilities, not assigned people; the project owner names the engineering lead and creative reviewer before implementation. One person may hold multiple local roles.

Before phase 1, review the dirty working tree, select the intended source/docs/fixtures, exclude secrets and generated outputs, commit that reviewed baseline and record its SHA (an optional tag must reference that commit). Do not tag the existing HEAD and assume it captures uncommitted work. No baseline commit or tag was created by this documentation revision.

Phases 1–3 total 13–19 engineer-days, about 3–4 weeks for a core local v1 at existing format/media limits. Including phase 4 gives roughly 5–8 engineer-weeks, before unresolved integration overruns. Phase 4 is the largest uncertainty and can be released incrementally. These estimates assume a five-day engineering week and ready approved assets; procurement, external reviews and hosted work are excluded.

## Decision gates and risks

- **After phase 1: go/no-go — is rendering reproducible?** The project owner accepts recorded clean-checkout evidence on Windows 11, versioned brief/scene identity, and resolved Remotion/font rights for the intended use. If any fails, repair the baseline before starting dependent phases 2–5. Unrelated research may continue.
- **License gate:** record the applicable Remotion version/license and whether local commercial use and the proposed hosted service require a purchased license. Check each font's embedding, redistribution and service-use permissions separately from aesthetic asset approval. Unresolved rights block affected release/deployment; replace the asset or resolve terms. Recheck when hosted scope is designed.
- **Platform gate:** Windows 11 is the initial reference. Linux CI may run portable unit checks, but render acceptance requires a provisioned Windows runner. If Linux rendering is added, keep separate measured baselines; do not assume cross-OS pixel identity. Browser, font rasterization and encoder changes require explicit baseline review and fresh decode/audio checks.
- **After phase 2:** engineering lead demonstrates cancellation, failure recovery and output isolation before declaring the runner reliable.
- **After phase 3:** project owner and creative reviewer accept the local release criteria below. The owner then decides whether phase 4's expanded formats/media are needed; prototype clip ingestion and multi-track timing before confirming its estimate. Current CLAUDE.md limits remain accurate until that implementation is verified.
- **Before/after phase 5:** approve a separate hosted design, licensing decision, staffing, budget and estimate; launch only after hosted isolation, load, recovery and pilot evidence passes. Successful local operation alone does not authorize a hosted readiness claim.

## Proposed workflow and architecture

Approved brief/assets → look and shot plan → validated versioned brief plus named events → draft frames → inspect/repair → isolated render job → file/audio verification → playback review → MP4 plus manifest and review evidence.

Keep story/look planning in Markdown sidecars, as required by AGENTS.md. Render inputs contain executable scene/media data only. Record factual evidence and asset approval in the job sidecar; flag placeholders before release. Agent judgment chooses scenes and repairs; deterministic code performs timing, rendering and verification. Existing brief-driven requests continue to work without regenerating the engine.

## Proposed release criteria

These are targets to adopt, not current results:

1. All representative fixtures pass schema, TypeScript, unit, browser and media checks in CI.
2. Selected decoded frames match across repeated runs and supported concurrency settings in the pinned environment. Compare frames, not MP4 byte equality.
3. Every delivered MP4 decodes fully and has the expected dimensions, fps and final frame count. Audio streams and placed source endings are verified where applicable.
4. Actual frames meet the chosen format's safe-area/readability policy, and playback plus listening approval is recorded for customer-facing output.
5. For local v1, the engineering lead maintains ten version-controlled fixtures covering every existing scene kind, both formats, captions, approved fonts, image assets, transitions, long copy and audio placement. Run each three times, including supported concurrency settings, from the reviewed reference environment; require no silent corruption, output collisions or unexplained failures. Include phase-2 failure/cancellation drills separately. For hosted release only, the project owner and engineering lead supply fifty representative pilot jobs from approved customer samples or labeled synthetic workloads spanning the proposed service limits. Report success/retry rates, p50/p95 latency and peak memory with sample size; this pilot supplements load/isolation testing and does not establish an SLA.
6. Every release carries its brief, asset hashes, environment/settings manifest, checks and approval record; failures preserve useful diagnostics without secrets.

Start with phase 1 and one visually strong 20–30-second reference film using supplied or approved assets. Measure the current pipeline before choosing new animation libraries, 3D integrations or cloud capacity.
