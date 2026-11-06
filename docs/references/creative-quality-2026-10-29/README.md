# Creative quality audit evidence

29 October 2026. Read
[the audit](../../CREATIVE-TAGS-AND-QUALITY-AUDIT-2026-10-29.md) for findings,
review scope and remaining limits.

- `evidence.json` preserves all 177 frame paths/hashes, render-input hashes,
  source-text retrieval status for all fourteen categories, source code hashes,
  verification outcomes and the 36 pixel comparisons.
- `baseline-project.json` and `stress-project.json` are saved synthetic QA input
  snapshots with the vertical canvas; the run also overrides square/landscape.
  They are not approved production projects or new engine timelines.
- The `.cjs` and `.py` files are exact local runner snapshots used in the audit,
  not a new supported production CLI. They use Remotion 4.0.529's installed Node
  APIs and Pillow. Successful rendering needed normal localhost process access.
- Actual images, bundles and live run records are ignored under
  `out/creative-quality-2026-10-29/`. Git preserves this manifest, not those images.
  Copy that selected directory separately to transfer visual evidence.

The first 120 frames were generated from runtime source at `65d6390`. The next
45 repair frames use the first repair source hashes; twelve final chart frames
exercise the final source-precision change and its spring-held display.
Both repair source versions are identified in the manifest.
Running everything against the repaired source cannot reproduce the pre-repair
defects. For a new comparison, use a deliberate checkout/snapshot of the desired
source version and the pinned lockfile.

Do not run these snapshots against the existing evidence folder: they contain
the fixed original output path and refuse to overwrite rendered PNGs. Copy the
runners and change their shared output root to a new directory before a rerun;
run `render-audit`, `render-boundaries`, then `render-repairs` only when a new
repair version exists. Keep before/after source and input hashes distinct.
Use the normal `video still` / `video render` CLI for production work.

The source review manifest retains URLs and fetched HTML hashes, not archived
third-party prompt bodies. Source-text samples are not proof of watching their
videos, and public category names are not engine feature or quality labels.
