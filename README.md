# Clorox OneTrust "Your Privacy Choices" Integration

This package simplifies integration of the second OneTrust modal for WordPress and Next.js sites.
Published package: **@electro-creative-workshop/electro-privacy**.

---

## What this package provides

- OneTrust "Your Privacy Choices" integration support
- React/Next.js GTM + GA4 consent gating component export
- CSS for the privacy choices UI
- Environment-aware behavior for production vs staging
- Optional debug logging

---

## Installation

### Option 1: npm (recommended)

Install from GitHub Packages:

```bash
npm install @electro-creative-workshop/electro-privacy
```

You must have GitHub Packages access for the **@electro-creative-workshop** scope.

### Option 2: Install from Git branch (testing)

Use this to test the Firefox branch:

```bash
npm install github:electro-creative-workshop/electro-privacy#firefox
```

### Option 3: Legacy GitHub dependency format

If needed, you can pin by branch/tag/semver in package.json:

```json
"dependencies": {
  "@electro-creative-workshop/electro-privacy": "github:electro-creative-workshop/electro-privacy#semver:^x.x.x"
}
```

---

## CSS import

Import package CSS in your global stylesheet:

```css
@import '@electro-creative-workshop/electro-privacy/dist/electro-privacy.css';
```

Note: this module no longer requires Sass.

---

## Google Tag Manager Consent Gating (React/Next.js)

This package exports `GtmConsentGate` for gating Google Tag Manager (GTM) and Google Analytics (GA4) behind OneTrust performance consent.

- Component name: **GtmConsentGate**
- Package import: **@electro-creative-workshop/electro-privacy/gtm-consent-gate**
- Architecture: **separate from ot-dns runtime (not auto-executed)**

### Migrating from direct GoogleTagManager usage

If your site currently uses:

```jsx
<GoogleTagManager gtmId="GTM-XXXXXXX" />
```

Replace with:

```jsx
<GtmConsentGate
  gtmId="GTM-XXXXXXX"
  gaMeasurementIds={["G-YYYYYYYY"]} // optional
  GoogleTagManager={GoogleTagManager}
/>
```

This ensures GTM and GA4 only run when performance consent is granted, and are disabled/removed if consent is revoked.

### Example A: direct values

```jsx
import { GtmConsentGate } from '@electro-creative-workshop/electro-privacy/gtm-consent-gate';
import { GoogleTagManager } from '@next/third-parties/google';

<GtmConsentGate
  gtmId="GTM-XXXXXXX"
  gaMeasurementIds={["G-YYYYYYYY"]}
  GoogleTagManager={GoogleTagManager}
/>
```

### Example B: environment variables (Next.js)

```jsx
import { GtmConsentGate } from '@electro-creative-workshop/electro-privacy/gtm-consent-gate';
import { GoogleTagManager } from '@next/third-parties/google';

// .env.local
// NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
// NEXT_PUBLIC_GA4_IDS=G-YYYYYYYY,G-ZZZZZZZZ

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const gaMeasurementIds = process.env.NEXT_PUBLIC_GA4_IDS
  ? process.env.NEXT_PUBLIC_GA4_IDS.split(',')
  : [];

<GtmConsentGate
  gtmId={gtmId}
  gaMeasurementIds={gaMeasurementIds}
  GoogleTagManager={GoogleTagManager}
/>
```

### Props

- **gtmId** (string, required): GTM container ID
- **gaMeasurementIds** (string[], optional): GA4 IDs to hard-disable when consent is absent
- **GoogleTagManager** (React component, required): GTM component to render
- **performanceCode** (string, optional): OneTrust performance consent code, default is C0002

---

## Next.js App Router SSR note (important)

If you import **GtmConsentGate** directly in a server component (example: app layout), production build can fail during page data collection with **window is not defined**.

Use a client-only wrapper and dynamic import with SSR disabled.

### 1) Create a client wrapper

```tsx
'use client';

import { GtmConsentGate } from '@electro-creative-workshop/electro-privacy/gtm-consent-gate';
import { GoogleTagManager } from '@next/third-parties/google';

type GtmConsentGateClientProps = {
  gtmId: string;
  gaMeasurementIds?: string[];
};

export default function GtmConsentGateClient({
  gtmId,
  gaMeasurementIds,
}: Readonly<GtmConsentGateClientProps>) {
  return (
    <GtmConsentGate
      gtmId={gtmId}
      gaMeasurementIds={gaMeasurementIds}
      GoogleTagManager={GoogleTagManager}
    />
  );
}
```

### 2) Load wrapper from server layout with SSR disabled

```tsx
import dynamic from 'next/dynamic';

const GtmConsentGateClient = dynamic(() => import('./gtm-consent-gate-client'), {
  ssr: false,
});

// ...
<GtmConsentGateClient
  gtmId="GTM-XXXXXXX"
  gaMeasurementIds={['G-YYYYYYYY']}
/>
```

---

## Dynamic client import for privacy module (if needed)

If you need to load the package only in browser runtime:

```jsx
'use client';
import { useEffect } from 'react';

export default function ElectroPrivacyLoader() {
  useEffect(() => {
    import('@electro-creative-workshop/electro-privacy');
  }, []);
  return null;
}
```

Optional type declarations if your project needs them:

```ts
declare module 'electro-privacy';
declare module '@electro-creative-workshop/electro-privacy';
```

---

## GitHub Packages authentication

Create a personal access token with **read:packages**.

Then login:

```bash
npm login --scope=@electro-creative-workshop --auth-type=legacy --registry=https://npm.pkg.github.com
```

### Vercel configuration

Set **NPM_RC** environment variable with:

```text
registry=https://registry.npmjs.org
//npm.pkg.github.com/:_authToken={your read-only token here}
@electro-creative-workshop:registry=https://npm.pkg.github.com/
```

Reference: Using private dependencies with Vercel.

---

## WordPress integration

1. Add package dependency.
2. Add button near Cookie Settings:

```html
<button id="do-not-share">Your Privacy Choices</button>
```

3. Add California opt-out icon next to text:
https://oag.ca.gov/privacy/ccpa/icons-download
4. Style button similarly to Cookie Settings:

```css
#ot-sdk-btn,
#do-not-share {
  margin-bottom: 1em;
  padding: 0 !important;
  font-size: 1em !important;
  border: none !important;
}
```

---

## Next.js Pages Router style integration (legacy pattern)

1. Add package dependency.
2. In app bootstrap file, load package on client:

```jsx
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import('@electro-creative-workshop/electro-privacy');
  }, []);

  return <Component {...pageProps} />;
}
```

3. Import package CSS globally.
4. Add the privacy choices button markup.
5. Add matching styles for #do-not-share.

---

## Token configuration

OneTrust values are built into the module.
Module automatically selects production or staging values based on environment detection.

---

## UAT values

To force staging behavior before importing the package:

```js
window.electroPrivacyStaging = true;
```

This switches URL, token, and ID to non-production values.

The module also auto-detects many non-production host patterns (such as staging/dev/qa/local style hostnames).

---

## Debug logging

Enable debug logs before loading package:

```js
window.electroPrivacyDebug = true;
```

Debug logs include API URL and environment only.
Request body data (email/token) is intentionally not logged.

---

## QA checklist

- Confirm loaded version in browser console:
  - window.electroPrivacyVersion
- Verify submissions are received in OneTrust test portal:
  - https://uat.onetrust.com/consent/data-subjects
- Ensure test submissions do not appear in production unless running production.
- Verify Cookie Settings still opens OneTrust category modal.
- After go-live, validate production portal:
  - https://app.onetrust.com/consent/data-subjects

---

## Language support

Default behavior supports English and Spanish using html lang (example: es-US).

For additional languages, define mapping before importing package:

```js
window.ElectroPrivacyLanguageMap = {
  'zz-US': require('../../../node_modules/electro-privacy/dist/lang/zz-US.json'),
};
```

Mapping key must match the html lang attribute.

---

## Publishing a new version

This repo checks in `dist/`, so release tags must include the exact generated artifacts.

1. Ensure build passes:

```bash
npm run build
```

2. Commit changes.
3. Bump version and create tag:

```bash
npm version patch
# or npm version minor
# or npm version major
```

4. Push commit and tags:

```bash
git push --follow-tags
```

5. Publish:

```bash
npm publish
```

### Package publishing auth (one-time setup)

Create token with **write:packages**, then configure user-level npm auth:

- **Git tag** - A label in your Git repo that points at one specific commit (for example `v1.0.5`).
- **Published version** - The package uploaded to GitHub Packages by `npm publish`.

Use this release flow from the repository root:

1. Confirm branch and clean working tree.

```bash
git branch --show-current
git status --short
```

2. Update `CHANGELOG.md` for the new version.

3. Bump version without auto commit/tag.

```bash
npm version patch --no-git-tag-version
# or: npm version minor --no-git-tag-version
# or: npm version major --no-git-tag-version
```

4. Run validation.

```bash
npm run build
npm test
```

5. Rebuild, then stage changelog/version/dist artifacts.

```bash
npm run build
git add CHANGELOG.md package.json package-lock.json dist/
```

6. Create release commit first (do not tag yet).

```bash
git commit --no-verify -m "chore(release): 1.2.3"
```

7. Verify the release commit is build-clean before tagging.

```bash
npm run build
git status --short
```

If `git status --short` shows changes (especially in `dist/`), stop and fix before tagging.

8. Create and push release refs.

```bash
git tag v1.2.3
git push origin main
git push origin --tags
```

9. Publish to GitHub Packages.

```bash
npm publish
npm view @electro-creative-workshop/electro-privacy version --registry=https://npm.pkg.github.com/
git status --short
```

One-time auth setup:

- Generate a GitHub token with `write:packages` scope: [Token](https://github.com/settings/tokens/new)
- Add this to `~/.npmrc`:

```text
//npm.pkg.github.com/:_authToken={your write-packages token here}
@electro-creative-workshop:registry=https://npm.pkg.github.com/
```
