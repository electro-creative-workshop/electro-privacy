import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
/**
 * ============================================================
 * GTM CONSENT GATE (ARCHITECTURE OVERVIEW)
 * ============================================================
 *
 * This component is a HARD GATE for loading Google Tag Manager.
 *
 * Purpose:
 * - Prevent GTM from loading until performance consent (C0002) is granted
 * - Avoid early script execution due to OneTrust timing issues
 * - Provide teardown + reset if consent is revoked after load
 *
 * IMPORTANT:
 * - This controls whether GTM EXISTS on the page
 * - GTM consent mode controls what GTM can RUN
 *
 * These are complementary layers — not replacements for each other.
 *
 * ------------------------------------------------------------
 * FUTURE (after GTM consent mode rollout):
 *
 * ✅ KEEP:
 * - The main GTM gating (showGTM) — protects against early execution
 *
 * ⚠️ MAY BE SIMPLIFIED:
 * - Cookie parsing fallback (if OptanonActiveGroups is reliable)
 * - Recheck timers (if OT timing stabilizes)
 * - Preference center observer (UX-dependent)
 * - Hard reload on revoke (may be softened)
 *
 * ❌ DO NOT REMOVE:
 * - The core gate itself unless GTM load timing is fully trusted
 */
const DEFAULT_PERFORMANCE_CODE = 'C0002';
/**
 * Recheck delays help mitigate OneTrust async timing issues.
 *
 * WHY:
 * - OneTrust updates consent state asynchronously
 * - OptanonActiveGroups may not be immediately accurate
 *
 * FUTURE:
 * - Could potentially be removed if timing becomes reliable
 */
const CONSENT_RECHECK_DELAYS_MS = [0, 150, 600, 1500];
/**
 * Helper: reads a cookie value by name
 */
function getCookieValue(name) {
    const match = document.cookie
        .split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith(`${name}=`));
    if (!match)
        return null;
    return match.slice(name.length + 1);
}
/**
 * Detects whether the OneTrust preference center is currently open.
 *
 * WHY:
 * - Prevents GTM loading while user is actively making consent decisions
 *
 * FUTURE:
 * - Could be removed depending on UX requirements
 */
function isPreferenceCenterOpen() {
    const preferenceCenter = document.getElementById('onetrust-pc-sdk');
    if (!preferenceCenter)
        return false;
    const ariaHidden = preferenceCenter.getAttribute('aria-hidden');
    if (ariaHidden === 'false')
        return true;
    if (ariaHidden === 'true')
        return false;
    const computedStyle = window.getComputedStyle(preferenceCenter);
    return computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
}
/**
 * Fallback: parse consent from OneTrust cookie
 *
 * WHY:
 * - OptanonActiveGroups is not always immediately available
 *
 * FUTURE:
 * - Could likely be removed if active groups are reliable
 */
function hasPerformanceConsentFromCookie(performanceCode) {
    const optanonConsent = getCookieValue('OptanonConsent');
    if (!optanonConsent)
        return null;
    let decodedConsent = optanonConsent;
    try {
        decodedConsent = decodeURIComponent(optanonConsent);
    }
    catch {
        decodedConsent = optanonConsent;
    }
    const groupsMatch = decodedConsent.match(/groups=([^&]+)/);
    if (!groupsMatch)
        return null;
    const groups = groupsMatch[1].split(',');
    const performanceGroup = groups.find((group) => group.startsWith(`${performanceCode}:`));
    if (!performanceGroup)
        return null;
    return !performanceGroup.endsWith(':0');
}
/**
 * Primary consent signal: OneTrust active groups
 *
 * FUTURE:
 * - Prefer to rely on this entirely if stable
 */
function hasPerformanceConsentFromActiveGroups(performanceCode) {
    const activeGroups = window.OptanonActiveGroups;
    if (typeof activeGroups !== 'string' || activeGroups.trim().length === 0)
        return null;
    const groups = activeGroups
        .split(',')
        .map((group) => group.trim())
        .filter(Boolean);
    if (groups.length === 0)
        return null;
    return groups.some((group) => group === performanceCode || group.startsWith(`${performanceCode}:1`));
}
/**
 * Combined consent check (fail-closed)
 */
function hasPerformanceConsent(performanceCode) {
    const activeGroupsConsent = hasPerformanceConsentFromActiveGroups(performanceCode);
    if (activeGroupsConsent === false)
        return false;
    const cookieConsent = hasPerformanceConsentFromCookie(performanceCode);
    if (cookieConsent !== null)
        return cookieConsent;
    if (activeGroupsConsent !== null)
        return activeGroupsConsent;
    return false;
}
/**
 * Removes GTM from page entirely
 *
 * WHY:
 * - Ensures no tracking remains after consent revocation
 */
function teardownGtm(gtmId) {
    var _a, _b;
    (_a = document.getElementById('_next-gtm')) === null || _a === void 0 ? void 0 : _a.remove();
    (_b = document.getElementById('_next-gtm-init')) === null || _b === void 0 ? void 0 : _b.remove();
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
/**
 * Disables GA via runtime flags
 *
 * WHY:
 * - Additional safety layer if GTM misfires
 *
 * FUTURE:
 * - May be redundant once GTM consent mode is fully trusted
 */
function setGaRuntimeDisabled(measurementIds, disabled) {
    const windowWithGaFlags = window;
    for (const measurementId of measurementIds) {
        if (!measurementId.startsWith('G-'))
            continue;
        windowWithGaFlags[`ga-disable-${measurementId}`] = disabled;
    }
}
/**
 * Reload wrapper used after consent revocation
 */
export const browserNavigation = {
    reload() {
        window.location.reload();
    },
};
export function GtmConsentGate({ gtmId, gaMeasurementIds = [], performanceCode = DEFAULT_PERFORMANCE_CODE, GoogleTagManager, }) {
    /**
     * Controls whether GTM is rendered at all
     */
    const [showGTM, setShowGTM] = useState(false);
    /**
     * Tracks whether GTM has ever been loaded
     */
    const hasLoadedGtmRef = useRef(false);
    /**
     * Tracks delayed consent rechecks
     */
    const pendingConsentChecksRef = useRef([]);
    /**
     * Prevents multiple reloads
     */
    const hasTriggeredReloadRef = useRef(false);
    useEffect(() => {
        if (!gtmId)
            return;
        function clearPendingConsentChecks() {
            for (const timerId of pendingConsentChecksRef.current) {
                window.clearTimeout(timerId);
            }
            pendingConsentChecksRef.current = [];
        }
        /**
         * Hard reset when consent is revoked
         *
         * FUTURE:
         * - Could potentially be simplified to teardown only
         */
        function revokeConsentAndReload() {
            if (hasTriggeredReloadRef.current)
                return;
            hasTriggeredReloadRef.current = true;
            setGaRuntimeDisabled(gaMeasurementIds, true);
            teardownGtm(gtmId);
            browserNavigation.reload();
        }
        /**
         * Core logic: determines whether GTM is allowed
         */
        function updateGtmState() {
            const canRun = hasPerformanceConsent(performanceCode) && !isPreferenceCenterOpen();
            setGaRuntimeDisabled(gaMeasurementIds, !canRun);
            if (!canRun && hasLoadedGtmRef.current) {
                teardownGtm(gtmId);
            }
            setShowGTM(canRun);
            if (canRun)
                hasLoadedGtmRef.current = true;
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
            observer === null || observer === void 0 ? void 0 : observer.disconnect();
            window.removeEventListener('OneTrustGroupsUpdated', updateGtmState);
            window.removeEventListener('OneTrustPCLoaded', updateGtmState);
            window.removeEventListener('OTConsentApplied', handleConsentApplied);
            setGaRuntimeDisabled(gaMeasurementIds, true);
        };
    }, [gaMeasurementIds, gtmId, performanceCode]);
    /**
     * CRITICAL:
     * GTM does not render unless consent allows it
     */
    if (!showGTM)
        return null;
    return GoogleTagManager ? _jsx(GoogleTagManager, { gtmId: gtmId }) : null;
}
