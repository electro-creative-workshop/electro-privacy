# Clorox OneTrust "Your Privacy Choices" Integration

This code is to simplify the integration of the second OneTrust modal into WordPress and NextJS sites. It is published as an npm package to **NPM** under the scope `@electro-creative-workshop/electro-privacy`.

## Google Tag Manager Consent Gating (React/Next.js)

This package now provides a reusable React component for gating Google Tag Manager (GTM) and Google Analytics (GA4) behind OneTrust performance consent.

**Component:** `GtmConsentGate`

**Location:** `@electro-creative-workshop/electro-privacy/src/js/gtm-consent-gate.js`

### Usage Example (Next.js/React)


1. Import the component and provide your GTM ID, GA4 measurement IDs, and the GTM script component. You can pass these directly in code, or use environment variables (recommended for production):

**A. Directly in code:**

        ```jsx
        import { GtmConsentGate } from '@electro-creative-workshop/electro-privacy/src/js/gtm-consent-gate';
        import { GoogleTagManager } from '@next/third-parties/google';

        <GtmConsentGate
            gtmId="GTM-XXXXXXX"
            gaMeasurementIds={["G-YYYYYYYY"]}
            GoogleTagManager={GoogleTagManager}
        />
        ```

**B. Using environment variables (Next.js example):**

        ```jsx
        import { GtmConsentGate } from '@electro-creative-workshop/electro-privacy/src/js/gtm-consent-gate';
        import { GoogleTagManager } from '@next/third-parties/google';

        // .env.local:
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

2. Place the component in your layout or page where you would normally load GTM.

3. The component will only render GTM if the user has granted OneTrust performance consent, and will fully remove/disable GTM and GA4 if consent is revoked.

**Props:**
- `gtmId` (string, required): Your GTM container ID
- `gaMeasurementIds` (array, optional): GA4 measurement IDs to hard-disable when consent is absent
- `GoogleTagManager` (React component, required): The GTM script/component to render
- `performanceCode` (string, optional): OneTrust performance consent code (default: 'C0002')

See `test/gtm-consent-gate.test.js` for usage and test examples.

## Adding the dependency

There are two options.

1. **Legacy GitHub:** Pull from git directly. Add a line to your `package.json`:

    ```json
    "electro-privacy": "github:electro-creative-workshop/electro-privacy#semver:^x.x.x"
    ```

    Replace `x.x.x` with the exact version desired. To update the version, edit `package.json` by hand.

    Load required JS & CSS from this package:
    - In `main.js`: `import 'electro-privacy'`
    - In your main CSS file: `@import '../../../node_modules/electro-privacy/dist/electro-privacy.css';`

2. **npm (GitHub Packages):** Install the package from the GitHub npm registry. This gives you the published version and standard npm updates.
    ```bash
    npm install @electro-creative-workshop/electro-privacy
    ```
    You must be logged in to GitHub Packages (see below) and have access to the `@electro-creative-workshop` scope.

change your import from:

`import('electro-privacy').catch(err => {....`

to

```jsx
'use client';
import { useEffect } from 'react';

export default function ElectroPrivacyLoader() {
    useEffect(() => {
        // Dynamically import electro-privacy only on the client
        import('@electro-creative-workshop/electro-privacy');
    }, []);
    // This component doesn't render anything visible
    return null;
}
```

You will probably need to reimport your css like so, but sites may vary. Be sure to do an `npm run build` to troubleshoot. Note: this module no longer needs Sass: it is native CSS.

`@import '@electro-creative-workshop/electro-privacy/dist/electro-privacy.css';`

You may have to add a file in `types` called `electro-privacy.d.ts` that declares the module:

```jsx
declare module 'electro-privacy';
declare module '@electro-creative-workshop/electro-privacy';
```

In order to use Github's repo, you must generate a token that has read:packages in scope
[New Token](https://github.com/settings/tokens/new)
Then run the following command in the repository. You will be prompted for your
GitHub username, and a password, which is the token's value.

```bash
npm login --scope=@electro-creative-workshop --auth-type=legacy --registry=https://npm.pkg.github.com
```

On Vercel, you need to set up a `NPM_RC` environment variable like so:

    registry=https://registry.npmjs.org
    //npm.pkg.github.com/:\_authToken={your read-only token here}
    @electro-creative-workshop:registry=https://npm.pkg.github.com/

For more information, see [Using Private Dependendies with Vercel](https://vercel.com/guides/using-private-dependencies-with-vercel)

## WordPress Sites

1. Add this package as a project dependency in `package.json`

2. Add to the footer near the "Cookie Settings" button:

    - `<button id="do-not-share">Your Privacy Choices</button>`
    - Add the "opt out" icon here next to the text: https://oag.ca.gov/privacy/ccpa/icons-download

3. In your footer styles (e.g. footer.css or footer.scss), add the `#do-not-share` to the `#ot-sdk-btn` rule to style "Your Privacy Choices" button the same way as "Cookie Settings". For example:

    ```
    #ot-sdk-btn, #do-not-share {
     margin-bottom: 1em;
     padding: 0 !important;
     font-size: 1em !important;
     color: $color-white !important;
     border: none !important;
    }
    ```

## NextJS sites:

### Your NextJS site may differ slightly, but this is the general flavor of the changes

1. Add this package as a project dependency in `package.json`

2. in `src/pages/\_app.js`

    - `import { useEffect } from 'react'`
    - in `export default function App({ Component, pageProps }) {` or something similar, add: - `useEffect(() => { import('electro-privacy'); }, [])`

3. in your global styles (e.g. `src/styles/global.css`)

    - `@import '../../node_modules/electro-privacy/dist/electro-privacy.css';`

4. Add near the "Cookie Settings" button:

```
    <button id="do-not-share">
```

5. Add `#do-not-share` to the existing `#ot-sdk-btn` rule to style the "Do Not Share..." text:

```
#ot-sdk-btn,
#do-not-share {
  background: none !important;
  border: none !important;
  color: #133d8d !important;
```

## Token Configuration

The OneTrust tokens are hardcoded in the module. The module automatically uses the appropriate token (production or staging) based on the environment detection. No configuration is required.

## UAT Values

The current production version sends entries to the live OneTrust collection point by default. If you need to support UAT, set this variable before importing electro-privacy:

`window.electroPrivacyStaging = true;`

This will change the following values to the non-production values:

- url
- token (hardcoded staging token)
- ID

Alternatively, the module automatically detects non-production environments based on the hostname (e.g., `vercel.app`, `staging`, `dev`, `qa`, `local`, `lndo.site`, `pantheonsite`).

## Debug logging

To log the API URL and environment (production vs staging) to the browser console when submitting, set this before loading electro-privacy:

`window.electroPrivacyDebug = true;`

The request body (email, token) is never logged to avoid PII and token leakage. Debug logging is off by default.

## QA Criteria

- Run `window.electroPrivacyVersion` in the console to ensure the latest version `1.x.x` shows.
- Test endpoint submissions to ensure OneTrust is sending through the submitted email address.
- Log in to the OneTrust testing portal to ensure that your submission is received.
- https://uat.onetrust.com/consent/data-subjects
- Ensure that your test does not show on the production OneTrust site unless you are on production.
- Ensure that the “Cookie Settings” link properly loads the OneTrust category modal.
- Once this has gone live, please check https://app.onetrust.com/consent/data-subjects

## Language Support

The default implementation supports English & Spanish based on the lang attribute in the html tag:

    <html lang="es-US">

Other languages will be supported as needed, but the using site will need to load the appropriate strings into a global array used by electro-privacy:

    /**
    * Add language support to electro-privacy module
    *   This code needs to be executed before importing
        electro-privacy
    */

    window.ElectroPrivacyLanguageMap = {
    'zz-US': require('../../..
      /node_modules/electro-privacy/dist/lang/zz-US.json'),
    };

**Note:** This needs to be set up before electro-privacy is included by the client. The mapping key must match the `lang` value on the site's `<html>` tag.

## Publishing a new version

This repo checks in `dist/`, so release tags must include the exact generated artifacts.

**What’s the difference between a tag and a published version?**

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
