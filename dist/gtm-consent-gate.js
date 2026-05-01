import React, { useEffect, useRef, useState } from 'react';

// Default OneTrust performance consent code (can be overridden via prop)
const DEFAULT_PERFORMANCE_CODE = 'C0002';
const CONSENT_RECHECK_DELAYS_MS = [0, 150, 600, 1500];

function getCookieValue(name) {
  const match = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`));
  if (!match) return null;
  return match.slice(name.length + 1);
}

function isPreferenceCenterOpen() {
  const preferenceCenter = document.getElementById('onetrust-pc-sdk');
  if (!preferenceCenter) return false;
  const ariaHidden = preferenceCenter.getAttribute('aria-hidden');
  if (ariaHidden === 'false') return true;
  if (ariaHidden === 'true') return false;
  const computedStyle = window.getComputedStyle(preferenceCenter);
  return computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
}

function hasPerformanceConsentFromCookie(performanceCode) {
  const optanonConsent = getCookieValue('OptanonConsent');
  if (!optanonConsent) return null;
  let decodedConsent = optanonConsent;
  try {
    decodedConsent = decodeURIComponent(optanonConsent);
  } catch {
    decodedConsent = optanonConsent;
  }
  const groupsMatch = decodedConsent.match(/groups=([^&]+)/);
  if (!groupsMatch) return null;
  const groups = groupsMatch[1].split(',');
  const performanceGroup = groups.find((group) => group.startsWith(`${performanceCode}:`));
  if (!performanceGroup) return null;
  return !performanceGroup.endsWith(':0');
}

function hasPerformanceConsentFromActiveGroups(performanceCode) {
  const activeGroups = window.OptanonActiveGroups;
  if (typeof activeGroups !== 'string' || activeGroups.trim().length === 0) return null;
  const groups = activeGroups.split(',').map((group) => group.trim()).filter(Boolean);
  if (groups.length === 0) return null;
  return groups.some(
    (group) => group === performanceCode || group.startsWith(`${performanceCode}:1`)
  );
}

function hasPerformanceConsent(performanceCode) {
  const activeGroupsConsent = hasPerformanceConsentFromActiveGroups(performanceCode);
  if (activeGroupsConsent === false) return false;
  const cookieConsent = hasPerformanceConsentFromCookie(performanceCode);
  if (cookieConsent !== null) return cookieConsent;
  if (activeGroupsConsent !== null) return activeGroupsConsent;
  return false;
}

function teardownGtm(gtmId) {
  document.getElementById('_next-gtm')?.remove();
  document.getElementById('_next-gtm-init')?.remove();
  for (const script of document.querySelectorAll('script[src]')) {
    if (script.src.includes('googletagmanager.com/gtm.js') && script.src.includes(`id=${gtmId}`)) {
      script.remove();
    }
  }
  const windowWithGtm = window;
  if (windowWithGtm.google_tag_manager) {
    delete windowWithGtm.google_tag_manager[gtmId];
    if (Object.keys(windowWithGtm.google_tag_manager).length === 0) {
      delete windowWithGtm.google_tag_manager;
    }
  }
  if (Array.isArray(windowWithGtm.dataLayer)) {
    windowWithGtm.dataLayer.length = 0;
  }
}

function setGaRuntimeDisabled(measurementIds, disabled) {
  const windowWithGaFlags = window;
  for (const measurementId of measurementIds) {
    if (!measurementId.startsWith('G-')) continue;
    windowWithGaFlags[`ga-disable-${measurementId}`] = disabled;
  }
}

export const browserNavigation = {
  reload() {
    window.location.reload();
  },
};

/**
 * GtmConsentGate React component
 *
 * Props:
 * - gtmId: string (required)
 * - gaMeasurementIds: array of GA4 measurement IDs (optional)
 * - performanceCode: OneTrust performance consent code (optional, default 'C0002')
 * - GoogleTagManager: React component to render GTM (required)
 */
export function GtmConsentGate({
  gtmId,
  gaMeasurementIds = [],
  performanceCode = DEFAULT_PERFORMANCE_CODE,
  GoogleTagManager,
}) {
  const [showGTM, setShowGTM] = useState(false);
  const hasLoadedGtmRef = useRef(false);
  const pendingConsentChecksRef = useRef([]);
  const hasTriggeredReloadRef = useRef(false);

  useEffect(() => {
    if (!gtmId) return;

    function clearPendingConsentChecks() {
      for (const timerId of pendingConsentChecksRef.current) {
        window.clearTimeout(timerId);
      }
      pendingConsentChecksRef.current = [];
    }

    function revokeConsentAndReload() {
      if (hasTriggeredReloadRef.current) return;
      hasTriggeredReloadRef.current = true;
      setGaRuntimeDisabled(gaMeasurementIds, true);
      teardownGtm(gtmId);
      browserNavigation.reload();
    }

    function updateGtmState() {
      const canRun = hasPerformanceConsent(performanceCode) && !isPreferenceCenterOpen();
      setGaRuntimeDisabled(gaMeasurementIds, !canRun);
      if (!canRun && hasLoadedGtmRef.current) {
        teardownGtm(gtmId);
      }
      setShowGTM(canRun);
      if (canRun) {
        hasLoadedGtmRef.current = true;
      }
    }

    function handleConsentApplied() {
      const canRun = hasPerformanceConsent(performanceCode);
      if (!canRun && hasLoadedGtmRef.current) {
        revokeConsentAndReload();
        return;
      }
      updateGtmState();
      clearPendingConsentChecks();
      for (const delay of CONSENT_RECHECK_DELAYS_MS) {
        const timerId = window.setTimeout(() => {
          const shouldRun = hasPerformanceConsent(performanceCode);
          if (!shouldRun && hasLoadedGtmRef.current) {
            revokeConsentAndReload();
            return;
          }
          updateGtmState();
        }, delay);
        pendingConsentChecksRef.current.push(timerId);
      }
    }

    let observer;
    const preferenceCenter = document.getElementById('onetrust-pc-sdk');
    if (preferenceCenter) {
      observer = new MutationObserver(updateGtmState);
      observer.observe(preferenceCenter, {
        attributes: true,
        attributeFilter: ['aria-hidden', 'style', 'class'],
      });
    }

    updateGtmState();
    window.addEventListener('OneTrustGroupsUpdated', updateGtmState);
    window.addEventListener('OneTrustPCLoaded', updateGtmState);
    window.addEventListener('OTConsentApplied', handleConsentApplied);

    return () => {
      clearPendingConsentChecks();
      observer?.disconnect();
      window.removeEventListener('OneTrustGroupsUpdated', updateGtmState);
      window.removeEventListener('OneTrustPCLoaded', updateGtmState);
      window.removeEventListener('OTConsentApplied', handleConsentApplied);
      setGaRuntimeDisabled(gaMeasurementIds, true);
    };
  }, [gaMeasurementIds, gtmId, performanceCode]);

  if (!showGTM) return null;
  return GoogleTagManager ? React.createElement(GoogleTagManager, { gtmId }) : null;
}

