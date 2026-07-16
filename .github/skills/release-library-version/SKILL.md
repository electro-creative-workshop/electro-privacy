---
name: release-library-version
description: 'Release and publish a new @electro-creative-workshop/electro-privacy version to GitHub Packages. Use when updating CHANGELOG.md, bumping package.json, creating a git tag, pushing tags, and running npm publish.'
argument-hint: 'Target version or bump type (for example: 1.6.4, patch, minor, major)'
user-invocable: true
---

# Release Library Version for electro-privacy

Use this skill when you need to publish a new version of `@electro-creative-workshop/electro-privacy` to GitHub Packages.

## Inputs To Collect First

- Target version or bump type (`patch`, `minor`, `major`, or exact `x.y.z`).
- Changelog summary for this release.

If any release step is unclear, ask the user before proceeding.

## Project Context

- Package name: `@electro-creative-workshop/electro-privacy`
- Default release branch: `main`
- Build command: `npm run build`
- Test command: `npm test`
- Publish registry: `https://npm.pkg.github.com`
- Existing repo tags use `v` prefix (for example: `v1.6.3`).

## Release Procedure

1. Confirm release intent and target.

- Ask for exact version or bump type if not provided.
- Confirm release should be made from `main`.

2. Validate repository state.

```bash
git status --short
git branch --show-current
```

- If the current branch is not `main`, stop and ask whether to continue on the current branch or switch to `main`.
- If the working tree is dirty, stop and ask how to proceed.

3. Update changelog.

- Open `CHANGELOG.md`.
- Add a new heading for the target version and summarize release changes as bullet points.
- Preserve the existing changelog style.

4. Bump version without creating commit/tag yet.

```bash
# Option A: bump type
npm version minor --no-git-tag-version

# Option B: exact version
npm version 1.6.4 --no-git-tag-version
```

- This updates `package.json` (and `package-lock.json` if present) first so builds embed the target version.

5. Build and test using the bumped version.

```bash
npm run build
npm test
```

- Fix failures before continuing.

6. Rebuild immediately before commit and stage release artifacts (including `dist/`).

```bash
npm run build
git add CHANGELOG.md package.json package-lock.json dist/

# If package-lock.json does not exist in this repo, omit it from git add.
```

- This extra build step ensures `dist/` in git matches the exact generated output at release time.

7. Create the release commit (without tagging yet).

```bash
git commit --no-verify -m "chore(release): 1.6.4"

# Use --no-verify for release commits in this repo because commit hooks may reformat
# generated bundle files and cause release/tag drift. Step 5 already ran build/test gates.
```

8. Verify release commit is build-clean before tagging.

```bash
npm run build
git status --short

# Optional verification before tagging
git show --stat --oneline -1
```

- `git status --short` must be clean. If `dist/` changed, stop and fix before tagging.

9. Create and verify tag.

```bash
git tag v1.6.4

git tag --list "v1.6.4"
```

- Ensure `dist/` is included in the release commit so legacy consumers and tags match published artifacts.

10. Push commit and tags.

```bash
git push origin main
git push origin --tags
```

11. Ensure GitHub Packages auth is configured.

- Confirm a GitHub token exists with write:packages scope.
- Confirm `~/.npmrc` includes:

```text
//npm.pkg.github.com/:_authToken={your write-packages token here}
@electro-creative-workshop:registry=https://npm.pkg.github.com/
```

12. Publish from repository root.

```bash
npm publish
```

- Ask for final confirmation immediately before `npm publish`.
- `prepublishOnly` runs `npm run build`; this should produce no diff if release ordering is correct.

13. Verify published version.

```bash
npm view @electro-creative-workshop/electro-privacy version --registry=https://npm.pkg.github.com/
```

- Confirm the reported version matches the target release.

14. Post-publish sanity check.

```bash
git status --short
```

- Working tree should be clean. If `dist/` changed, stop and correct the release ordering notes/process before the next release.

## Notes

- This workflow is based on the publishing section in `README.md`.
- If publish fails because of auth or permissions, resolve token/scope issues and retry.
