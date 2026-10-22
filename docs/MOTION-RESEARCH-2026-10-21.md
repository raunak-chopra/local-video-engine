# Motion prompt research and engine decisions

Researched 21 October 2026. This is a source assessment and implementation
record for the personal local video engine. Operational instructions live in
[MOTION-DIRECTION-PLAYBOOK.md](MOTION-DIRECTION-PLAYBOOK.md); executable planning
fields are documented in [DIRECTION-CONTRACT.md](DIRECTION-CONTRACT.md).

## Findings

The strongest opportunity is to make creative decisions explicit and reviewable:
viewer purpose, a visual thesis, a small motion vocabulary, deliberate timing,
and evidence from actual rendered frames. Increasing prompt length alone is not
a quality improvement. A concise request can start exploration; production
needs decisions that survive model changes and handoffs.

The two supplied sources are useful inspiration and workflow evidence. They do
not establish a best model, a causal relationship between prompt wording and
quality, audience performance, or reproducibility of the published videos.

The repository already had deterministic rendering, typed scenes, source trims,
prepared media and export checks. Its immediate gaps were deliberate graphic
edges, a machine-checked review schedule, and portable creative instructions.
Those are the changes made in this update. Text overlays, supplied font
registries, music layers and reaction inserts remain the next reel features.

## Method and limits

Read both supplied pages, followed relevant entry links, compared prompt text
and exposed metadata, then checked technical adaptations against official
Remotion documentation and the installed 4.0.529 code. Selection was purposive:
the two discussed examples, related long briefs, repeated short briefs, music,
explainers and reusable-workflow entries. It was not a census or random sample.

The gallery homepage returned 230 films and a library count of 1,152; some entry
pages returned smaller library counts. The Reddit post describes an earlier
229-item collection. These are observed page snapshots with different crawl
times, not a synchronized dataset. No popularity distribution was recomputed.

A browser spot check of the UI-morph entry showed a compact black control on a
warm pale canvas with substantial negative space, and a later black pill/toast
with a white check and readable text. These are sampled visual observations.
The embedded player was muted; timing, sound, seamlessness and the full film
were not independently evaluated. Other gallery films were studied through
their prompt text and metadata, not claimed as watched.

Attempts to open the original X posts for the two central examples returned
errors. Credit and iteration/model metadata therefore remain gallery reports.
The recipe examples and several other entries returned cache misses; no
technical or visual conclusion is attributed to their inaccessible contents.
Skill-labelled cards exposed metadata but no reusable skill body in the fetched
text. Their labels alone do not establish that a skill was inspected.

No third-party skill was installed or executed. Prompts are analyzed and
paraphrased here rather than copied as a new instruction bundle. The gallery
credits creators and does not transfer ownership of films or source assets.

For cross-agent discovery, checked [Antigravity's official rules documentation](https://www.antigravity.google/docs/rules/):
it recognizes repository `AGENTS.md` and `GEMINI.md`. Added a short GEMINI entry
point to the same shared documents used by Codex and Claude. Automatic discovery
inside a running Antigravity session was not tested. A new vendor-specific
workflow or copied third-party skill is unnecessary for this update.

## Source ledger

Each row states what was actually available. Gallery entries are primary
published prompt records for this analysis, but not independently verified
execution logs. Technical conclusions rely on official Remotion sources.

| Source | Available evidence and bounded conclusion |
|---|---|
| [Prompt Motion homepage](https://promptmotion.org/) and [library](https://promptmotion.org/prompts) | Index, categories, creator links, Prompt/Skill distinction and ownership notice. Useful discovery surface; editorial selection is not a benchmark. |
| [Supplied Reddit discussion](https://www.reddit.com/r/PromptEngineering/comments/1x2h7rb/the_two_mostliked_claude_motion_graphics_prompts/) | Collector contrasts short and detailed requests, reports collection statistics, and explicitly warns that likes confound audience and video. Treat the counts and rankings as reported, not independently measured. |
| [Stephan Livera: résumé showreel](https://promptmotion.org/stephanlivera-df17a2) | A short request establishes duration, professional role and ambition while leaving content and style open. Useful for exploration; insufficient as a content-specific production contract. |
| [zero / twoclipping: UI morph](https://promptmotion.org/twoclipping-5cba86) | Detailed brief specifies state continuity, restrained style, beat review, time-pure rendering and separate text swaps. Its renderer is HTML/Playwright. Adapt planning and determinism; do not transplant the renderer or treat its style exclusions as universal. |
| [zero / twoclipping: photo-print film](https://promptmotion.org/twoclipping-221cab) | A second long brief ties product interactions to transformations and identifies concrete browser/render hazards. Valuable continuity design; its media-seeking workarounds and visual effects require stack-specific evaluation. |
| [dawood46 / notdwd: Frame by Frame](https://promptmotion.org/notdwd-7de38a) | Dense specification includes exact cuts, measured music offset, typography fitting and pre-render stills. It deliberately leads some beats. This supports preserving authored cue frames rather than snapping every event to a grid. Its fractional fps settings do not match this engine's integer-fps schema. |
| [fionn: blue editorial](https://promptmotion.org/fionntobin-97b7af) | Same broad showreel request as the short example; metadata says one-shot. Text alone cannot explain the title's particular visual treatment. |
| [Tolgay Hıçkıran: principles reel](https://promptmotion.org/tolgayhickiran-e90799) | Another repeated short prompt with different reported effort metadata. This is no controlled test of effort or quality. |
| [Web3 Wesley: type, form, space](https://promptmotion.org/web3wesley-7bb108) | Another broad showreel request. Useful reminder that a prompt can leave most art direction unspecified. |
| [ChatGptAstra: principles showreel](https://promptmotion.org/chatgptastra-0d95c7) | Brief Chinese direction requests professional aesthetics and a short motion piece. Language of instruction does not define output-language support or font shaping. |
| [Bogdan Dragomir: music-synced product intro](https://promptmotion.org/bogdandragomir-35e024) | Prompt asks for product explanation and synchronized music without an exposed technical beat implementation. It establishes intent, not verified synchronization. |
| [Ethan Mollick: recursion in genres](https://promptmotion.org/emollick-8661a8) | A concept-specific request makes stylistic variation serve the subject. Adapt the principle of a meaningful visual metaphor; variety alone is not a comprehension test. |
| [Anthony Riera: launch-video skill card](https://promptmotion.org/anthonyriera-9b1b2a) | Card reports Remotion and many rounds, but fetched text contains no skill body. Counters an assumption that every gallery result is one-shot, without establishing how it was made. |
| [Leon Lin: Cinetic skill card](https://promptmotion.org/lexnlin-6161a6) | Skill label and creator attribution; no readable skill implementation. No reusable technique was inferred from an absent body. |

## Technical cross-checks

| Official source | Implication for this repository |
|---|---|
| [Animating properties](https://www.remotion.dev/docs/animating-properties) | Use the current frame with interpolation; wall-clock CSS animation can flicker during frame rendering. Existing deterministic policy is correct. |
| [spring](https://www.remotion.dev/docs/spring) | Springs take frame/fps and configurable response parameters. Use intentional settling behavior; a spring is not an instruction to make every object bounce. |
| [Sequence](https://www.remotion.dev/docs/sequence) | Descendants receive a local clock offset by `from`. Existing sequential scenes remain the timing authority; review cues use global output frames. |
| [random](https://www.remotion.dev/docs/random) | Stable keyed randomness is available. Future procedural motion must include stable project/element keys rather than sample a changing random stream. |
| [Motion blur](https://www.remotion.dev/docs/motion-blur) | Real blur combines temporal samples; a trail is a different effect. Current upstream docs describe newer capabilities too. Adding blur needs installed-version checks and a measured render-cost/readability comparison. No blur package was added. |

Upstream documentation is live and can exceed the pinned dependency version.
The installed skill examples also mention APIs beyond this repository's verified
usage. This update uses only existing interpolation, spring, context and sequence
APIs; it does not upgrade dependencies to reproduce a reference effect.

## Synthesis and adoption decisions

These are our design decisions informed by the sources, not claims that the
gallery proved them effective.

| Question | Decision | Reason and acceptance evidence |
|---|---|---|
| Short or long prompts? | Use a compact exploratory brief, then save the chosen direction and shot intentions. | Distinguish creative search from repeatable production. A second agent must understand what to preserve without reading the chat. |
| One event every beat? | Optional grid for review and selected emphasis. | Recipes need time to communicate technique; edits may intentionally precede or follow a beat. |
| Always use elaborate transitions? | Each transition needs a continuity or editorial purpose. | Hard cuts are often clearer. The smallest implementation improvement is explicit graphic edges. |
| Universal effect bans? | Maintain project-specific constraints with reasons. | Liquid UI, scientific explanation and cooking footage need different vocabularies. Avoid hard-coding a fashion into every film. |
| Approval before every build? | Produce and review a plan; continue authorized work unless the owner asks for a gate. | Reference instructions asking questions are source material, not a requirement to re-ask known preferences. |
| New HTML capture stack? | Keep ProjectAd and Remotion. | Existing preparation, clip playback, font loading and render records are useful production infrastructure. |
| Exact loop endpoint duplication? | Review position, velocity and sound across wrap; avoid a duplicated endpoint hold. | In a periodic animation, exported frames are 0 through N-1 and the conceptual next frame N equals frame 0. Duplicate final/first frames can introduce an extra pause. |
| Beat detector now? | Manual or declared grid with provenance. | No music sample is supplied; precision from a declared BPM must not be presented as analyzed audio. |
| Learn only from successful demos? | Store defects, fixes and counterexamples beside the project. | Render defects and awkward holds create actionable knowledge; a gallery title or likes do not. |

## Implemented scope

- `motion` controls on existing graphic scenes: immediate or spring entrance,
  fade or hard exit. Omission preserves legacy behavior. Clip/caption timing is
  independent. Immediate entrance also settles nested staggered elements.
- Strict optional `direction.json` beside a project, linking shot intentions,
  review holds and frame/beat cues to real scene IDs.
- `video plan`: deterministic sorted review frames for scene/caption edges,
  scene midpoints, every supplied beat and cue holds; parsed-input hashes;
  no-overwrite JSON export. No media preparation is required to plan.
- Project validation includes adjacent direction files. Regression coverage
  checks beat rounding, invalid references, hold bounds, legacy fades and CLI
  behavior.
- Shared playbook, reusable prompt templates, documented contract, a small
  mechanics study and agent entry pointers. See the accompanying verification
  report for actual test/render results.

## Ordered next work

1. Finish Stage 1 slice 3: supplied-font registry, explicit script runs,
   configurable overlay insets and useful on-footage text. Test Hindi conjuncts,
   longest ingredient copy, safe placement and muted comprehension.
2. Complete music/ASMR/SFX and optional reaction inserts per the governing reel
   plan. Verify real listening and source-audio balance before automation.
3. Build the two real-footage pilots. Preserve the source ranges and log visible
   problems; use the new direction/review files during revisions.
4. Derive the first reusable visual primitive from repeated pilot needs. Likely
   candidates are masked label reveals or ingredient-to-step continuity, not an
   unrestricted transition framework. Require two uses and actual image QA.
5. Consider audio-onset analysis, seek-order frame comparisons, image-difference
   alerts and blur only after measured needs. Difference spikes should flag
   review candidates; intentional cuts are not defects by definition.

No audience results, quality ranking or claim of being the best video generator
is established by this work. Progress is measured through clearer direction,
fewer reproducible defects, useful revisions and completed reviewed videos.
