'use client';

import React, { useEffect, useRef, useState } from 'react';

const DEFAULT_ANALYTICS_CODE = 'C0002';
const CONSENT_RECHECK_DELAYS_MS = [0, 150, 600, 1500] as const;

type BrowserWindow = Window & {
  OptanonActiveGroups?: string;
  google_tag_manager?: Record<string, unknown>;
  __ELECTRO_PRIVACY_DEBUG__?: boolean;
};

type GtmComponentProps = {
  gtmId: string;
};

export type GtmConsentGateProps = {
  gtmId: string;
  gaMeasurementIds?: readonly string[];
  performanceCode?: string;
  GoogleTagManager: React.ComponentType<GtmComponentProps>;
};

function getCookieValue(name: string): string | null {
  const match = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`));

  return match ? match.slice(name.length + 1) : null;
}

function readCategoryFromCookie(categoryCode: string): boolean | null {
  const optanonConsent = getCookieValue('OptanonConsent');
  if (!optanonConsent) return null;

  let decodedConsent = optanonConsent;
  try {
    decodedConsent = decodeURIComponent(optanonConsent);
  } catch {
    // Use the raw cookie when it is not URI encoded.
  }

  const groupsMatch = decodedConsent.match(/groups=([^&]+)/);
  const category = groupsMatch?.[1].split(',').find((group) => group.startsWith(`${categoryCode}:`));

  if (!category) return null;
  return !category.endsWith(':0');
}

function readCategoryFromActiveGroups(categoryCode: string): boolean | null {
  const activeGroups = (window as BrowserWindow).OptanonActiveGroups;
  if (typeof activeGroups !== 'string' || activeGroups.trim().length === 0) return null;

  const groups = activeGroups
    .split(',')
    .map((group) => group.trim())
    .filter(Boolean);

  if (groups.length === 0) return null;
  return groups.some((group) => group === categoryCode || group.startsWith(`${categoryCode}:1`));
}

function readSavedAnalyticsAllowed(categoryCode: string): boolean {
  const activeGroupsAllowed = readCategoryFromActiveGroups(categoryCode);

  // OneTrust can publish an active-groups denial before its cookie write completes.
  if (activeGroupsAllowed === false) return false;

  const cookieAllowed = readCategoryFromCookie(categoryCode);
  if (cookieAllowed !== null) return cookieAllowed;
  if (activeGroupsAllowed !== null) return activeGroupsAllowed;

  // This integration is default-on: a missing saved choice is not an opt-out.
  return true;
}

function isPreferenceCenterOpen(preferenceCenter: HTMLElement | null): boolean {
  if (!preferenceCenter) return false;

  const ariaHidden = preferenceCenter.getAttribute('aria-hidden');
  if (ariaHidden === 'false') return true;
  if (ariaHidden === 'true') return false;

  const style = window.getComputedStyle(preferenceCenter);
  return style.display !== 'none' && style.visibility !== 'hidden';
}

function readPendingAnalyticsAllowed(preferenceCenter: HTMLElement | null, categoryCode: string): boolean | null {
  if (!preferenceCenter) return null;

  const toggle = preferenceCenter.querySelector<HTMLInputElement>(
    `#ot-group-id-${categoryCode} input[type="checkbox"]`
  );

  return toggle ? toggle.checked : null;
}

function isValidGa4MeasurementId(measurementId: string): boolean {
  return measurementId.startsWith('G-');
}

function normalizeGaMeasurementIds(measurementIds: readonly string[]): string[] {
  return Array.from(
    new Set(
      measurementIds
        .map((measurementId) => measurementId.trim())
        .filter((measurementId) => measurementId.length > 0)
        .filter(isValidGa4MeasurementId)
    )
  );
}

function readGaMeasurementIdsFromEnvironment(): string[] {
  const rawIds = process.env.NEXT_PUBLIC_GA4_IDS ?? '';
  if (!rawIds) {
    if (shouldDebugLog()) {
      console.debug('[Electro Privacy] NEXT_PUBLIC_GA4_IDS is empty or undefined');
    }
    return [];
  }

  const normalizedIds = normalizeGaMeasurementIds(rawIds.split(','));
  if (shouldDebugLog()) {
    console.debug('[Electro Privacy] NEXT_PUBLIC_GA4_IDS parsed', {
      raw: rawIds,
      parsed: normalizedIds,
    });
  }

  return normalizedIds;
}

function readGaMeasurementIdsFromGtagScripts(): string[] {
  const detectedIds: string[] = [];

  for (const script of document.querySelectorAll<HTMLScriptElement>('script[src*="gtag/js"]')) {
    try {
      const scriptUrl = new URL(script.src, window.location.origin);
      const measurementId = scriptUrl.searchParams.get('id')?.trim() ?? '';
      if (measurementId) detectedIds.push(measurementId);
    } catch {
      // Ignore malformed script src values.
    }
  }

  const normalizedIds = normalizeGaMeasurementIds(detectedIds);
  if (shouldDebugLog()) {
    console.debug('[Electro Privacy] gtag/js fallback IDs', {
      discovered: detectedIds,
      parsed: normalizedIds,
    });
  }

  return normalizedIds;
}

function resolveGaMeasurementIds(configuredIds: readonly string[]): string[] {
  const explicitIds = normalizeGaMeasurementIds(configuredIds);
  const environmentIds = readGaMeasurementIdsFromEnvironment();
  const combinedIds = Array.from(new Set([...explicitIds, ...environmentIds]));
  const fallbackIds = combinedIds.length === 0 ? readGaMeasurementIdsFromGtagScripts() : [];
  const resolvedIds = combinedIds.length > 0 ? combinedIds : fallbackIds;

  if (shouldDebugLog()) {
    console.debug('[Electro Privacy] resolveGaMeasurementIds()', {
      configuredIds,
      envIds: environmentIds,
      fallbackIds,
      resolvedIds,
    });
  }

  return resolvedIds;
}

function shouldDebugLog(): boolean {
  return Boolean((window as BrowserWindow).__ELECTRO_PRIVACY_DEBUG__);
}

function setGaRuntimeDisabled(measurementIds: readonly string[], disabled: boolean): void {
  const windowWithGaFlags = window as unknown as Window & Record<string, unknown>;

  if (shouldDebugLog()) {
    console.debug('[Electro Privacy] setGaRuntimeDisabled()', {
      disabled,
      measurementIds,
    });
    console.debug('[Electro Privacy] setGaRuntimeDisabled received IDs', measurementIds);
  }

  for (const measurementId of measurementIds) {
    if (isValidGa4MeasurementId(measurementId)) {
      const flagName = `ga-disable-${measurementId}`;
      const previousValue = windowWithGaFlags[flagName];
      windowWithGaFlags[flagName] = disabled;

      if (shouldDebugLog() && previousValue !== disabled) {
        console.debug(`[Electro Privacy] ${disabled ? 'Set' : 'Cleared'} ${flagName}`);
      }
    }
  }
}

function teardownGtm(gtmId: string): void {
  document.getElementById('_next-gtm')?.remove();
  document.getElementById('_next-gtm-init')?.remove();

  for (const script of document.querySelectorAll<HTMLScriptElement>('script[src]')) {
    if (script.src.includes('googletagmanager.com/gtm.js') && script.src.includes(`id=${gtmId}`)) {
      script.remove();
    }
  }

  const windowWithGtm = window as BrowserWindow;
  if (!windowWithGtm.google_tag_manager) return;

  delete windowWithGtm.google_tag_manager[gtmId];
  if (Object.keys(windowWithGtm.google_tag_manager).length === 0) {
    delete windowWithGtm.google_tag_manager;
  }
}

export const browserNavigation = {
  reload(): void {
    window.location.reload();
  },
};

export function GtmConsentGate({
  gtmId,
  gaMeasurementIds = [],
  performanceCode = DEFAULT_ANALYTICS_CODE,
  GoogleTagManager,
}: GtmConsentGateProps): React.ReactElement | null {
  const [savedAnalyticsAllowed, setSavedAnalyticsAllowed] = useState(true);
  const [pendingAnalyticsAllowed, setPendingAnalyticsAllowed] = useState<boolean | null>(null);
  const [preferenceCenterOpen, setPreferenceCenterOpen] = useState(false);
  const [hasLoadedGtm, setHasLoadedGtm] = useState(false);
  const pendingConsentChecksRef = useRef<number[]>([]);
  const hasTriggeredReloadRef = useRef(false);

  const analyticsAllowed = preferenceCenterOpen
    ? (pendingAnalyticsAllowed ?? savedAnalyticsAllowed)
    : savedAnalyticsAllowed;
  const gaMeasurementIdsKey = gaMeasurementIds.join(',');

  useEffect(() => {
    if (!gtmId) return;

    const preferenceCenter = document.getElementById('onetrust-pc-sdk');
    const seenGtagScripts = new WeakSet<HTMLScriptElement>();

    function clearPendingConsentChecks(): void {
      for (const timerId of pendingConsentChecksRef.current) {
        window.clearTimeout(timerId);
      }
      pendingConsentChecksRef.current = [];
    }

    function checkConsent(): boolean {
      const resolvedMeasurementIds = resolveGaMeasurementIds(gaMeasurementIds);
      const savedAllowed = readSavedAnalyticsAllowed(performanceCode);
      const isOpen = isPreferenceCenterOpen(preferenceCenter);
      const pendingAllowed = isOpen ? readPendingAnalyticsAllowed(preferenceCenter, performanceCode) : null;
      const effectiveAllowed = isOpen ? (pendingAllowed ?? savedAllowed) : savedAllowed;

      setSavedAnalyticsAllowed(savedAllowed);
      setPreferenceCenterOpen(isOpen);
      setPendingAnalyticsAllowed(pendingAllowed);
      setGaRuntimeDisabled(resolvedMeasurementIds, !effectiveAllowed);

      if (!effectiveAllowed && hasLoadedGtm) {
        teardownGtm(gtmId);
      }

      return effectiveAllowed;
    }

    function revokeSavedConsent(): void {
      if (hasTriggeredReloadRef.current) return;
      hasTriggeredReloadRef.current = true;
      setGaRuntimeDisabled(resolveGaMeasurementIds(gaMeasurementIds), true);
      teardownGtm(gtmId);
      browserNavigation.reload();
    }

    function handleConsentApplied(): void {
      clearPendingConsentChecks();
      checkConsent();

      for (const delay of CONSENT_RECHECK_DELAYS_MS) {
        const timerId = window.setTimeout(() => {
          const effectiveAllowed = checkConsent();
          if (!effectiveAllowed && !isPreferenceCenterOpen(preferenceCenter) && hasLoadedGtm) {
            revokeSavedConsent();
          }
        }, delay);
        pendingConsentChecksRef.current.push(timerId);
      }
    }

    function collectGtagScriptsFromNode(node: Node): HTMLScriptElement[] {
      const gtagScripts: HTMLScriptElement[] = [];

      if (node instanceof HTMLScriptElement && node.src.includes('gtag/js')) {
        gtagScripts.push(node);
      }

      if (!(node instanceof Element)) return gtagScripts;

      for (const script of node.querySelectorAll<HTMLScriptElement>('script[src*="gtag/js"]')) {
        gtagScripts.push(script);
      }

      return gtagScripts;
    }

    function handlePotentialGtagScript(script: HTMLScriptElement): void {
      if (!script.src.includes('gtag/js')) return;
      if (seenGtagScripts.has(script)) return;

      seenGtagScripts.add(script);
      checkConsent();
    }

    for (const script of document.querySelectorAll<HTMLScriptElement>('script[src*="gtag/js"]')) {
      seenGtagScripts.add(script);
    }

    let observer: MutationObserver | undefined;
    if (preferenceCenter) {
      observer = new MutationObserver(checkConsent);
      observer.observe(preferenceCenter, {
        attributes: true,
        attributeFilter: ['aria-hidden', 'style', 'class'],
        childList: true,
        subtree: true,
      });
    }

    let gtagScriptObserver: MutationObserver | undefined;
    const gtagObserverCallback: MutationCallback = (mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            for (const script of collectGtagScriptsFromNode(node)) {
              handlePotentialGtagScript(script);
            }
          }
          continue;
        }

        if (mutation.type === 'attributes' && mutation.target instanceof HTMLScriptElement) {
          handlePotentialGtagScript(mutation.target);
        }
      }
    };

    if (document.head || document.body) {
      gtagScriptObserver = new MutationObserver(gtagObserverCallback);
      if (document.head) {
        gtagScriptObserver.observe(document.head, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['src'],
        });
      }
      if (document.body) {
        gtagScriptObserver.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['src'],
        });
      }
    }

    checkConsent();
    window.addEventListener('OneTrustGroupsUpdated', handleConsentApplied);
    window.addEventListener('OneTrustPCLoaded', checkConsent);
    window.addEventListener('OTConsentApplied', handleConsentApplied);

    return () => {
      clearPendingConsentChecks();
      observer?.disconnect();
      gtagScriptObserver?.disconnect();
      window.removeEventListener('OneTrustGroupsUpdated', handleConsentApplied);
      window.removeEventListener('OneTrustPCLoaded', checkConsent);
      window.removeEventListener('OTConsentApplied', handleConsentApplied);
      setGaRuntimeDisabled(resolveGaMeasurementIds(gaMeasurementIds), true);
    };
  }, [gaMeasurementIdsKey, gtmId, hasLoadedGtm, performanceCode]);

  useEffect(() => {
    if (analyticsAllowed) setHasLoadedGtm(true);
  }, [analyticsAllowed]);

  if (!gtmId || !analyticsAllowed) return null;

  return <GoogleTagManager gtmId={gtmId} />;
}
