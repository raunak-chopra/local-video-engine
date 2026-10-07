# Version history

## 2026-10-07 — Preserve the video-engine baseline

- Behavior: record the existing 0.1.0 Remotion video engine in Git; keep local environment files out of source control. This is source preservation, not a rendered-video or commercial-release approval.
- Changed files: baseline README/instructions, package manifests and lockfile, TypeScript configuration, briefs, source, renderer/validation scripts, tests; added environment exclusions in `.gitignore` and this history file.
- Reason: the local and remote repositories had no commits, leaving the working source without a GitHub backup.
- Verification: `npm run check` passed TypeScript checking and all seven existing tests. Video rendering was not run in this Git preservation pass.
- Rollback: retain the initial source commit as the baseline; revert subsequent maintenance commits on a feature branch if needed. Remove the added environment-ignore rules only if a reviewed configuration policy replaces them; never commit actual secrets.
