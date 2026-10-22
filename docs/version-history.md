
## 2026-10-22 — Preserve motion direction and review-plan source

- Behavior: preserve the existing optional graphic entrance/exit controls, direction sidecars and review-plan CLI, related tests, synthetic study and reference/planning documents. Exclude root npm cache and generated guide artifacts from staging noise. The Namak lab remains planning-only and untested.
- Changed files: pending source under src/engine, tools, tests, package script, project fixture/study/lab JSON and shared instructions/docs; .gitignore and this history entry.
- Reason: preserve reviewed local engine work and its previously unpublished continuity commit without mixing in caches, renders, footage or generated guides.
- Verification: npm run validate passed (22 tests, one real-media-fixture test skipped); six projects validated. A frame-30 synthetic motion-study still was rendered and inspected. Full-speed/audio/device and deferred lab testing were not performed.
- Rollback: revert this checkpoint commit on a feature branch; retain the existing published history. Ignored caches/artifacts remain on disk.

## 2026-10-22 — Prepare main-history integration

- Behavior: adopt the reviewed newer engine snapshot on an integration branch rooted in existing main; this changes no engine behavior beyond checkpoint 65d6390.
- Changed files: the integration snapshot replaces the older baseline tree; this note records why.
- Reason: the two published roots have unrelated histories, so GitHub cannot create a normal PR between them.
- Verification: the snapshot tree matched 65d6390 exactly before this note; that source passed current validation and synthetic still review. Main and the original engine branch remain preserved; no merge or history rewrite is performed.
- Rollback: close this draft PR or revert the snapshot commit; retain both original published histories.
- Import limitation: legacy engine/vendor Markdown and a few existing helper files retain whitespace warnings from the already-published snapshot. These were recorded rather than bulk-reformatting vendored material; no clean-whitespace claim is made for the full imported tree.
