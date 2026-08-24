---
name: npm-updates
description: 'Update npm dependencies for electro-privacy using npm update and npm-check-updates, validate with build/tests/lint, and prepare a chore commit summary with dependency deltas.'
argument-hint: 'Optional: package names to prioritize (space separated)'
user-invocable: true
---

# NPM Updates for electro-privacy

Use this skill when the user asks to update packages, bump dependencies, or run maintenance dependency upgrades for this repository.

## Project Context

- Package name: `@electro-creative-workshop/electro-privacy`
- Build command: `npm run build`
- Test command: `npm test`

## When To Use

- The user asks for npm dependency updates.
- The user asks to run `ncu`.
- The user asks for a routine package maintenance pass.

## Procedure

1. Validate repository state before changing dependencies:
   - Run `git status --short` and `git branch --show-current`.
   - If the current branch is not `main`, stop and ask the user whether to continue on the current branch or switch.
   - If the working tree is dirty, ask the user how to proceed.
2. Run `npm update`.
3. Run `npx npm-check-updates --jsonUpgraded` to see pending upgrades.
4. If this returns no packages, stop and report that there are no upgrades to apply.
5. Upgrade allowed packages in one batch with `npx npm-check-updates -u <package-name> <package-name> ...`.
6. Run `npm install` to refresh lockfile and resolve dependencies.
7. Validate changes:
   - Run `npm run build`.
   - Run `npm test`.
8. If validation passes, stage `package.json`, `package-lock.json` (if present), and any source/test files required to satisfy updated tool rules.
9. In the commit body, include each dependency version change from the `ncu -u` output and briefly note any required source/test fixes.
10. Ask the user for permission to do a commit and push. Do not include a
    `Co-authored-by` trailer in commits.

## Validation Notes

- ESLint 10 updates are eligible for normal dependency maintenance. Exclude a package only when peer dependency compatibility or validation identifies a specific issue.
- If tests or build fail after a package bump, isolate the failing package and retry with that package excluded.
- Keep peer dependency compatibility as the source of truth over raw upgrade availability.
