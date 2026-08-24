'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
const DEFAULT_ANALYTICS_CODE = 'C0002';
const CONSENT_RECHECK_DELAYS_MS = [0, 150, 600, 1500];
function getCookieValue(name) {
    const match = document.cookie
        .split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith(`${name}=`));
    return match ? match.slice(name.length + 1) : null;
}
function readCategoryFromCookie(categoryCode) {
    const optanonConsent = getCookieValue('OptanonConsent');
    if (!optanonConsent)
        return null;
    let decodedConsent = optanonConsent;
    try {
        decodedConsent = decodeURIComponent(optanonConsent);
    }
    catch {
        // Use the raw cookie when it is not URI encoded.
    }
    const groupsMatch = decodedConsent.match(/groups=([^&]+)/);
    const category = groupsMatch === null || groupsMatch === void 0 ? void 0 : groupsMatch[1].split(',').find((group) => group.startsWith(`${categoryCode}:`));
    if (!category)
        return null;
    return !category.endsWith(':0');
}
function readCategoryFromActiveGroups(categoryCode) {
    const activeGroups = window.OptanonActiveGroups;
    if (typeof activeGroups !== 'string' || activeGroups.trim().length === 0)
        return null;
    const groups = activeGroups
        .split(',')
        .map((group) => group.trim())
        .filter(Boolean);
    if (groups.length === 0)
        return null;
    return groups.some((group) => group === categoryCode || group.startsWith(`${categoryCode}:1`));
}
function readSavedAnalyticsAllowed(categoryCode) {
    const activeGroupsAllowed = readCategoryFromActiveGroups(categoryCode);
    // OneTrust can publish an active-groups denial before its cookie write completes.
    if (activeGroupsAllowed === false)
        return false;
    const cookieAllowed = readCategoryFromCookie(categoryCode);
    if (cookieAllowed !== null)
        return cookieAllowed;
    if (activeGroupsAllowed !== null)
        return activeGroupsAllowed;
    // This integration is default-on: a missing saved choice is not an opt-out.
    return true;
}
function isPreferenceCenterOpen(preferenceCenter) {
    if (!preferenceCenter)
        return false;
    const ariaHidden = preferenceCenter.getAttribute('aria-hidden');
    if (ariaHidden === 'false')
        return true;
    if (ariaHidden === 'true')
        return false;
    const style = window.getComputedStyle(preferenceCenter);
    return style.display !== 'none' && style.visibility !== 'hidden';
}
function readPendingAnalyticsAllowed(preferenceCenter, categoryCode) {
    if (!preferenceCenter)
        return null;
    const toggle = preferenceCenter.querySelector(`#ot-group-id-${categoryCode} input[type="checkbox"]`);
    return toggle ? toggle.checked : null;
}
function isValidGa4MeasurementId(measurementId) {
    return measurementId.startsWith('G-');
}
function normalizeGaMeasurementIds(measurementIds) {
    return Array.from(new Set(measurementIds
        .map((measurementId) => measurementId.trim())
        .filter((measurementId) => measurementId.length > 0)
        .filter(isValidGa4MeasurementId)));
}
function readGaMeasurementIdsFromEnvironment() {
    var _a;
    const rawIds = (_a = process.env.NEXT_PUBLIC_GA4_IDS) !== null && _a !== void 0 ? _a : '';
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
function readGaMeasurementIdsFromGtagScripts() {
    var _a, _b;
    const detectedIds = [];
    for (const script of document.querySelectorAll('script[src*="gtag/js"]')) {
        try {
            const scriptUrl = new URL(script.src, window.location.origin);
            const measurementId = (_b = (_a = scriptUrl.searchParams.get('id')) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
            if (measurementId)
                detectedIds.push(measurementId);
        }
        catch {
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
function resolveGaMeasurementIds(configuredIds) {
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
function shouldDebugLog() {
    return Boolean(window.__ELECTRO_PRIVACY_DEBUG__);
}
function setGaRuntimeDisabled(measurementIds, disabled) {
    const windowWithGaFlags = window;
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
    if (!windowWithGtm.google_tag_manager)
        return;
    delete windowWithGtm.google_tag_manager[gtmId];
    if (Object.keys(windowWithGtm.google_tag_manager).length === 0) {
        delete windowWithGtm.google_tag_manager;
    }
}
export const browserNavigation = {
    reload() {
        window.location.reload();
    },
};
export function GtmConsentGate({ gtmId, gaMeasurementIds = [], performanceCode = DEFAULT_ANALYTICS_CODE, GoogleTagManager, }) {
    const [savedAnalyticsAllowed, setSavedAnalyticsAllowed] = useState(true);
    const [pendingAnalyticsAllowed, setPendingAnalyticsAllowed] = useState(null);
    const [preferenceCenterOpen, setPreferenceCenterOpen] = useState(false);
    const [hasLoadedGtm, setHasLoadedGtm] = useState(false);
    const pendingConsentChecksRef = useRef([]);
    const hasTriggeredReloadRef = useRef(false);
    const analyticsAllowed = preferenceCenterOpen
        ? (pendingAnalyticsAllowed !== null && pendingAnalyticsAllowed !== void 0 ? pendingAnalyticsAllowed : savedAnalyticsAllowed)
        : savedAnalyticsAllowed;
    const gaMeasurementIdsKey = gaMeasurementIds.join(',');
    useEffect(() => {
        if (!gtmId)
            return;
        const preferenceCenter = document.getElementById('onetrust-pc-sdk');
        const seenGtagScripts = new WeakSet();
        function clearPendingConsentChecks() {
            for (const timerId of pendingConsentChecksRef.current) {
                window.clearTimeout(timerId);
            }
            pendingConsentChecksRef.current = [];
        }
        function checkConsent() {
            const resolvedMeasurementIds = resolveGaMeasurementIds(gaMeasurementIds);
            const savedAllowed = readSavedAnalyticsAllowed(performanceCode);
            const isOpen = isPreferenceCenterOpen(preferenceCenter);
            const pendingAllowed = isOpen ? readPendingAnalyticsAllowed(preferenceCenter, performanceCode) : null;
            const effectiveAllowed = isOpen ? (pendingAllowed !== null && pendingAllowed !== void 0 ? pendingAllowed : savedAllowed) : savedAllowed;
            setSavedAnalyticsAllowed(savedAllowed);
            setPreferenceCenterOpen(isOpen);
            setPendingAnalyticsAllowed(pendingAllowed);
            setGaRuntimeDisabled(resolvedMeasurementIds, !effectiveAllowed);
            if (!effectiveAllowed && hasLoadedGtm) {
                teardownGtm(gtmId);
            }
            return effectiveAllowed;
        }
        function revokeSavedConsent() {
            if (hasTriggeredReloadRef.current)
                return;
            hasTriggeredReloadRef.current = true;
            setGaRuntimeDisabled(resolveGaMeasurementIds(gaMeasurementIds), true);
            teardownGtm(gtmId);
            browserNavigation.reload();
        }
        function handleConsentApplied() {
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
        function collectGtagScriptsFromNode(node) {
            const gtagScripts = [];
            if (node instanceof HTMLScriptElement && node.src.includes('gtag/js')) {
                gtagScripts.push(node);
            }
            if (!(node instanceof Element))
                return gtagScripts;
            for (const script of node.querySelectorAll('script[src*="gtag/js"]')) {
                gtagScripts.push(script);
            }
            return gtagScripts;
        }
        function handlePotentialGtagScript(script) {
            if (!script.src.includes('gtag/js'))
                return;
            if (seenGtagScripts.has(script))
                return;
            seenGtagScripts.add(script);
            checkConsent();
        }
        for (const script of document.querySelectorAll('script[src*="gtag/js"]')) {
            seenGtagScripts.add(script);
        }
        let observer;
        if (preferenceCenter) {
            observer = new MutationObserver(checkConsent);
            observer.observe(preferenceCenter, {
                attributes: true,
                attributeFilter: ['aria-hidden', 'style', 'class'],
                childList: true,
                subtree: true,
            });
        }
        let gtagScriptObserver;
        const gtagObserverCallback = (mutations) => {
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
            observer === null || observer === void 0 ? void 0 : observer.disconnect();
            gtagScriptObserver === null || gtagScriptObserver === void 0 ? void 0 : gtagScriptObserver.disconnect();
            window.removeEventListener('OneTrustGroupsUpdated', handleConsentApplied);
            window.removeEventListener('OneTrustPCLoaded', checkConsent);
            window.removeEventListener('OTConsentApplied', handleConsentApplied);
            setGaRuntimeDisabled(resolveGaMeasurementIds(gaMeasurementIds), true);
        };
    }, [gaMeasurementIdsKey, gtmId, hasLoadedGtm, performanceCode]);
    useEffect(() => {
        if (analyticsAllowed)
            setHasLoadedGtm(true);
    }, [analyticsAllowed]);
    if (!gtmId || !analyticsAllowed)
        return null;
    return _jsx(GoogleTagManager, { gtmId: gtmId });
}
