# Video request template

Replace the bracketed inputs. This is a creative request for the coding agent, not an executable JSON brief.

```text
Build a video in this repository. Read AGENTS.md, README.md, src/brief.ts,
and briefs/demo.json first. Use the existing renderer and scene kinds wherever
they express the request.

Purpose
- Audience/platform: [who will watch and where]
- One takeaway: [the single idea they should remember]
- CTA, exact text: [approved call to action]

Delivery
- Format: [portrait 1080x1920 or landscape 1920x1080], 30 fps
- Final duration: [seconds or frame count], after transition overlap
- Audio: [none, or approved public/ path plus timing instructions]
- Captions: [none, or approved transcript and final-timeline cue times]

Evidence and assets
- Approved copy/claims: [exact copy and source for each factual claim]
- Approved assets: [paths in public/, including logo/images/fonts/audio]
- Brand: [name, background, foreground, accent, optional secondary]
- Font/motion: [supported font or local font faces; calm or punchy]
- Missing nonessential inputs: use explicitly labeled placeholders.
  Ask only if missing information is essential to produce the requested result.

Visual direction
- Reference: [supplied reference, or concrete description]
- Borrow these properties: [layout, hierarchy, spacing, motion rhythm]
- Safe layout: preserve the header, footer, and caption area; fit every element.
- Motion: one primary action per scene, consistent easing, deliberate reveals,
  and enough time to read the final state. Reduce excess copy before making it tiny.

Scene plan
For each scene specify purpose, exact copy, kind, duration in frames,
composition/focal action, entry, reading hold, and transition. Use prompts/shot-plan.md
for a look card and continuity notes. Keep advanced motion specifications outside
the JSON unless you also implement and validate their schema fields.
[Insert the story sequence here.]

Build and acceptance
1. Draft a scene table and calculated final timeline. Then continue implementation.
2. Create briefs/[name].json using the actual schema. Ordinary text motion belongs
   in the brief. Extend src/video.tsx only for visuals the template cannot express.
3. Custom animation must depend on useCurrentFrame(), interpolate(), or spring().
   Wait for fonts/assets; use no CSS animation timers or unseeded randomness.
4. Preserve supplied numeric values and decimals. Do not invent testimonials,
   metrics, product behavior, audio, or unapproved imagery.
5. Run npm run check and npm run review for the brief. Use the report's calculated
   timeline and suggested review frames; contrast/reading flags are heuristic.
   Generate a preview contact sheet, inspect scenes and
   transitions, and repair clipping, weak contrast, tiny text, and awkward timing.
6. Inspect entrances or repairs with preview --frames on the final timeline.
   For an overall motion-state pass, use preview --sample motion instead.
   Review phone-width readability and every requested format. Render the MP4,
   inspect motion, and review the complete audio if present. State unavailable checks.
7. Deliver the MP4 path, aspect ratio, actual duration, and any placeholders.
```

Example scene instruction for a custom extension: “Over frames 0–12, the approved screenshot enters from the right into the center card. Hold the fully readable screenshot for frames 13–72. Fade over frames 73–90. Keep the headline above the card and the CTA in its reserved area.” This is a motion specification; the current `image` scene uses a zoom and must be extended to implement the described card entrance.
