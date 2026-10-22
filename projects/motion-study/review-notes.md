# Mechanics study review — 21 October 2026

Implementation: optional per-graphic entrance/exit controls, validated direction
sidecar and review-plan CLI. Existing scenes remain compatible when the new
field is omitted. See `docs/MOTION-UPDATE-VERIFICATION-2026-10-21.md` for checks
and machine limitations.

## Artifacts

Paths below are repository-relative for a portable handoff. Ignored `out/`
artifacts exist on this machine; Git does not transfer them.

- Square MP4: `out/motion-study/1792577685599-d1de8edc/video.mp4`.
- Matching input props and export record: same directory, `props.json` and
  `record.json`; record status complete, 1080×1080, 30 fps, 240 frames, 8.0 s.
- Generated plan: `out/motion-study/review-plan.json` (31 unique samples).
- Decoded samples: `out/motion-study/qa/frame-NNN.png` and `contact-sheet.png`.
- Vertical opening: `out/motion-study/1792578090476-2b15a1e2/frame-0.png`.
- Landscape opening: `out/motion-study/1792578136036-1b437eee/frame-0.png`.

## Visual observations

Inspected the contact sheet of all 31 planned encoded-frame samples and the
vertical and landscape opening stills.

- Frame 0: complete opening headline and amber eyebrow; no empty opening.
- Frames 1–59: stable layout and held content, including the pre-cut frame.
- Frames 60–61: empty/nearly empty background from the explicitly chosen legacy
  spring/fade entrance. This is an intentional mechanics comparison, not the
  recommended treatment for a hook that needs immediate copy.
- Frames 75, 90, 99, 100, 105, 109 and 119: statement visible/settled; last frame
  retains the copy because exit is cut.
- Frames 120–165: list heading and all three items visible, without a staggered
  reveal. Frame 179 is dimmed by the deliberately chosen exit fade.
- Frames 180, 181, 195, 209, 210, 225 and 239: end title and CTA visible; no final
  fade. No claim of a seamless loop.
- Opening copy wraps to three lines in square/vertical and two in landscape.
  Inspected stills show no clipping and preserve more than the 64 px minimum
  edge clearance. Actual organic-app UI clearance has not been tested.

During implementation review, the stat counter was found to have an independent
progress clock. Cut entry now shows its final value too. A separate synthetic
fixture `projects/_fixtures/graphic-cut/project.json` covers stat/compare/chart/
quote, complementing this study's hook/statement/list/endCard coverage.
Its 16 encoded-frame samples were also inspected; all four types show settled
content at their first and last frames. Exact frames/artifacts are in the shared
verification record.

## Pending review

Full-speed playback, real phone/app display, real-footage behavior and listening
were not performed for this silent graphics update. A still/contact sheet does
not establish those results. Complete cooking pilots remain on the existing
Stage 1 roadmap; they are not replaced by these fixtures.
