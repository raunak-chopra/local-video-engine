
## 2026-10-22 — Preserve motion direction and review-plan source

- Behavior: preserve the existing optional graphic entrance/exit controls, direction sidecars and review-plan CLI, related tests, synthetic study and reference/planning documents. Exclude root npm cache and generated guide artifacts from staging noise. The Namak lab remains planning-only and untested.
- Changed files: pending source under src/engine, tools, tests, package script, project fixture/study/lab JSON and shared instructions/docs; .gitignore and this history entry.
- Reason: preserve reviewed local engine work and its previously unpublished continuity commit without mixing in caches, renders, footage or generated guides.
- Verification: npm run validate passed (22 tests, one real-media-fixture test skipped); six projects validated. A frame-30 synthetic motion-study still was rendered and inspected. Full-speed/audio/device and deferred lab testing were not performed.
- Rollback: revert this checkpoint commit on a feature branch; retain the existing published history. Ignored caches/artifacts remain on disk.
