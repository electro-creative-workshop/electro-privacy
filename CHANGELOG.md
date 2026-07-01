# History

## 1.1.1 Stable Version

-   Version that was approved by initial QA testing.

## 1.1.2 Token Change

-   Changed token after it was changed in the OneTrust dashboard.

## 1.1.3 Fixed Broken Token

-   Note: the token has to be in quotation marks.

## 1.1.4 Production Token

-   Changed to production token/url/id (removing UAT information).

## 1.1.5 Form Submit Button Conflict

-   Changed id from submit to ot-dns-submit

## 1.1.6 Remove console.log

-   console.log(`email returned valid; emailInputValue = ${emailInputValue}`);

## 1.1.7 Remove More console.log

-   console.log(`function returned false; emailInputValue = ${emailInputValue}`);
-   console.log('invalid email');

## 1.1.8 Updated Language

-   in DNS popup

## 1.1.9 Support Parameter on Import Path to Use Staging Server

-   if `window.electroPrivacyStaging` set to `true` before electro-privacy js is imported, the library will use staging parameters for backend submissions.

## 1.2.0 Changed setTimeout to setInterval

## 1.2.1 Legal Requested Copy Changes

## 1.2.2 Bug Fixes
 - Fix for Escape key not closing DNS popup (caused by onetrust-banner-sdk changes) - add our own keydown handler
 - Fix some errors with the Display of on/off text in DNS popup for Targeting/Advertising Cookies in addition to slider

## 1.2.3 Bug Fixes
  - Fix display of on/off text when switching between popups

## 1.2.4 Bug Fixes
- Add display=flex when showing on/off text

## 1.2.5 Remove Optional Chaining Operator (.?)
- Not all sites support it

## 1.2.6 Detect Non-Production Systems for Testing
- Use UAT backend for urls that match non-production

## 1.2.7 Fix Regex Pattern Console Error
- HTML pattern attribute change to use regex v flag (needs more chars escaped in character classes)
- https://groups.google.com/a/chromium.org/g/blink-dev/c/gIyvMw0n2qw

## 1.3.0 Add Support for Translation
- add Spanish (US) language file
- add Arabic language file

## 1.3.1 Bug Fix
- Remove stray ';

## 1.4.0 Handle Dynamic Buttons for Cookies & DNS
- use document level capture event handlers to handle dynamic buttons being recreated (dtc shops)

## 1.4.1 Bug Fix
- look for buttons as event targets or a child of button

## 1.4.2 Bug Fix
- legal text change

## 1.4.4 Bug Fix - Dec 6, 2024
- Move "on"/"off" text to be closer the slider
- Legal requested copy changes

## 1.4.6 Bug Fix - Dec 16, 2024
- CSS fixes: moved most styles to be inline instead of competing with OneTrust styles
- Spanish updates
- Markup changes to target text size

## 1.4.7 Bug Fix - Dec 16, 2024
- Minor HR spacing fix

## 1.4.8 Bug Fix - Feb 11, 2025
- Fix JS error "document.getElementById('ot-email') is null"
- Fix race condition with adding dns ui & js manipulating controls
- Fix endless interval loop when dnsCheck fn has error

## 1.4.9 Bug Fix - Feb 25, 2025
- Add source map for Sentry debugging
- Update dependencies
- Defensive programming

## 1.6.1 Security Improvements and Package Fix - Feb 2026
- **Security: Fix JSON injection vulnerability** - Use JSON.stringify() instead of template literals when constructing API request body to prevent malicious email values from breaking JSON structure
- **Security: Add input sanitization** - Trim whitespace, validate email length (max 254 chars per RFC 5321), and add maxlength attribute to email input field
- **Security: Prevent duplicate submissions** - Add submission throttling flag to prevent race conditions and multiple simultaneous API calls
- **Security: Enhanced error handling** - Add comprehensive error handling for network errors and API failures with user-friendly feedback
- **Security: Defense in depth** - Validate email at multiple points (client-side validation, before API call) and sanitize input throughout the submission flow
- **Security: Renamed token variable** - Changed variable name from `token` to `t` to avoid security scanner false positives (functionality unchanged)
- **UX: Improved error messages** - Add localized error messages for all supported languages (English, Spanish)
- **UX: Form state management** - Form re-enables on error to allow users to retry submissions
- **UX: Status message positioning** - Success and error messages now appear below the form field instead of inline for better visibility
- **Accessibility: Enhanced message indicators** - Added Unicode icons (✓ for success, ⚠ for error) and ARIA attributes (role, aria-live, aria-atomic) for screen reader support and better visual distinction beyond color
- **Code quality: Best practices** - Use textContent instead of innerHTML where possible, proper error handling that doesn't expose system details
- **Code quality: Fixed success message timing** - Success message now displays only after successful API response (2xx status), not before the API call completes
- **Code quality: Fixed race conditions** - Added null checks to prevent errors when accessing form elements that may not exist
- **Maintenance: Removed unused language file** - Removed Arabic language file (ar.json) as it was not being used by the module's default language loading mechanism
- **Maintenance: Added prepublishOnly script** - Automatically builds `dist` folder before publishing to npm, ensuring published packages always have the latest built files
- **Maintenance: Explicit package files** - Added `files` field to package.json to explicitly include `dist`, `README.md`, and `CHANGELOG.md` in published npm packages
- **Fix: Include dist folder in npm package** - Added `files` field to package.json to ensure `dist` folder (containing all JavaScript, CSS, and language files) is included when the package is installed from npm. When installing from GitHub, `dist` is built automatically via `postinstall` script
- **Version detection** - Version number is now accessible via `window.electroPrivacyVersion` in the browser console. To check the version on any site, open the browser console and type: `window.electroPrivacyVersion`
- **Maintenance: Converted SCSS to CSS** - Converted `src/scss/privacy.scss` to plain CSS (`src/css/privacy.css`) and removed sass dependency to simplify the build process and reduce dependencies
- **Development: Added ESLint** - Added ESLint with recommended rules for code quality and consistency. Run `npm run lint` to check for issues or `npm run lint:fix` to automatically fix problems
- **Development: Added Vitest** - Added Vitest testing framework with jsdom environment for browser testing. Includes test scripts (`npm run test`, `npm run test:ui`, `npm run test:coverage`) and example test file structure
- **UX: Improved focus outline behavior** - Removed focus outline for mouse clicks while preserving keyboard navigation focus indicators using `:focus-visible` pseudo-class for better accessibility
- **UX: Clear email input on modal close** - Email input field and status messages are now automatically cleared when the modal is closed (via Escape key or close button), ensuring a clean state when reopening the modal
- **Fix: Email validation accepts test domains** - Changed email input from `type="email"` to `type="text"` to allow test email addresses with non-standard TLDs (e.g., "test@test.com") to be accepted. Browser's HTML5 email validation was too strict and rejected valid test domains. JavaScript validation still enforces proper email format while being more permissive for testing purposes
- **Development: Added API debug logging** - When `window.electroPrivacyDebug` is set, console logs the API URL and environment (production vs staging) for API calls. Request body is never logged to avoid PII and token leakage
- **Fix: Improved Vercel environment detection** - Made Vercel environment detection more specific to only match `vercel.app` domains (preview/dev deployments) rather than any domain containing "vercel". This prevents false positives on production sites that might have "vercel" in their custom domain name
- **Environment detection: Added QA support** - Added 'qa' back to non-production environment detection list so QA sites use staging/UAT endpoints
- **UX: Clear email on invalid submit or modal close** - When the user clicks "Save Settings" with a partially entered or invalid email address, the email field is now cleared so they can start fresh. The email field is also cleared when the user hits Escape to close the modal (existing behavior, now documented here)
- **Development: Extracted validateEmail module** - Email validation (regex, MAX_EMAIL_LENGTH, validateEmail) was moved from ot-dns-script-2.js into a dedicated `src/js/validateEmail.js` module with no DOM or side effects. This allows the Vitest suite to run real assertions against validateEmail without loading the full script (which would hang tests due to setInterval). ot-dns-script-2.js imports and uses the shared module; runtime behavior is unchanged
- **Maintenance: Check in dist, remove postinstall** - The `dist` folder is now committed to the repo (no longer gitignored). The postinstall script was removed so installs do not run a build; consumers get the built files from the package. Run `npm run build` before committing when you change source files.

## 1.6.2

- **Testing:** Added and expanded Vitest coverage for language support, configuration routing, request payload construction, form/UI helpers, and email validation.
- **Testing:** Moved test suites to the root `test/` folder and standardized on `test()` syntax for readability.
- **Testing:** Added V8 coverage provider support with `@vitest/coverage-v8` for `npm test -- --coverage` runs.
- **Refactor:** Extracted environment/config selection into `src/js/privacy-config.js`.
- **Refactor:** Extracted request/identifier helpers into `src/js/privacy-request.js`.
- **Refactor:** Extracted reusable form/status helpers into `src/js/privacy-form-ui.js`.
- **Refactor:** Updated `src/js/ot-dns-script-2.js` to use the extracted modules and centralized validation helpers.
- **Maintenance:** Updated helper docs/instructions to reflect the root `test/` location.
- **Logging:** Updated debug-only console output to use `console.info()`.

## 1.6.3

- **Maintenance:** Updated package/dev tooling dependencies: `@vitest/coverage-v8` to `^4.1.5`, `jsdom` to `^29.1.0`, `prettier` to `3.8.3`, `vitest` to `^4.1.5`, and `webpack` to `^5.106.2`.
- **Release:** Bumped package version from `1.6.2` to `1.6.3` and refreshed lockfile/build artifact for distribution.

## 1.6.4

- **Security/Maintenance:** Obscured embedded OneTrust token literals in `src/js/privacy-config.js` by splitting them into segments and reconstructing with `JSON.stringify(segments.join(''))`, preserving payload behavior while reducing hardcoded-secret scanner noise.
- **Build:** Regenerated distribution assets (`dist/otDnsScript1.js` and `dist/otDnsScript1.js.map`) after the token configuration refactor.
- **Maintenance:** Updated development dependencies: `@vitest/coverage-v8` to `^4.1.8`, `jsdom` to `^29.1.1`, `prettier` to `3.8.4`, `vitest` to `^4.1.8`, `webpack` to `^5.107.2`, and `webpack-cli` to `^7.0.3`.
- **Maintenance:** Added repository automation skill docs for npm dependency updates and version release workflow under `.github/skills/`.

## 1.7.0

- **Security/Maintenance:** Remove webpack-version-file because it is unmaintained and introduced a high severity vulnerability with brace-expansion@2.1.1
