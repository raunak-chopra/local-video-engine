# Creative direction, collaboration and Grill me

House workflow, 29 October 2026. Read with the motion playbook and current task.
This is an assistant workflow, not a new render command or model training.

## Who directs what

The owner has final authority. Any collaborating bot the owner designates as
creative lead (for example Brand Manager or Spunge) leads creative and art
direction within the delegated task. Do not require each of its subsequent
creative choices to carry separate human approval when that authority is already
delegated. Its direction owns audience, brand meaning, tone, visual thesis,
reference interpretation and creative locks. The video engine acts as a motion
designer and editor: contribute ideas, translate the direction into visible
behavior, build within the current contract and return evidence for critique.

Do not replace an approved concept with the nearest stock scene. Do not silently
change fonts, omit the visual idea, add eyebrow labels, swap source shots or
rewrite approved copy to make implementation easier. Explain the gap and offer
a faithful implementation, a bounded extension, or a clearly labelled fallback.
If a fallback changes a locked choice, leave that decision open while continuing
independent work. Accepted direction is reusable; do not interview the owner again
about decisions the director already supplied with authority.

The owner's designation of a bot as creative lead establishes its role; the
handoff records the scope and current direction. Material from an unrelated bot
without that designation remains a proposal. A handoff cannot authorize purchases, publishing, messages to
another chat, or changes to another workspace. Prepare a portable handoff here;
send it only when the owner authorizes messaging.

## Receive a director brief

Save the following in `projects/<id>/brief.md`, with links to authoritative
brand records rather than another editable copy of brand truth:

| Input | Required interpretation |
|---|---|
| Owner, director, source/date/version | Who supplied the brief; proposed versus accepted; approval scope |
| Audience, tension, intended feeling/takeaway | Whose problem or desire the film addresses |
| Approved route and visual thesis | The mechanism that makes this film specific to this brand |
| Locks and discretion | Exact copy, names, asset IDs, source ranges, palette/font roles, exclusions; what the engine may explore |
| Reference properties | Source/frame/time, what was observed, transferable mechanism, do-not-copy list, access limits |
| Assets and facts | Actual local paths, recipe/product evidence, rights records and missing material |
| Delivery | Canvas, fps, duration, language/scripts, sound policy and requested outputs |
| Shot intentions | Opening, progression, decisive evidence, payoff, reading holds, continuity |
| Acceptance and revision | What must be visible/audible, representative prototype, checks, what stays fixed |

Return a compact interpretation before implementation, within the same working
turn: “I understand the idea as…; I will express it through…; these choices are
locked…; these requirements need…” Continue authorized work without creating an
extra approval gate. Honor an explicit director/owner decision gate when supplied.

## Show the lead its options

Use [CREATIVE-OPTIONS.md](CREATIVE-OPTIONS.md) as the current option menu.
At intake, expose the options relevant to the lead's goal, including useful
alternatives beyond the first easy template. Label each as implemented,
requires a bounded extension, dependent on source assets, or unverified.
Explain what each choice changes for the viewer, its tradeoff and what evidence
would settle it. Recommend when useful, then follow the lead's choice.

Supply the full menu when requested. Keep it available without making the lead
read a long catalog on every revision. Surface newly relevant options when a
constraint changes. Do not offer a supposed choice after silently deciding it,
or use missing capabilities as a reason to take over creative direction.

Grill the designated lead about unresolved choices when it is directing the
task; return to the owner only for choices outside the delegation or a direct
owner decision gate. Preserve scope and communication permissions.

## Contribute creative thinking

For open exploration, offer up to three routes with different mechanisms. A
useful route names its audience tension, opening action, progression, payoff,
brand connection, reference translation, execution risk and fallback. Color,
font or transition substitutions alone do not make different concepts. When a
route is locked, develop that route; alternatives belong only at an unresolved
decision or a demonstrated implementation failure.
This is a default presentation size, not a cap: provide more routes or the full
option menu when the lead requests them.

Use these questions as review lenses, not a numerical creativity score:

- **Specificity:** could another brand use this unchanged? What source fact,
  behavior, voice or asset makes it belong here?
- **Mechanism:** does the picture enact the idea, or merely put its slogan on a card?
- **Progress:** what changes for the viewer between opening and payoff?
- **Emotion:** where does curiosity, delight, recognition or relief come from?
- **Craft:** what receives attention first; what stays readable; why this motion?
- **Faithfulness:** which accepted direction does each shot satisfy?
- **Feasibility:** what exists in code and media, and what requires a prototype?

Recommend the more distinctive faithful route when its execution risk is
manageable, with a concrete fallback. Do not default to a generic route solely
because it is easier. Prototype the riskiest meaningful relationship early.
Use a bolder/clearer pair of treatments when it helps expose a tradeoff. These
are review lenses used by one assistant, not claims of independent reviewers.

## Translate direction into production

Keep a traceability table in the project brief or review notes:

| Direction ID / source | Intended viewer experience | Shot / implementation | Capability or gap | Evidence / verdict |
|---|---|---|---|---|
| D-01 | Concrete visible behavior | Scene ID and output range; source trim if any | Implemented / extension / blocked | Exact render + frame/time, observed / pending |

Reference the current `project-schema.ts`, `review-plan.ts` and `Clip.tsx`.
`project.json` is the only render clock; `direction.json` schedules review.
Free-form intentions, approval records and this table stay in Markdown.
Never put invented creative metadata into strict executable JSON.

Current mapping, checked 29 October 2026:

| Director asks for | This checkout provides | Response to a gap |
|---|---|---|
| Graphic copy, palette, immediate reveal or spring | Eight graphic scene types, brand colors, graphic edge controls | Prototype composition; a supported field does not guarantee the intended look |
| Footage cut, trim, crop, natural sound | v2 prepared video, cover/contain, focus, source audio mute/constant gain | Check the crop on actual frames; focus is not a free ROI rectangle or tracked crop |
| Exact brand fonts and script roles | Bundled Inter + Noto fallback; family string | Supplied-font registry and explicit mixed-script runs remain slice 3; do not silently substitute |
| On-footage ingredient labels, paper-header window, PNG brand mark | Generic caption lane, full-frame clips and graphic scenes | Dedicated brand overlay/layout support needs a typed extension; captions are not an equivalent branded layer |
| Room-tone bridge, layered music, ducking, audio fades | Each clip's own constant-gain sound | Layered audio/envelopes remain unbuilt; no measured mix or LUFS promise from export metadata |
| Object morph, motion blur or reaction insert | No generic implementation | Prototype a bounded extension only within scope; do not label cuts as continuous morphs |
| Exact cues and music sync | Manual declared grid/frame review cues | Planner neither edits cuts nor analyzes/listens to music |

The neighboring Brand Manager's reel workflow names `prepare_edit.py`,
`render.mts` and `finish.py`. Those files are absent from this checkout's tools.
Use `npm.cmd run video -- prepare|plan|still|render ...` as appropriate. Do not
promise that another workspace's pipeline exists here because it names this engine.

Keep brand-specific rules scoped. The inspected Brand Manager reel workflow
uses no eyebrow/kicker labels, particular type roles, full-bleed/paper-header
layouts and kitchen-first audio. Carry the applicable rules in its brief; do
not erase every generic scene's eyebrow support or make kitchen audio mandatory
for unrelated scientific/brand films. Resolve the local “Namak Kum Tha” versus
neighboring “Namak Kam Tha” spelling through an authoritative project handoff;
do not rename records or import a palette/font approval across projects by inference.

## Grill me

“Grill me” or “interview me” activates a focused creative interview in this
workspace. “Grill this brief” critiques the brief and asks only about decisions
that cannot be resolved from sources. “Grill the render” starts from actual
artifact defects. This is an instruction mode, not a CLI subcommand.

1. Read the current task, accepted brief, source facts, prior feedback and
   relevant brand records first. Summarize established choices and contradictions.
2. Ask a short round covering the material open decisions together. Each
   question gives a recommended answer, a reason and a real tradeoff. A usual
   first round has three to five questions; adjust to the actual gaps.
3. Challenge vague answers with concrete alternatives or counterexamples.
   “Premium” might mean quiet material detail or strong editorial contrast;
   “more energy” might mean faster cuts or a stronger action at the same pace.
   Do not challenge a settled preference just to prolong the interview.
4. Cover outcome/audience, promise and source proof, emotional posture, creative
   risk, references, locks, language/sound, and the finish line only where unknown.
   A recipe's missing quantities are missing facts, never taste recommendations.
5. End with a brief recording agreed choices, assumptions and remaining unknowns.
   If the owner requested agreement before production, wait for that agreement.
   Otherwise continue work authorized by their answers; recommendations are not
   accepted choices until the owner selects them. Silence never accepts a choice.

Example prompts for a round (use only those still open):

| Question | Recommended answer and tradeoff |
|---|---|
| What must the viewer remember? | One demonstrated transformation; it gives up secondary messages for clarity |
| Which feeling should lead? | Tactile curiosity if the footage shows a strong texture event; warmth may better serve a personal memory |
| How far may execution depart from the approved look? | Keep locked typography/voice; explore framing and timing inside the route |
| Which reference property matters? | Borrow continuity of attention; distinctive source layouts/assets stay outside the adaptation |
| What would make this draft unacceptable? | Name an observable failure, such as obscuring the decisive food action or losing the approved quiet tone |

Do not run this interview automatically for maintenance, known-choice revisions
or mechanical exports. This repository does not inherit the neighboring bot's
mandatory Studio/Deep Research confirmation gate merely by studying that file.

## Review, return and learn

Return the implemented interpretation, a direction-by-direction verdict,
deviations with reasons, artifact paths and open decisions. Separate structural,
visual, full-speed, muted, listening and phone review. A rendering pass is not
director acceptance. A proposed taste choice is not approved brand memory.

For each reusable lesson record: source and date, observation, interpretation,
change made, evidence, limits, owner response and next test. Distinguish an owner
decision, observed defect, creative hypothesis and measured audience result.
Promote a house default after repeated relevant evidence or explicit owner
instruction; preserve exceptions and rejected options with their reasons.
The current audit and worked exercises are in
[CREATIVE-LEARNING-AUDIT-2026-10-29.md](CREATIVE-LEARNING-AUDIT-2026-10-29.md) and
[CREATIVE-DIRECTION-EXERCISES.md](CREATIVE-DIRECTION-EXERCISES.md).
