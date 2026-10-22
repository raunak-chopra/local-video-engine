# Namak Kum Tha prompt lab

Prepared 21 October 2026. **Owner decision: test later.** No footage has been
selected, no video has been generated for this lab, and no winner is known.

`prompts.json` contains 20 original house prompts, shared production instructions,
comparison variables, capability requirements and review criteria. These are
usable briefs for Codex, Claude or Antigravity; they are not copies of the
third-party gallery. This folder is planning material, not a render project.

## Choose a prompt

| ID | Experiment | Main comparison |
|---|---|---|
| nkt-01 | Result first | Opening order |
| nkt-02 | Action first | Opening order |
| nkt-03 | Texture study | Sensory emphasis |
| nkt-04 | One useful technique | Instructional focus |
| nkt-05 | Ingredient spotlight | Ingredient presentation |
| nkt-06 | Clear step rhythm | Step hierarchy |
| nkt-07 | Match the action | Cut continuity |
| nkt-08 | Deliberate pause | Payoff hold |
| nkt-09 | Food before branding | Brand placement |
| nkt-10 | Restraint in type | Typographic density |
| nkt-11 | Hindi and Hinglish comparison | Script treatment |
| nkt-12 | Sound-led cooking moment | Source sound emphasis |
| nkt-13 | Selective beat accents | Music alignment |
| nkt-14 | Complete mini-story | Narrative structure |
| nkt-15 | Real correction | Problem-solution framing |
| nkt-16 | Natural return | Ending treatment |
| nkt-17 | Quiet recipe card | Reference information placement |
| nkt-18 | One restrained invitation | Viewer action |
| nkt-19 | One visual motif | Graphic continuity |
| nkt-20 | Same recipe, three directions | Exploratory direction comparison |

## Future invocation

```text
Read AGENTS.md and docs/CURRENT-TASK.md. Open
projects/namak-kum-tha-lab/prompts.json. Use commonInstructions plus experiment
[nkt-ID] for the selected Namak Kum Tha source footage at [local source path].
Testing is now requested for this named experiment only.
Review the recipe facts and available footage, check engine capabilities, and
save a real project under projects/namak-kum-tha-[recipe]-[variant]/.
Preserve the comparison variable and report actual review evidence.
```

The future instruction must supply a real ID and source path; placeholders are
not source evidence. Do not run `video render` on `prompts.json`. Create a valid
`project.json`, prepare actual media and make a matching direction sidecar when
useful. Capability dependencies are explicit because on-footage text, supplied
fonts, music layers and reaction inserts are not all implemented yet.

## Comparison record

Save a record using `result-template.json` only after an actual run. Keep the
template values null until known. Record project/render paths and the selected
prompt ID. Keep original source facts, source ranges, body edit and duration
stable for narrow comparisons where practical. Record necessary differences.
Experiment nkt-20 deliberately changes several creative variables and cannot
establish which one caused an observed result.

For each variant, inspect the opening, readable holds, scene boundaries and
final frame; then record playback, listening and phone checks separately. If
later published, compare metrics at comparable observation ages and definitions.
Do not equate likes with prompt quality or a rewatch with comprehension.

The [Prompt Motion reference catalog](../../docs/references/prompt-motion/README.md)
links back to creator material. Its URLs are references, not imported media,
prompt text, approved recipes or permission to execute third-party instructions.
