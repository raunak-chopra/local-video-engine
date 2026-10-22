# Gemini execution plan: Omega-3 SMEDS CGI explainer

## 1. Mission

Build a polished, deterministic 18-second CGI-style explainer inside the
existing Personal Video Engine repository. The film must contrast a
traditional omega-3 softgel with a Self-Micro Emulsifying Delivery System
(SMEDS) softgel using a stylized aqueous stomach environment.

This is a local Remotion production, not a SaaS feature. Use code-native 3D,
procedural particles, local audio, and local rendering. Do not use paid APIs,
stock footage, generated imagery, cloud rendering, or external services.

## 2. Repository and operating rules

- Work in `C:\Users\raunak.chopra\Desktop\Al Bots\Video Engine`.
- Read the repository `AGENTS.md`, `CLAUDE.md`, and `docs/CURRENT-TASK.md` first.
- Invoke the installed Remotion skills relevant to creation, markup,
  multimedia, captions, Studio, and rendering.
- Inspect `git status` and the current diff before editing.
- Preserve the existing `VideoEngineDemo` composition unchanged. Add a new
  composition named `Omega3SmedsExplainer`.
- Keep all animation deterministic. Do not call unseeded `Math.random()` while
  rendering.
- Use a patch-based file-editing tool rather than shell redirection, and run
  the narrowest useful validation after each implementation stage.
- Do not commit, publish, upload, or send the video anywhere unless explicitly
  requested.

## 3. Claim and product gate

Treat the supplied voiceover as locked creative input, but not as verified
product substantiation.

Before producing an unwatermarked final:

1. Identify the exact product/SKU.
2. Confirm that the SKU uses SMEDS, not another delivery technology.
3. Obtain support for all three comparative propositions:
   - most omega-3s do not fully blend in the body;
   - microscopic droplets are easier to absorb;
   - the benefit applies without a fatty meal.
4. Record the approved comparison basis and required footnote.
5. Confirm whether a product pack, logo, brand fonts, and end-card copy should
   appear.

Current internal sources allow the technology term `Self-Micro Emulsifying
Delivery System (SMEDS)`, but the current fish-oil rows in the product
cheatsheet are mapped to Thin Particle Technology. Do not silently treat those
as equivalent.

Until the gate is resolved:

- build the full animation as a review draft;
- add `DRAFT - CLAIMS UNVERIFIED` in the upper-right safe area;
- do not use a logo, product pack, numerical absorption claim, clinical seal,
  or medical endorsement;
- do not depict oil leaving the body or claim complete non-absorption;
- label scientific imagery `Illustrative visualization - not to scale` where
  the format permits;
- stop and request evidence rather than rewriting the voiceover or inventing a
  footnote.

## 4. Locked voiceover

> Most omega-3s don't fully blend in the body. Our new delivery system changes
> that. Instead of large oil drops, it forms microscopic droplets, making them
> far easier to absorb-even without a fatty meal.

Preserve the wording unless the user explicitly approves an edit. Use the
provided recording when available. If no recording exists, create only a
clearly labelled local TTS scratch track for timing; do not call that scratch
track final narration.

Target delivery:

- calm, clear, scientifically confident;
- approximately 135-150 words per minute;
- short pause after `body` and a stronger pause after `changes that`;
- final narration target: 14.5-16.5 seconds;
- no exaggerated announcer voice or childlike cadence.

## 5. Format and deliverables

### Master specification

- Composition ID: `Omega3SmedsExplainer`
- Resolution: 1920 x 1080
- Aspect ratio: 16:9
- Frame rate: 30 fps
- Target duration: 540 frames / 18 seconds
- Hard maximum: 600 frames / 20 seconds
- Codec: H.264 MP4
- Audio: 48 kHz AAC in the final MP4
- Background: deep aqueous teal with warm amber oil
- Safe area: at least 64 px on every edge

### Required outputs

- `out/omega3-smeds-review.mp4`
- `out/omega3-smeds-review-frame-intro.png`
- `out/omega3-smeds-review-frame-traditional.png`
- `out/omega3-smeds-review-frame-transition.png`
- `out/omega3-smeds-review-frame-microdroplets.png`
- `out/omega3-smeds-review-frame-endcard.png`
- `projects/smeds-omega3-cgi/cues.json`
- `projects/smeds-omega3-cgi/review-notes.md`

Keep output files ignored by Git. Commit only source, configuration, the plan,
and small timing/metadata files when the user later authorizes a commit.

## 6. Visual direction

Create premium, scientific CGI rather than literal medical anatomy.

### Environment

- Show a translucent aqueous chamber that reads as the inside of a stomach
  without gore, tissue detail, or a literal anatomical cross-section.
- Use slow caustic light, soft suspended particles, mild refraction, and depth
  fog to establish water.
- Use a faint curved membrane along one edge as an abstract absorption surface.
- Keep the camera movement slow and controlled: one establishing push, one
  transition move, and one final settling move.

### Traditional softgel

- Use a clear amber softgel with realistic highlights and a soft shell.
- On rupture, release 8-12 large amber oil globules.
- Large drops should bead together, drift, and remain visibly separate from
  the surrounding water.
- Show only a neutral contrast: slow dispersion and limited surface contact.
- Do not show oil being excreted, blocked by the body, or labelled `wasted`.

### SMEDS softgel

- Introduce a visually related softgel so the delivery-system change is the
  main variable.
- On rupture, create a compact vortex that converts the oil phase into
  approximately 250-400 tiny droplets.
- Use an instanced particle system for efficiency.
- Make droplets disperse quickly and evenly through the water volume.
- Suggest broader contact with the abstract membrane using gentle convergence
  and soft light pulses. Do not show guaranteed or complete absorption.

### Comparison language on screen

Use minimal labels only:

- `Traditional softgel`
- `Large oil droplets`
- `SMEDS softgel`
- `Microscopic droplets`
- `Self-Micro Emulsifying Delivery System`

Do not add `better`, `13X`, `fully absorbed`, `zero waste`, or other claims not
present in the approved source package.

## 7. Shot-by-shot timeline

The frame ranges below are initial semantic targets. Once final narration is
available, align scene cues to actual phrase timings and ripple later cues
forward. Do not time animation from guessed word positions after final audio
exists.

### Shot 1 - Establish the comparison, frames 0-35, 0.0-1.2 s

- Fade up from near-black into the aqueous chamber.
- Camera pushes slowly toward a floating traditional softgel.
- Bring in a small `Traditional softgel` label.
- Begin voiceover: `Most omega-3s...`

### Shot 2 - Traditional release, frames 35-125, 1.2-4.2 s

- Shell softens and opens along a natural seam.
- Release large amber drops with surface tension and mild coalescence.
- The water remains visually distinct from the oil.
- Synchronize the first clear separation moment to `don't fully blend`.
- Avoid chaotic bubbles or explosive rupture.

### Shot 3 - Slow dispersion, frames 125-185, 4.2-6.2 s

- Track two or three large drops drifting past the membrane with limited
  contact.
- Add the label `Large oil droplets`.
- Finish the first sentence on a visually stable frame.
- Do not depict a digestive exit or explicit non-absorption.

### Shot 4 - Seamless system transition, frames 185-225, 6.2-7.5 s

- Use a camera pass through one large amber droplet as a full-frame transition.
- The amber fills the screen, then resolves into the second softgel.
- Shift accent lighting from muted amber to clean cyan-teal.
- Synchronize the reveal to `Our new delivery system changes that.`

### Shot 5 - SMEDS activation, frames 225-335, 7.5-11.2 s

- Label the second capsule `SMEDS softgel`.
- Open the shell with a controlled ripple.
- Form a tight spiral of progressively smaller droplets.
- On `Instead of large oil drops`, briefly retain one large reference drop.
- On `microscopic droplets`, complete the transformation into the instanced
  microdroplet field.

### Shot 6 - Rapid microdispersion, frames 335-460, 11.2-15.3 s

- Expand the microdroplet field evenly through the chamber.
- Move the camera laterally to reveal depth and distribution.
- Increase soft membrane-contact glows without showing total uptake.
- Use the label `Microscopic droplets`.
- Synchronize the field reaching its widest distribution to `far easier to
  absorb`.

### Shot 7 - Resolve and end card, frames 460-540, 15.3-18.0 s

- Let the droplet motion settle into a clean, balanced field.
- Resolve to a simple end card:
  - headline: `Self-Micro Emulsifying Delivery System`
  - supporting line: `[Approved product message to be supplied]`
  - footnote: `[Required substantiation/footnote to be supplied]`
- Hold the final card for at least 1.5 seconds after the voiceover ends.
- Keep the draft watermark until the claim gate is complete.

## 8. Audio and captions

### Narration

- Expected file: `public/audio/smeds-omega3-vo.wav`.
- If absent, note the blocker in `review-notes.md` and use a temporary local
  timing track only.
- Once final narration exists, measure its actual duration and update the
  composition metadata. Keep the film under 20 seconds.

### Sound design

Create restrained local sound effects:

- underwater room tone;
- subtle softgel opening sound;
- low whoosh through the transition droplet;
- fine shimmer as microdroplets disperse.

Generate effects procedurally or use user-owned local assets. Keep effects
below narration and avoid a dramatic medical-commercial impact sound.

### Mix targets

- Dialogue remains clearly dominant.
- Duck ambience and effects under narration.
- Prevent clipping and audible pumping.
- Use a final web-video loudness pass only after the actual narration and
  effects are locked.

### Captions

- Create sentence- or phrase-level burned-in captions from the final audio
  timings.
- Maximum two lines.
- High contrast, no karaoke styling.
- Keep captions clear of the end-card legal line and 64 px safe area.
- Export a subtitle file only if the repository gains an approved subtitle
  export script; do not hand-author timings after final audio exists.

## 9. Technical architecture

### Dependencies

Use the existing Remotion and React versions. Add only the packages needed for
code-native 3D:

- `three`
- `@types/three`
- `@react-three/fiber`
- `@remotion/three` at the same version as the installed Remotion packages

Check current compatibility through the installed Remotion skills before
installing. Do not upgrade the whole project as part of this task.

### Proposed source layout

```text
src/
  omega3-smeds/
    Omega3SmedsComposition.tsx
    Omega3SmedsScene.tsx
    project.ts
    types.ts
    components/
      AqueousChamber.tsx
      Softgel.tsx
      TraditionalDroplets.tsx
      MicroDropletField.tsx
      AbsorptionMembrane.tsx
      ScientificLabel.tsx
      DraftWatermark.tsx
      EndCard.tsx
    lib/
      seeded-random.ts
      timing.ts
      droplet-motion.ts
```

Register `Omega3SmedsExplainer` alongside `VideoEngineDemo` in the Remotion
root. Do not replace or rename the existing composition.

### Data model

Create typed semantic cues in milliseconds and convert them centrally to
frames:

```ts
type SmedsVideoProject = {
  status: "draft" | "claims-approved";
  fps: 30;
  narrationSrc: string;
  cues: {
    traditionalReleaseMs: number;
    separationMomentMs: number;
    transitionMs: number;
    smedsRuptureMs: number;
    microdropletsMs: number;
    widestDispersionMs: number;
    endCardMs: number;
  };
};
```

Use one `msToFrame()` helper. Do not duplicate conversions across components.

### Particle implementation

- Precompute seeded positions and per-particle phase values with `useMemo()`.
- Use `InstancedMesh` for microdroplets.
- Derive every position, scale, opacity, and rotation from current frame and
  deterministic seed data.
- Keep particle count within the render-performance target.
- Do not use runtime physics simulation whose result changes between renders.
- Use motion blur sparingly; clarity of droplet size is more important.

## 10. Execution sequence for Gemini

1. Read instructions and inspect the existing project.
2. Confirm whether narration, product assets, brand fonts, and substantiation
   files exist. Report missing items without stopping structural work.
3. Create the new composition and typed project data.
4. Implement the aqueous chamber and camera with static placeholder geometry.
5. Implement traditional softgel rupture and large droplets.
6. Implement the droplet transition.
7. Implement the SMEDS softgel, seeded microdroplet field, and membrane-contact
   visualization.
8. Add labels, captions, draft watermark, and end card.
9. Add narration and restrained local sound design if usable files exist.
10. Validate TypeScript and lint.
11. Render low-resolution scene-boundary previews.
12. Inspect all required stills and correct overlaps, flicker, clipping,
    illegible labels, particle popping, and unsafe text placement.
13. Render the 1080p review MP4.
14. Watch the complete render with sound and record findings in
    `review-notes.md`.
15. Leave the composition in `draft` status unless every claim gate is
    documented as resolved.

## 11. Verification commands

Use the repository's available package manager. Equivalent commands are
acceptable if npm is unavailable.

```powershell
npm run validate
npx remotion compositions
npx remotion still Omega3SmedsExplainer out/omega3-smeds-review-frame-traditional.png --frame=120
npx remotion render Omega3SmedsExplainer out/omega3-smeds-review.mp4 --scale=0.5 --crf=28
```

After preview QA, render the final 1080p review without `--scale=0.5`.

## 12. Visual QA frames

Inspect at minimum:

- frame 20: chamber establishment;
- frame 80: traditional softgel opening;
- frame 155: large droplet separation;
- frame 205: transition coverage;
- frame 280: SMEDS rupture;
- frame 385: full microdroplet distribution;
- frame 475: end-card transition;
- frame 520: final hold.

For every inspected frame verify:

- no geometry clipping or transparent-sorting defects;
- no sudden particle jumps between adjacent frames;
- clear large-versus-micro droplet contrast;
- labels are legible and do not obscure the mechanism;
- captions remain inside safe zones;
- the comparison does not imply complete absorption or zero absorption;
- the watermark and placeholder footnote remain present while unverified.

## 13. Definition of done

The draft is complete only when:

- the existing demo still works;
- the new composition appears in Remotion Studio;
- lint and TypeScript validation pass;
- a low-resolution preview and full 1080p review render both complete;
- the five required representative stills have been visually inspected;
- the voiceover is synchronized to semantic animation events;
- audio is clear and unclipped if final narration is present;
- `review-notes.md` distinguishes implemented, visually reviewed, and blocked
  items;
- unresolved claims remain visibly marked as draft;
- no external publishing, upload, or commit has occurred.

## 14. Final handoff format

Report:

1. files added and changed;
2. commands run and their results;
3. output paths;
4. which frames and the full video were visually reviewed;
5. whether narration is final or temporary;
6. exact unresolved product/claim evidence;
7. confirmation that nothing was published or committed.
