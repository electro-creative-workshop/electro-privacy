---
name: vitest-testing-workflow
description: 'Create and validate Vitest tests for electro-privacy. Use when adding or updating unit tests, running test commands, checking jsdom behavior, and verifying lint/format expectations in this JavaScript package.'
argument-hint: 'Describe the module or behavior to test, e.g. "add tests for privacy-request"'
user-invocable: true
---

# Vitest Testing Workflow for electro-privacy

## Purpose

Use this workflow to add or update tests in this repository while keeping test changes fast, deterministic, and aligned with current project conventions.

## Project Context

- Language: JavaScript and TypeScript/React (ES modules in `src/js/`)
- Test runner: Vitest with `jsdom`
- Test location: `test/` with JavaScript and TypeScript/React test files
- Main commands:
  - `npm test`
  - `npm run test:watch`
  - `npm test -- -t "test name"`
  - `npm test -- --coverage`
  - `npm run type-check`

## When to Use

- Adding tests for new helper modules in `src/js/`
- Expanding coverage for existing runtime logic
- Verifying DOM behavior with lightweight jsdom tests
- Refactoring code into pure helpers and adding tests for them

## Workflow (5 Steps)

1. **Create or Update Test File**

- Add tests in `test/` using `*.test.js` for JavaScript modules and
  `*.test.tsx` for TypeScript/React modules.
- Prefer explicit imports from Vitest:
  - `import { describe, test, expect } from 'vitest';`
- Match existing style in this repository (`test()` is preferred).

2. **Run Focused Tests First**
   - Run targeted tests while iterating:
     - `npm test -- -t "test name"`
   - Keep tests deterministic and avoid dependence on timing-sensitive global state.

3. **Run Full Test Suite**
   - Run all tests:
     - `npm test`
   - Fix all failing tests before moving on.

4. **Lint and Quality Check**
   - Lint changed files or whole repo:
     - `npx eslint .`
   - Resolve warnings/errors introduced by new test code.
   - Run the TypeScript gate when changing TypeScript or React source/tests:
     - `npm run type-check`

5. **Format**
   - Format repository files:
     - `npm run prettier`
   - Re-run tests if formatting changed executable code.

## Test Design Guidelines

- Prefer testing pure helper modules first (for example: config, request building, UI state helpers).
- For `GtmConsentGate`, use `test/gtm-consent-gate.test.tsx` for consent state,
  GA4 disable flags, and GTM teardown behavior.
- For DOM behavior, keep tests lightweight and only mock browser APIs when needed.
- Validate meaningful behavior and edge cases, not only happy paths.
- Do not log PII (for example email addresses or request payloads) in tests or source.

## Completion Checklist

- New or updated tests are in `test/`.
- `npm test` passes.
- Any lint issues introduced by the change are fixed.
- Formatting has been applied.
- Coverage for touched modules is improved or maintained.
- Formatting has been applied.
- Coverage for touched modules is improved or maintained.
