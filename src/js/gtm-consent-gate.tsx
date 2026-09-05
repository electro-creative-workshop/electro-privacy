'use client';

import React, { useEffect, useRef, useState } from 'react';

declare const process: { env?: Record<string, string | undefined> } | undefined;

const DEFAULT_ANALYTICS_CODE = 'C0002';
const CONSENT_RECHECK_DELAYS_MS = [0, 150, 600, 1500] as const;

type BrowserWindow = Window & {
  OnetrustActiveGroups?: string;
  OptanonActiveGroups?: string;
  dataLayer?: Array<Record<string, unknown>>;
  google_tag_manager?: Record<string, unknown>;
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

type ConsentCheckResult = {
  effectiveAllowed: boolean;
  savedBecameDenied: boolean;
};

type GaRuntimeOwner = {
  disabled: boolean;
};

type GaRuntimeState = {
  baselineValue: unknown;
  hadBaselineValue: boolean;
  owners: Map<symbol, GaRuntimeOwner>;
};

const gaRuntimeOwners = new Map<string, GaRuntimeState>();

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
  const category = groupsMatch?.[1]
    .split(',')
    .find((group) => group === `${categoryCode}:1` || group === `${categoryCode}:0`);

  if (!category) return null;
  return category === `${categoryCode}:1`;
}

function getActiveGroups(): string {
  const browserWindow = window as BrowserWindow;
  const primaryActiveGroups = browserWindow.OnetrustActiveGroups;
  return (
    typeof primaryActiveGroups === 'string' && primaryActiveGroups.trim().length > 0
      ? primaryActiveGroups
      : browserWindow.OptanonActiveGroups
  ) ?? '';
}

function readCategoryFromActiveGroups(categoryCode: string): boolean | null {
  const activeGroups = getActiveGroups();
  if (activeGroups.trim().length === 0) return null;

  const groups = activeGroups
    .split(',')
    .map((group) => group.trim())
    .filter(Boolean);

  if (groups.length === 0) return null;
  return groups.includes(categoryCode);
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
  const rawIds = typeof process !== 'undefined' ? process?.env?.NEXT_PUBLIC_GA4_IDS ?? '' : '';
  if (!rawIds) return [];

  return normalizeGaMeasurementIds(rawIds.split(','));
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
  return normalizedIds;
}

function resolveGaMeasurementIds(configuredIds: readonly string[]): string[] {
  const explicitIds = normalizeGaMeasurementIds(configuredIds);
  const environmentIds = readGaMeasurementIdsFromEnvironment();
  const combinedIds = Array.from(new Set([...explicitIds, ...environmentIds]));
  const fallbackIds = combinedIds.length === 0 ? readGaMeasurementIdsFromGtagScripts() : [];
  return combinedIds.length > 0 ? combinedIds : fallbackIds;
}

function syncGaRuntimeOwnership(ownerId: symbol, measurementIds: readonly string[], disabled: boolean): void {
  const windowWithGaFlags = window as unknown as Window & Record<string, unknown>;
  const nextIds = new Set(measurementIds.filter(isValidGa4MeasurementId));

  for (const [measurementId, state] of gaRuntimeOwners) {
    if (nextIds.has(measurementId)) continue;
    if (!state.owners.has(ownerId)) continue;

    state.owners.delete(ownerId);
    if (state.owners.size === 0) {
      const flagName = `ga-disable-${measurementId}`;
      if (state.hadBaselineValue) {
        windowWithGaFlags[flagName] = state.baselineValue;
      } else {
        delete windowWithGaFlags[flagName];
      }
      gaRuntimeOwners.delete(measurementId);
    } else {
      const flagName = `ga-disable-${measurementId}`;
      windowWithGaFlags[flagName] =
        state.baselineValue === true || Array.from(state.owners.values()).some((entry) => entry.disabled);
    }
  }

  for (const measurementId of measurementIds) {
    if (!isValidGa4MeasurementId(measurementId)) continue;

    let state = gaRuntimeOwners.get(measurementId);
    if (!state) {
      const flagName = `ga-disable-${measurementId}`;
      state = {
        baselineValue: windowWithGaFlags[flagName],
        hadBaselineValue: Object.prototype.hasOwnProperty.call(windowWithGaFlags, flagName),
        owners: new Map(),
      };
      gaRuntimeOwners.set(measurementId, state);
    }

    if (!state.owners.has(ownerId)) {
      state.owners.set(ownerId, { disabled });
    } else {
      state.owners.get(ownerId)!.disabled = disabled;
    }

    const flagName = `ga-disable-${measurementId}`;
    windowWithGaFlags[flagName] =
      state.baselineValue === true || Array.from(state.owners.values()).some((owner) => owner.disabled);
  }
}

function releaseGaRuntimeOwnership(ownerId: symbol): void {
  const windowWithGaFlags = window as unknown as Window & Record<string, unknown>;

  for (const [measurementId, state] of gaRuntimeOwners) {
    if (!state.owners.has(ownerId)) continue;

    state.owners.delete(ownerId);
    const flagName = `ga-disable-${measurementId}`;
    if (state.owners.size === 0) {
      if (state.hadBaselineValue) {
        windowWithGaFlags[flagName] = state.baselineValue;
      } else {
        delete windowWithGaFlags[flagName];
      }
      gaRuntimeOwners.delete(measurementId);
    } else {
      windowWithGaFlags[flagName] =
        state.baselineValue === true || Array.from(state.owners.values()).some((entry) => entry.disabled);
    }
  }
}

function pauseGtm(performanceCode: string): void {
  const windowWithGtm = window as BrowserWindow;
  windowWithGtm.dataLayer ??= [];
  const activeGroups = getActiveGroups();
  const groups = activeGroups
    .split(',')
    .map((group) => group.trim())
    .filter(Boolean)
    .filter((group) => group !== performanceCode);

  // Best-effort signal for consent-mode-aware tags; GA suppression uses ga-disable-*.
  windowWithGtm.dataLayer.push({
    event: 'OneTrustGroupsUpdated',
    OneTrustActiveGroups: groups.length > 0 ? `,${groups.join(',')},` : '',
  });
}

function teardownGtm(gtmId: string, ownedScripts: Set<HTMLScriptElement>): void {
  for (const script of ownedScripts) script.remove();

  for (const script of document.querySelectorAll<HTMLScriptElement>('script[src]')) {
    try {
      const scriptUrl = new URL(script.src, window.location.origin);
      if (
        scriptUrl.hostname === 'www.googletagmanager.com' &&
        scriptUrl.pathname === '/gtm.js' &&
        scriptUrl.searchParams.get('id') === gtmId
      ) {
        script.remove();
      }
    } catch {
      // Ignore malformed script src values.
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
  const [savedAnalyticsAllowed, setSavedAnalyticsAllowed] = useState(false);
  const [pendingAnalyticsAllowed, setPendingAnalyticsAllowed] = useState<boolean | null>(null);
  const [preferenceCenterOpen, setPreferenceCenterOpen] = useState(false);
  const [hasCheckedConsent, setHasCheckedConsent] = useState(false);
  const pendingConsentChecksRef = useRef<number[]>([]);
  const hasTriggeredReloadRef = useRef(false);
  const previousSavedAllowedRef = useRef<boolean | null>(null);
  const pendingSavedDenialRef = useRef(false);
  const hasLoadedGtmRef = useRef(false);
  const gaOwnerIdRef = useRef(Symbol());

  const analyticsAllowed = preferenceCenterOpen
    ? savedAnalyticsAllowed && (pendingAnalyticsAllowed ?? true)
    : savedAnalyticsAllowed;
  const gaMeasurementIdsKey = gaMeasurementIds.join(',');

  useEffect(() => {
    if (!gtmId) return;

    const seenGtagScripts = new WeakSet<HTMLScriptElement>();
    const ownedGtmScripts = new Set<HTMLScriptElement>();
    let preferenceCenter: HTMLElement | null = null;
    let preferenceCenterObserver: MutationObserver | undefined;
    let preferenceCenterToggleListener: ((event: Event) => void) | undefined;

    function attachPreferenceCenterObserver(): void {
      const nextPreferenceCenter = document.getElementById('onetrust-pc-sdk');
      if (preferenceCenter === nextPreferenceCenter && preferenceCenterObserver && preferenceCenterToggleListener) return;

      preferenceCenterObserver?.disconnect();
      if (preferenceCenter && preferenceCenterToggleListener) {
        preferenceCenter.removeEventListener('change', preferenceCenterToggleListener);
        preferenceCenter.removeEventListener('click', preferenceCenterToggleListener);
      }
      preferenceCenter = nextPreferenceCenter;
      preferenceCenterObserver = undefined;
      preferenceCenterToggleListener = undefined;
      if (!preferenceCenter) return;

      preferenceCenterObserver = new MutationObserver(checkConsent);
      preferenceCenterObserver.observe(preferenceCenter, {
        attributes: true,
        attributeFilter: ['aria-hidden', 'style', 'class'],
        childList: true,
        subtree: true,
      });

      const toggleSelector = `#ot-group-id-${performanceCode} input[type="checkbox"]`;
      preferenceCenterToggleListener = (event: Event) => {
        const target = event.target;
        if (target instanceof Element && target.closest(toggleSelector)) checkConsent();
      };
      preferenceCenter.addEventListener('change', preferenceCenterToggleListener);
      preferenceCenter.addEventListener('click', preferenceCenterToggleListener);
    }

    function clearPendingConsentChecks(): void {
      for (const timerId of pendingConsentChecksRef.current) {
        window.clearTimeout(timerId);
      }
      pendingConsentChecksRef.current = [];
    }

    function checkConsent(): ConsentCheckResult {
      attachPreferenceCenterObserver();
      const resolvedMeasurementIds = resolveGaMeasurementIds(gaMeasurementIds);
      const savedAllowed = readSavedAnalyticsAllowed(performanceCode);
      const isOpen = isPreferenceCenterOpen(preferenceCenter);
      const pendingAllowed = isOpen ? readPendingAnalyticsAllowed(preferenceCenter, performanceCode) : null;
      const effectiveAllowed = isOpen ? savedAllowed && (pendingAllowed ?? true) : savedAllowed;
      const previousSavedAllowed = previousSavedAllowedRef.current;
      const savedBecameDenied = previousSavedAllowed === true && savedAllowed === false;

      previousSavedAllowedRef.current = savedAllowed;
      if (savedBecameDenied) pendingSavedDenialRef.current = true;
      if (savedAllowed) pendingSavedDenialRef.current = false;

      setSavedAnalyticsAllowed(savedAllowed);
      setPreferenceCenterOpen(isOpen);
      setPendingAnalyticsAllowed(pendingAllowed);
      syncGaRuntimeOwnership(gaOwnerIdRef.current, resolvedMeasurementIds, !effectiveAllowed);
      setHasCheckedConsent(true);

      if (!effectiveAllowed && hasLoadedGtmRef.current) {
        pauseGtm(performanceCode);
        teardownGtm(gtmId, ownedGtmScripts);
      }

      if (
        !effectiveAllowed &&
        pendingSavedDenialRef.current &&
        !isOpen &&
        hasLoadedGtmRef.current
      ) {
        revokeSavedConsent();
      }

      return {
        effectiveAllowed,
        savedBecameDenied,
      };
    }

    function revokeSavedConsent(): void {
      if (hasTriggeredReloadRef.current) return;
      hasTriggeredReloadRef.current = true;
      syncGaRuntimeOwnership(gaOwnerIdRef.current, resolveGaMeasurementIds(gaMeasurementIds), true);
      teardownGtm(gtmId, ownedGtmScripts);
      browserNavigation.reload();
    }

    function handleConsentApplied(): void {
      clearPendingConsentChecks();

      const immediateResult = checkConsent();
      if (
        !immediateResult.effectiveAllowed &&
        pendingSavedDenialRef.current &&
        !isPreferenceCenterOpen(preferenceCenter) &&
        hasLoadedGtmRef.current
      ) {
        revokeSavedConsent();
      }

      for (const delay of CONSENT_RECHECK_DELAYS_MS) {
        const timerId = window.setTimeout(() => {
          const { effectiveAllowed } = checkConsent();
          if (
            !effectiveAllowed &&
            pendingSavedDenialRef.current &&
            !isPreferenceCenterOpen(preferenceCenter) &&
            hasLoadedGtmRef.current
          ) {
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

    function registerOwnedGtmScripts(scripts: Iterable<HTMLScriptElement>): void {
      for (const script of scripts) {
        const scriptUrl = (() => {
          try {
            return new URL(script.src, window.location.origin);
          } catch {
            return null;
          }
        })();
        const isConfiguredGtmScript =
          scriptUrl?.hostname === 'www.googletagmanager.com' &&
          scriptUrl.pathname === '/gtm.js' &&
          scriptUrl.searchParams.get('id') === gtmId;
        const isExplicitlyOwnedScript = script.dataset.gtmId === gtmId;

        if (isConfiguredGtmScript || isExplicitlyOwnedScript) ownedGtmScripts.add(script);
      }
    }

    for (const script of document.querySelectorAll<HTMLScriptElement>('script[src*="gtag/js"]')) {
      seenGtagScripts.add(script);
    }
    registerOwnedGtmScripts(document.querySelectorAll<HTMLScriptElement>('script'));

    let observer: MutationObserver | undefined;
    if (document.body) {
      observer = new MutationObserver(() => {
        if (preferenceCenter !== document.getElementById('onetrust-pc-sdk')) checkConsent();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    let gtagScriptObserver: MutationObserver | undefined;
    const gtagObserverCallback: MutationCallback = (mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            const addedScripts: HTMLScriptElement[] = [];
            if (node instanceof HTMLScriptElement) addedScripts.push(node);
            if (node instanceof Element) {
              addedScripts.push(...node.querySelectorAll<HTMLScriptElement>('script'));
            }
            registerOwnedGtmScripts(addedScripts);

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
      preferenceCenterObserver?.disconnect();
      if (preferenceCenter && preferenceCenterToggleListener) {
        preferenceCenter.removeEventListener('change', preferenceCenterToggleListener);
        preferenceCenter.removeEventListener('click', preferenceCenterToggleListener);
      }
      gtagScriptObserver?.disconnect();
      window.removeEventListener('OneTrustGroupsUpdated', handleConsentApplied);
      window.removeEventListener('OneTrustPCLoaded', checkConsent);
      window.removeEventListener('OTConsentApplied', handleConsentApplied);
      releaseGaRuntimeOwnership(gaOwnerIdRef.current);
    };
  }, [gaMeasurementIdsKey, gtmId, performanceCode]);

  useEffect(() => {
    if (analyticsAllowed) hasLoadedGtmRef.current = true;
  }, [analyticsAllowed]);

  if (!gtmId || !hasCheckedConsent || !analyticsAllowed) return null;

  return <GoogleTagManager gtmId={gtmId} />;
}
