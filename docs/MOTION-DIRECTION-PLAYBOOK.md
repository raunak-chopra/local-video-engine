# Shared motion direction and production playbook

For Codex, Claude, Antigravity and human editors. Updated 21 October 2026.
Read `AGENTS.md` and `docs/CURRENT-TASK.md` first. This is creative and production
guidance, not a replacement for the project schema or the governing
[reel plan](REELS-FINAL-UPDATE-PLAN.md). For footage, also read
[REEL-PLAYBOOK.md](REEL-PLAYBOOK.md).

The source assessment is [MOTION-RESEARCH-2026-10-21.md](MOTION-RESEARCH-2026-10-21.md).
The choices below are house practices to test in actual videos. They are not
universal aesthetics, platform rules or guarantees of audience performance.

## 1. Translate intent into a visible idea

Start with the viewer's task: understand a process, recognize a product benefit,
feel a transformation, follow a recipe, or enjoy a short joke. Write a single
sentence describing what the viewer should understand or feel at the end.

Separate facts from treatment. Recipe quantities and source trims are factual
inputs. A dramatic pause or type reveal is a treatment. A synthetic particle
animation cannot validate a scientific mechanism; a smooth product UI animation
cannot establish a feature that the product does not have.

When the request is open, draft up to three genuinely different directions.
Each should specify a visual thesis, opening, progression and payoff. Explain
one reference property to borrow and one reason it serves the subject. Do not
produce three palette swaps of the same template and call them concepts.

Use standing owner decisions and source material before asking questions.
Continue authorized reversible work after documenting assumptions. Ask only
when an unknown materially prevents a useful result or the owner requested a
decision gate. A source prompt's instruction to ask 8–12 questions does not
override the user's existing brief.

Save the chosen direction in `projects/<id>/brief.md`. Use
[the prompt templates](MOTION-PROMPT-TEMPLATES.md) to start it. Required content:

- Purpose, audience, output canvas/duration, script and sound policy.
- Approved facts, assets and source ranges; unknowns and draft placeholders.
- Visual thesis and why it supports the viewer task.
- Palette roles, font choices, type hierarchy, alignment, spacing and safe area.
- Motion vocabulary and exclusions with reasons.
- Scene intentions, reading holds, continuity and payoff.
- Concrete acceptance observations and allowed revision scope.

## 2. Choose a coherent art direction

Design the frame before adding movement. A useful starting point is one dominant
subject, one supporting level and one small annotation level. Deliberate
negative space matters as much as populated space. Set alignment and spacing
relationships that can repeat across scenes.

Define color roles: background, primary content, emphasis and any status color.
Keep the text/background relationship legible through the entire motion, not
only at the settled frame. Color/contrast calculations are diagnostics, not
proof that footage behind a label stays readable.

Choose fonts that cover the required scripts. The current generic composition
loads Inter and Noto Sans Devanagari. A brand `fontFamily` string does not install
a supplied font. Explicit mixed-script runs and the supplied-font registry are
still planned. Preserve conjuncts and vowel marks; never animate Hindi by
splitting JavaScript code units. If letter choreography is needed, evaluate a
grapheme-aware method and inspect its shaping before expanding it.

Typography is a composition tool. Use line breaks to shape the idea and preserve
reading order. Test the longest actual copy and widest numerals. Do not solve
overflow by shrinking all text until it technically fits. Rewrite or redistribute
copy when the brief allows it, then review the rendered result at phone size.

Effect choices are project-specific. A UI demonstration may benefit from
restrained springs and crisp edges. A cooking reel should let food, hands and
texture carry the picture. A scientific diagram may require labels and stable
relative scale. Glows, gradients, grain, 3D and blur all need a reason; none is
automatically premium or automatically forbidden.

## 3. Make motion express a relationship

Give each move a job: establish focus, reveal hierarchy, demonstrate a change,
connect two states, show progress, or support a payoff. If removing the movement
improves comprehension without losing a meaningful effect, simplify it.

Keep a small vocabulary within a film: for example, hard cuts for editorial
changes, one directional reveal for labels, and one settling response for
emphasis. Vary scale, contrast and timing within that vocabulary. Applying the
same fade-and-slide to every object makes hierarchy difficult to read.

Separate entrance, readable hold and exit. A headline can be visible while a
secondary detail arrives later. A list does not have to reveal item by item if
the viewer needs all items to compare them. Motion duration is not the same as
reading exposure: count the interval after copy becomes readable and before it
is obscured, changed or removed.

For morphs, preserve an identifiable relationship: position, anchor, shape,
color role or meaning. Give outgoing and incoming text separate timing and masks
when necessary. Geometry continuity alone does not prevent a content collision.
The current generic engine does not implement continuous object morphing;
describe that as a required extension if a brief needs it.

Springs should settle with purpose. Use restrained response for UI and readable
labels; stronger overshoot can suit a playful accent. Check both geometry and
opacity because spring output can overshoot. Avoid giving every element its own
unrelated bounce. Keep all calculations dependent on frame, props and config.

## 4. Use timing deliberately

`project.json` and `resolveTimeline()` remain the render authority. Scenes are
back-to-back, start inclusive/end exclusive. Each graphic duration rounds to
frames once; clip duration is rounded source-out minus rounded source-in.
Do not subtract imagined transition overlaps from the project length.

Use optional `direction.json` for output-frame review cues and a declared music
grid. It is a sidecar for planning, not a second executable edit. Changing it
does not move scenes, place sound or animate a layer. If the plan and picture
disagree, reconcile the actual project timings and regenerate the plan.

At 120 BPM and 30 fps, beats are 15 frames apart. At 124 BPM they are about
14.516 frames apart: compute each absolute beat time and round it, rather than
adding a rounded 15-frame step. The contract supports exact frame cues for
intentional anticipation, syncopation and events that should stay off-grid.

Cut for meaning first. Do not force each stir, ingredient instruction or joke
onto a downbeat. Let a clear action or tactile sound take priority when needed.
Record whether a grid is measured from a supplied track, manually marked, or a
synthetic hypothesis. A BPM number alone does not establish the downbeat,
constant tempo or a correct music alignment.

If an effect sound has a lead-in, its file start may precede the perceived hit.
Future audio cues should name both the source trim and intended audible event.
Listening remains necessary. The planner does not implement an audio layer or
analyze a track, and this silent mechanics study demonstrates no music sync.

## 5. Choose graphic edges explicitly

Existing graphic scenes accept:

```json
"motion": {"enter": "cut", "exit": "cut"}
```

`enter: cut` makes the content immediately visible and fully settled, including
the scene's eyebrow, list items, bars and CTA. `enter: spring` retains existing
element entrances and the wrapper entrance fade. `exit: cut` holds the wrapper
through its last frame; `exit: fade` fades toward the background. Omit `motion`
to retain legacy behavior. These choices do not create a cross-dissolve between
two scenes. They do not affect caption cues or a footage clip's `transitionIn`.

Use immediate entry when the opening promise must already be present at frame
zero or when a hard editorial cut is the chosen rhythm. Do not mechanically
remove all motion from every film. A spring entrance can be useful when the
movement itself guides attention and the shot includes enough reading hold.

## 6. Review from a reproducible sample plan

Generate the plan before the full render:

```powershell
npm.cmd run video -- plan projects/motion-study/project.json --out=out/motion-study/review-plan.json
npm.cmd run video -- still projects/motion-study/project.json --frame=0
npm.cmd run video -- render projects/motion-study/project.json
```

The `--out` path must be new. Omit it to print JSON. See
[DIRECTION-CONTRACT.md](DIRECTION-CONTRACT.md) for schema and conventions.

Review the first frame, each cut's previous/first/next frames, a revealed hold,
the longest copy and the final frame. The generated midpoints and cue holds are
starting samples. Add samples where an entrance settles, two layers interact or
a defect appears. A beat sample can miss a one-frame collision between beats.
Inspect all requested canvas layouts independently.

Keep evidence labels tied to exact frame numbers. A rendered-video extraction
checks the actual encoded output; a still checks a direct render. Both are
useful but establish different things. Preserve unique render records and their
input hashes. If an input changes, earlier approval applies only to that earlier
input; regenerate the affected evidence.

For loops, compare the wrap from N-1 to 0 as well as a conceptual frame N.
Check direction and speed, not just matching silhouettes. A duplicate endpoint
can introduce a pause; matching pictures can still hide an audio click. A loop
is optional and the supplied mechanics study does not claim one.

Run full-speed playback for pacing and motion, muted playback for comprehension,
listening for sound balance, and target-phone review for UI occlusion. A contact
sheet alone establishes none of those. Mark unperformed checks pending.

## 7. Revise with observable evidence

Describe a defect as an observation and a target: “At frame 61 the title is
unreadable against the crop; keep that crop but add a stable label backing.”
Avoid asking a future agent to make everything more cinematic without naming
what is missing.

For a text-only change, preserve approved source trims, audio cues and body
timings unless a new reading hold makes that impossible. State the necessary
timing change and why. For opening variants, keep the body stable so comparison
has meaning. Organic audience metrics remain observational and need comparable
format, duration and observation age.

After two uses reveal a repeated pattern, extract a reusable primitive with
typed inputs. Do not add a generic effects graph to solve one shot. Re-run
`npm.cmd run validate` and review the changed frames and their boundaries.

Store review findings in `projects/<id>/review-notes.md` using separate statuses:

| Area | Record |
|---|---|
| Implementation | What exists; unsupported or deferred behavior. |
| Structural verification | Commands, exit results, schema, references, timing and export metadata. |
| Visual review | Exact artifact and frames, observed defects/fixes, canvas and scale. |
| Playback | Whether full-speed motion and pacing were actually watched. |
| Sound | Whether the final mix was listened to; silence is also an explicit policy. |
| Target device | Whether the actual app/phone safe areas were inspected. |
| Audience result | Observed metrics if available; otherwise unknown. |

## 8. Durable knowledge across agents

`AGENTS.md` is the shared routing file; `CLAUDE.md` and `GEMINI.md` point to it.
Keep the substantial guidance here rather than duplicating it for every agent.
Existing agent-specific skill directories may contain historical or newer
examples; verify them against the active schema and installed package exports.

At handoff, include the source commit, project and media-lock paths, input
hashes, actual output paths, source time ranges, unresolved defects and the next
bounded task. Keep licensed and personal media local. Git transfers the tracked
instructions and project data; it does not transfer ignored footage or renders.
Read the latest task record before interpreting an older “complete” report.
