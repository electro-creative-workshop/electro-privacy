# Copilot & AI Agent Instructions for electro-privacy

## Project Overview

- This package powers the OneTrust "Do Not Share" UX integration used across Electro web properties.
- It is published as the npm package `@electro-creative-workshop/electro-privacy`.
- The package ships browser JS and CSS from `dist/`.

## Architecture

- Source code lives under `src/`:
  - `src/js/` for runtime scripts and helper modules
  - `src/css/` for stylesheet source
  - `src/language/` for language JSON files
- Tests live in `test/`.
- Build output goes to `dist/`.
- Main runtime entry for consumers is `dist/otDnsScript1.js`.

## Developer Workflows

### Testing

- Test runner: Vitest with `jsdom` environment.
- Run all tests: `npm test`
- Watch mode: `npm run test:watch`
- Target a specific test name: `npm test -- -t "test name"`
- Write tests in `test/` using `*.test.js`.
- Prefer unit tests around pure helper modules first, then light DOM tests for UI behavior.
- Keep tests deterministic and fast; mock browser globals only when needed.

### Build

- Build JS bundles: `npm run build:webpack`
- Build CSS asset: `npm run build:css`
- Full build: `npm run build`
- `prepublishOnly` runs `npm run build`, so `dist/` is refreshed before publishing.

### Formatting and Linting

- Format codebase: `npm run prettier`
- ESLint config exists in `eslint.config.mjs`.
- If needed, lint manually with: `npx eslint .`

## Project Conventions

- Keep runtime behavior stable for consuming sites unless explicitly requested.
- Prefer extracting pure logic into small modules for testability (for example config, request building, UI state helpers).
- Reuse shared helpers instead of duplicating DOM state-management code.
- Keep browser compatibility in mind; avoid introducing syntax/features that may break older site environments.
- Preserve existing file style and naming patterns in this repo.
- Use concise, descriptive commit messages (conventional commits preferred).

## Safety and Integration Notes

- Never log PII (such as email addresses) or request payloads to console.
- Keep environment routing logic (production vs staging/UAT) consistent and tested.
- Validate/sanitize user input defensively before building request payloads.
- Ensure modal open/close flows reset form and status state predictably.

---

When introducing new patterns or workflows, update this file so future AI-assisted changes stay aligned with the repository.
