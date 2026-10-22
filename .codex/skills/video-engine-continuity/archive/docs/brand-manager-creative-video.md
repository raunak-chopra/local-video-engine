# Brand Manager Creative introduction

30-second text-led introduction, 1080 × 1920 portrait, 30 fps, silent.

## Sources

Source workspace: `C:\Users\rauna\Desktop\Bots\Brand Manager Bot\Brand-Manager-Creative`.

- `README.md`: creative-agency workspace; strategy, voice, visual identity, campaigns, output review and per-brand memory.
- `docs/capabilities-deck/source/index.html`: canonical shareable capabilities deck. Slide 1 supplies the opening line. Slides 8 and 10 support the output examples. Slides 16–18 support creative routes, human decisions, review and approved brand memory. Slide 19 supports the different starting inputs.
- The deck's CSS supplies the ink, paper, coral and acid palette and Inter body font.
- `tools/clis/README.md` and deck slide 13 establish that live platform operations require verification and authority. The introduction describes creative work, without claiming live publishing or campaign execution.

## Production choices

The user selected the project for an introduction video. Portrait, 30 seconds and silent playback are assumed. This uses the project's own name, wording and palette with procedural motion; it does not use client material, fictional specimens, external imagery, a logo or performance metrics. There are no placeholder claims or assets. The closing invitation has no URL or contact details because none were supplied for this video.

The seven scene durations sum to 33.6 seconds. Six 0.6-second transition overlaps produce a final 30-second / 900-frame timeline.

Brief: `briefs/brand-manager-creative.json`.
Video: `out/brand-manager-creative.mp4`.
Preview: `out/brand-manager-creative-preview/index.html`.

## Validation

`npm run check` passed TypeScript validation and all 15 tests. The preview renderer validated the brief and confirmed 900 frames at 1080 × 1920. All seven settled scenes and six transition midpoint frames were inspected for contrast, text overflow and placement; the settled copy fits within the safe area.

The final H.264 MP4 was verified with ffprobe: 1080 × 1920, 30 fps, exactly 30 seconds, no audio stream. An encoded frame at 19.67 seconds was also inspected.
