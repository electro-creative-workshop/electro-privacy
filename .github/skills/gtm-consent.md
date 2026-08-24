---
name: gtm-consent
description: 'Install and validate GtmConsentGate for a React or Next.js site that uses OneTrust and Google Tag Manager.'
argument-hint: 'Host framework, GTM container ID source, GA4 measurement IDs, and OneTrust analytics category'
user-invocable: true
---

# GTM Consent Integration

Use this guide when installing `GtmConsentGate` from
`@electro-creative-workshop/electro-privacy/gtm-consent-gate` in a React or
Next.js host site.

## Host Site Install Process

Use this section when the workspace contains the plugin and a host site:

- `electro-privacy`: the plugin and the only place for consent-gate behavior
  fixes.
- The host site: change only dependency, wrapper, layout, environment, and test
  wiring here; do not add consent logic here.

### Changes in electro-privacy

When the bug concerns GA4 activity after an opt-out, inspect and change:

- `src/js/gtm-consent-gate.tsx`: runtime consent behavior and GA4 disable flags.
- `test/gtm-consent-gate.test.tsx`: regression coverage for pending opt-out,
  saved opt-out, valid `G-` IDs, and GTM teardown.
- `README.md` and `.github/skills/gtm-consent.md`: public integration and
  implementation guidance.
- `dist/`: regenerate with the package build when publishing or when the
  consumer is testing a built package.

The consumer should not implement a second copy of this behavior. If a
consumer test demonstrates a missing behavior, fix the plugin first and add a
focused plugin regression test.

### Changes in the host site

For the current Next.js App Router integration, inspect or change:

- `package.json` and `package-lock.json`: use the intended published package or
  the `firefox` Git branch while developing.
- `src/app/components/gtm-consent-gate.tsx`: client-only wrapper using
  `dynamic(..., { ssr: false })` and `GoogleTagManager`.
- `src/app/layout.tsx`: read `NEXT_PUBLIC_GTM_ID`, provide all GA4 IDs, render
  the wrapper once, and keep OneTrust loading `beforeInteractive`.
- `src/app/layout.test.tsx`: verify the wrapper receives the GTM and GA4
  configuration.

The preferred production configuration is:

```text
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA4_IDS=G-XXXXXXXXXX
```

A hardcoded GA4 ID may be used temporarily for local or holiday-weekend
verification, but mark it with `FIXIT` and restore `NEXT_PUBLIC_GA4_IDS` before
release. Do not add an unguarded `GoogleTagManager` instance elsewhere in the
layout.

### Handoff prompt

When assigning this work, use wording like:

> In `electro-privacy`, fix and test the consent behavior in the plugin. In
> the host site, update only the dependency, client wrapper, root layout, public
> GA4/GTM configuration, and related tests. Do not implement consent logic in
> the host site. Validate pending opt-out, Save, reload, and re-grant behavior
> in Firefox.

## Why GA4 IDs are required

The GTM container ID identifies the container, not the Analytics destinations
inside it. Each GA4 Measurement ID identifies a running Analytics instance.
Pass every `G-` ID controlled by the container so the gate can set
`window['ga-disable-' + measurementId] = true` synchronously when analytics is
toggled off. This blocks post-opt-out hits from an instance that initialized on
the original page load, including a `user_engagement` hit during the Save flow.
The flag is also applied to an unsaved Preference Center opt-out; saved consent
is enforced again on the next load.

GA4 Measurement IDs are public browser configuration, not secrets. The gate
cannot disable an ID that is omitted. Strongly recommend using
`NEXT_PUBLIC_GA4_IDS` for host-site configuration so the gate does not rely on
late `script[src*="gtag/js"]` DOM discovery timing. A hardcoded ID is
acceptable only as a temporary local or test
measure and should be replaced before release.

## Required Host Configuration

1. Install `@electro-creative-workshop/electro-privacy` and the host site's GTM
   renderer. For Next.js, use `GoogleTagManager` from
   `@next/third-parties/google`.
2. Load OneTrust before the client-side gate. The gate reads the
   `OptanonConsent` cookie, `window.OptanonActiveGroups`, and the Preference
   Center element.
3. Render the gate exactly once in the root application shell. Remove any
   unguarded `GoogleTagManager` instances for the same container.
4. Provide the GTM container ID and every GA4 measurement ID controlled by that
  container. Strongly recommend providing them explicitly via
  `NEXT_PUBLIC_GA4_IDS` to avoid relying on late `script[src*="gtag/js"]` DOM
  discovery timing. Keep IDs in public environment variables only when they
  are safe to expose to the browser.
5. Confirm the OneTrust performance category. The default is `C0002`; pass
   `performanceCode` when the host uses another category.
6. Confirm the Preference Center contains
   `#ot-group-id-<category-code> input[type="checkbox"]`. Update the component
   before release if the deployed OneTrust markup differs.
7. Configure OneTrust/GTM tag exceptions for the same analytics category. The
   client gate handles immediate UI state and runtime teardown; tag exceptions
   enforce saved consent across all governed tags.

## Next.js App Router

`GtmConsentGate` is a client component. Put its import and render in a
`'use client'` wrapper, then render that wrapper once from the server layout.
The wrapper may statically import the gate, or it may use `dynamic` with
`{ ssr: false }`. The dynamic call must stay in the client wrapper, never in
the server `layout.tsx`.

```tsx
'use client';

import { GtmConsentGate } from '@electro-creative-workshop/electro-privacy/gtm-consent-gate';
import { GoogleTagManager } from '@next/third-parties/google';

export function ConsentGtm({ gtmId, gaMeasurementIds }: { gtmId: string; gaMeasurementIds: string[] }) {
  return <GtmConsentGate gtmId={gtmId} gaMeasurementIds={gaMeasurementIds} GoogleTagManager={GoogleTagManager} />;
}
```

### Dynamic client wrapper (supported)

```tsx
'use client';

import { GoogleTagManager } from '@next/third-parties/google';
import dynamic from 'next/dynamic';

const GtmConsentGate = dynamic(
  () => import('@electro-creative-workshop/electro-privacy/gtm-consent-gate').then((module) => module.GtmConsentGate),
  { ssr: false }
);
```

## Troubleshooting

Use this when GA requests continue after an opt-out or when no `ga-disable-*`
flags appear.

### Quick checks

1. Verify runtime flags exist:
  `Object.keys(window).filter((k) => k.startsWith('ga-disable'))`
2. Verify ID sources in order:
  - `gaMeasurementIds` prop (`G-` IDs only)
  - `NEXT_PUBLIC_GA4_IDS`
  - fallback scan of `script[src*="gtag/js"]`
3. Enable plugin debug logs before the gate runs:
  `window.ELECTRO_PRIVACY_DEBUG = true`

### Late script behavior

The gate observes `document.head` and `document.body` for new or updated
`script[src*="gtag/js"]` nodes. When a new matching script appears, it re-runs
consent checks so late GA4 IDs can still produce `ga-disable-*` flags.

The observer callback does not re-run consent checks for unrelated mutations.
It only rechecks when a matching gtag script node is detected.

### Debug toggle scope

`window.ELECTRO_PRIVACY_DEBUG` is the only debug toggle in this gate.
There is no debug activation from a query param, localStorage, prop, or
`NODE_ENV` check.
It must be set before the gate mounts and does not persist across reloads, so
setting it in the Console and then refreshing will not surface logs.

## Verification

Test on deployed OneTrust markup in Firefox, Chrome, and Edge:

- No saved opt-out: GTM loads and GA4 runtime flags are `false`.
- Open Preference Center and turn analytics off without saving: new GTM/GA4
  activity is suppressed immediately.
- Close without saving: the saved consent state is restored.
- Save an opt-out: the configured GTM container is removed, GA4 is disabled,
  and the page reloads once.
- Reload with saved opt-out: GTM remains absent.
- Confirm unrelated GTM containers and unrelated tags are not removed.

## Package Validation

When changing the library implementation, run:

```bash
npm run type-check
npm run lint
npm test -- --run test/gtm-consent-gate.test.tsx
npm test
npm run build:gtm
git diff --check
```

**Required:** After `npm run build:gtm`, commit the regenerated `dist/`
artifacts. Consumers install and execute from `dist/`, so skipping this step
can silently ship stale behavior.

Before publishing, run `npm run build` and include the regenerated `dist/`
artifacts in the release commit.
