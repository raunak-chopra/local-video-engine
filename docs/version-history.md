## 2026-11-06 — Preserve scene layout and creative review improvements

- Behavior: preserve owner changes to decimal chart labels, dense chart/list layouts and long stat fitting, plus creative review guidance and synthetic fixtures.
- Changed files: pending scene implementations/tests, shared instructions, and creative direction/reference documents in this checkpoint.
- Reason: resume the paused source preservation with reviewed source separated from generated media and local configuration.
- Verification: npm run validate passed (24 tests passed, one real-media test skipped). Fresh chart-square, long-stat vertical and dense-list landscape stills were rendered and visually inspected. Playback, audio and device acceptance were not tested.
- Rollback: revert this checkpoint commit on a feature branch. Original worktree and staging are preserved; no release or main integration is included.

## 2026-10-22 — Preserve motion direction and review-plan source

- Behavior: preserve the existing optional graphic entrance/exit controls, direction sidecars and review-plan CLI, related tests, synthetic study and reference/planning documents. Exclude root npm cache and generated guide artifacts from staging noise. The Namak lab remains planning-only and untested.
- Changed files: pending source under src/engine, tools, tests, package script, project fixture/study/lab JSON and shared instructions/docs; .gitignore and this history entry.
- Reason: preserve reviewed local engine work and its previously unpublished continuity commit without mixing in caches, renders, footage or generated guides.
- Verification: npm run validate passed (22 tests, one real-media-fixture test skipped); six projects validated. A frame-30 synthetic motion-study still was rendered and inspected. Full-speed/audio/device and deferred lab testing were not performed.
- Rollback: revert this checkpoint commit on a feature branch; retain the existing published history. Ignored caches/artifacts remain on disk.

## 2026-11-09 — Preserve shared text design foundation

- Behavior: preserve optional prepared fonts, exact mixed-script text runs, timed overlay lanes and safe areas, image scenes, flat backgrounds, and the bounded parsed-project diff command.
- Changed files: project composition, schema, timeline, scene registry and review planner; font/overlay/text/diff modules; video CLI/options; package and lockfile; focused regression tests, text contract and asset-free specimen.
- Reason: preserve the reusable engine slice separately from private Blame footage, project-specific design records and unrelated ongoing guidance. @remotion/fonts remains pinned to the renderer version 4.0.529.
- Verification: frozen offline pnpm install; npm run validate passed lint, TypeScript, seven source fixtures and 30 tests (one real-media test skipped). Rendered and inspected square specimen frame 225 with Hindi and English text. Playback, audio, phone, private footage and other canvas layouts were not checked in this checkpoint.
- Rollback: revert this commit on the feature branch to restore the previous scene-layout checkpoint, keeping the existing PR and original worktree intact.
