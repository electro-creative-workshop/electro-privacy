'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
const DEFAULT_ANALYTICS_CODE = 'C0002';
const CONSENT_RECHECK_DELAYS_MS = [0, 150, 600, 1500];
const gaRuntimeOwners = new Map();
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
    const category = groupsMatch === null || groupsMatch === void 0 ? void 0 : groupsMatch[1].split(',').find((group) => group === `${categoryCode}:1` || group === `${categoryCode}:0`);
    if (!category)
        return null;
    return category === `${categoryCode}:1`;
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
    return groups.includes(categoryCode);
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
    var _a, _b;
    const rawIds = typeof process !== 'undefined' ? (_b = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.NEXT_PUBLIC_GA4_IDS) !== null && _b !== void 0 ? _b : '' : '';
    if (!rawIds)
        return [];
    return normalizeGaMeasurementIds(rawIds.split(','));
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
    return normalizedIds;
}
function resolveGaMeasurementIds(configuredIds) {
    const explicitIds = normalizeGaMeasurementIds(configuredIds);
    const environmentIds = readGaMeasurementIdsFromEnvironment();
    const combinedIds = Array.from(new Set([...explicitIds, ...environmentIds]));
    const fallbackIds = combinedIds.length === 0 ? readGaMeasurementIdsFromGtagScripts() : [];
    return combinedIds.length > 0 ? combinedIds : fallbackIds;
}
function syncGaRuntimeOwnership(ownerId, measurementIds, disabled) {
    const windowWithGaFlags = window;
    const nextIds = new Set(measurementIds.filter(isValidGa4MeasurementId));
    for (const [measurementId, owners] of gaRuntimeOwners) {
        if (nextIds.has(measurementId))
            continue;
        const owner = owners.get(ownerId);
        if (!owner)
            continue;
        owners.delete(ownerId);
        if (owners.size === 0) {
            const flagName = `ga-disable-${measurementId}`;
            if (owner.hadPreviousValue) {
                windowWithGaFlags[flagName] = owner.previousValue;
            }
            else {
                delete windowWithGaFlags[flagName];
            }
            gaRuntimeOwners.delete(measurementId);
        }
        else {
            const flagName = `ga-disable-${measurementId}`;
            windowWithGaFlags[flagName] = Array.from(owners.values()).every((entry) => entry.disabled);
        }
    }
    for (const measurementId of measurementIds) {
        if (!isValidGa4MeasurementId(measurementId))
            continue;
        let owners = gaRuntimeOwners.get(measurementId);
        if (!owners) {
            owners = new Map();
            gaRuntimeOwners.set(measurementId, owners);
        }
        if (!owners.has(ownerId)) {
            const flagName = `ga-disable-${measurementId}`;
            owners.set(ownerId, {
                disabled,
                previousValue: windowWithGaFlags[flagName],
                hadPreviousValue: Object.prototype.hasOwnProperty.call(windowWithGaFlags, flagName),
            });
        }
        else {
            owners.get(ownerId).disabled = disabled;
        }
        const flagName = `ga-disable-${measurementId}`;
        windowWithGaFlags[flagName] = Array.from(owners.values()).every((owner) => owner.disabled);
    }
}
function releaseGaRuntimeOwnership(ownerId) {
    const windowWithGaFlags = window;
    for (const [measurementId, owners] of gaRuntimeOwners) {
        const owner = owners.get(ownerId);
        if (!owner)
            continue;
        owners.delete(ownerId);
        const flagName = `ga-disable-${measurementId}`;
        if (owners.size === 0) {
            if (owner.hadPreviousValue) {
                windowWithGaFlags[flagName] = owner.previousValue;
            }
            else {
                delete windowWithGaFlags[flagName];
            }
            gaRuntimeOwners.delete(measurementId);
        }
        else {
            windowWithGaFlags[flagName] = Array.from(owners.values()).every((entry) => entry.disabled);
        }
    }
}
function pauseGtm(performanceCode) {
    var _a;
    const windowWithGtm = window;
    (_a = windowWithGtm.dataLayer) !== null && _a !== void 0 ? _a : (windowWithGtm.dataLayer = []);
    // Best-effort signal for consent-mode-aware tags; GA suppression uses ga-disable-*.
    windowWithGtm.dataLayer.push({
        event: 'OneTrustGroupsUpdated',
        OneTrustActiveGroups: `C0001:1,${performanceCode}:0`,
    });
}
function teardownGtm(gtmId, ownedScripts) {
    for (const script of ownedScripts)
        script.remove();
    for (const script of document.querySelectorAll('script[src]')) {
        try {
            const scriptUrl = new URL(script.src, window.location.origin);
            if (scriptUrl.hostname === 'www.googletagmanager.com' &&
                scriptUrl.pathname === '/gtm.js' &&
                scriptUrl.searchParams.get('id') === gtmId) {
                script.remove();
            }
        }
        catch {
            // Ignore malformed script src values.
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
    const [savedAnalyticsAllowed, setSavedAnalyticsAllowed] = useState(false);
    const [pendingAnalyticsAllowed, setPendingAnalyticsAllowed] = useState(null);
    const [preferenceCenterOpen, setPreferenceCenterOpen] = useState(false);
    const [hasCheckedConsent, setHasCheckedConsent] = useState(false);
    const pendingConsentChecksRef = useRef([]);
    const hasTriggeredReloadRef = useRef(false);
    const previousSavedAllowedRef = useRef(null);
    const pendingSavedDenialRef = useRef(false);
    const hasLoadedGtmRef = useRef(false);
    const gaOwnerIdRef = useRef(Symbol());
    const analyticsAllowed = preferenceCenterOpen
        ? (pendingAnalyticsAllowed !== null && pendingAnalyticsAllowed !== void 0 ? pendingAnalyticsAllowed : savedAnalyticsAllowed)
        : savedAnalyticsAllowed;
    const gaMeasurementIdsKey = gaMeasurementIds.join(',');
    useEffect(() => {
        if (!gtmId)
            return;
        const seenGtagScripts = new WeakSet();
        const ownedGtmScripts = new Set();
        let preferenceCenter = null;
        let preferenceCenterObserver;
        function attachPreferenceCenterObserver() {
            const nextPreferenceCenter = document.getElementById('onetrust-pc-sdk');
            if (preferenceCenter === nextPreferenceCenter && preferenceCenterObserver)
                return;
            preferenceCenterObserver === null || preferenceCenterObserver === void 0 ? void 0 : preferenceCenterObserver.disconnect();
            preferenceCenter = nextPreferenceCenter;
            preferenceCenterObserver = undefined;
            if (!preferenceCenter)
                return;
            preferenceCenterObserver = new MutationObserver(checkConsent);
            preferenceCenterObserver.observe(preferenceCenter, {
                attributes: true,
                attributeFilter: ['aria-hidden', 'style', 'class'],
                childList: true,
                subtree: true,
            });
        }
        function clearPendingConsentChecks() {
            for (const timerId of pendingConsentChecksRef.current) {
                window.clearTimeout(timerId);
            }
            pendingConsentChecksRef.current = [];
        }
        function checkConsent() {
            attachPreferenceCenterObserver();
            const resolvedMeasurementIds = resolveGaMeasurementIds(gaMeasurementIds);
            const savedAllowed = readSavedAnalyticsAllowed(performanceCode);
            const isOpen = isPreferenceCenterOpen(preferenceCenter);
            const pendingAllowed = isOpen ? readPendingAnalyticsAllowed(preferenceCenter, performanceCode) : null;
            const effectiveAllowed = isOpen ? (pendingAllowed !== null && pendingAllowed !== void 0 ? pendingAllowed : savedAllowed) : savedAllowed;
            const previousSavedAllowed = previousSavedAllowedRef.current;
            const savedBecameDenied = previousSavedAllowed === true && savedAllowed === false;
            previousSavedAllowedRef.current = savedAllowed;
            if (savedBecameDenied)
                pendingSavedDenialRef.current = true;
            if (savedAllowed)
                pendingSavedDenialRef.current = false;
            setSavedAnalyticsAllowed(savedAllowed);
            setPreferenceCenterOpen(isOpen);
            setPendingAnalyticsAllowed(pendingAllowed);
            syncGaRuntimeOwnership(gaOwnerIdRef.current, resolvedMeasurementIds, !effectiveAllowed);
            setHasCheckedConsent(true);
            if (!effectiveAllowed && hasLoadedGtmRef.current) {
                pauseGtm(performanceCode);
                teardownGtm(gtmId, ownedGtmScripts);
            }
            return {
                effectiveAllowed,
                savedBecameDenied,
            };
        }
        function revokeSavedConsent() {
            if (hasTriggeredReloadRef.current)
                return;
            hasTriggeredReloadRef.current = true;
            syncGaRuntimeOwnership(gaOwnerIdRef.current, resolveGaMeasurementIds(gaMeasurementIds), true);
            teardownGtm(gtmId, ownedGtmScripts);
            browserNavigation.reload();
        }
        function handleConsentApplied() {
            clearPendingConsentChecks();
            const immediateResult = checkConsent();
            if (!immediateResult.effectiveAllowed &&
                pendingSavedDenialRef.current &&
                !isPreferenceCenterOpen(preferenceCenter) &&
                hasLoadedGtmRef.current) {
                revokeSavedConsent();
            }
            for (const delay of CONSENT_RECHECK_DELAYS_MS) {
                const timerId = window.setTimeout(() => {
                    const { effectiveAllowed } = checkConsent();
                    if (!effectiveAllowed &&
                        pendingSavedDenialRef.current &&
                        !isPreferenceCenterOpen(preferenceCenter) &&
                        hasLoadedGtmRef.current) {
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
        function registerOwnedGtmScripts() {
            for (const script of document.querySelectorAll('script')) {
                const scriptUrl = (() => {
                    try {
                        return new URL(script.src, window.location.origin);
                    }
                    catch {
                        return null;
                    }
                })();
                const isConfiguredGtmScript = (scriptUrl === null || scriptUrl === void 0 ? void 0 : scriptUrl.hostname) === 'www.googletagmanager.com' &&
                    scriptUrl.pathname === '/gtm.js' &&
                    scriptUrl.searchParams.get('id') === gtmId;
                const isExplicitlyOwnedScript = script.dataset.gtmId === gtmId;
                if (isConfiguredGtmScript || isExplicitlyOwnedScript)
                    ownedGtmScripts.add(script);
            }
        }
        for (const script of document.querySelectorAll('script[src*="gtag/js"]')) {
            seenGtagScripts.add(script);
        }
        registerOwnedGtmScripts();
        let observer;
        if (document.body) {
            observer = new MutationObserver(() => {
                if (preferenceCenter !== document.getElementById('onetrust-pc-sdk'))
                    checkConsent();
            });
            observer.observe(document.body, { childList: true, subtree: true });
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
                    registerOwnedGtmScripts();
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
            preferenceCenterObserver === null || preferenceCenterObserver === void 0 ? void 0 : preferenceCenterObserver.disconnect();
            gtagScriptObserver === null || gtagScriptObserver === void 0 ? void 0 : gtagScriptObserver.disconnect();
            window.removeEventListener('OneTrustGroupsUpdated', handleConsentApplied);
            window.removeEventListener('OneTrustPCLoaded', checkConsent);
            window.removeEventListener('OTConsentApplied', handleConsentApplied);
            releaseGaRuntimeOwnership(gaOwnerIdRef.current);
        };
    }, [gaMeasurementIdsKey, gtmId, performanceCode]);
    useEffect(() => {
        if (analyticsAllowed)
            hasLoadedGtmRef.current = true;
    }, [analyticsAllowed]);
    if (!gtmId || !hasCheckedConsent || !analyticsAllowed)
        return null;
    return _jsx(GoogleTagManager, { gtmId: gtmId });
}
