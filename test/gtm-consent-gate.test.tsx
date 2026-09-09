import React from 'react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { browserNavigation, GtmConsentGate } from '../src/js/gtm-consent-gate';

const GoogleTagManager = ({ gtmId }: { gtmId: string }) => <div data-testid="gtm">{gtmId}</div>;
const createMeasurementId = (): string => `G-${crypto.randomUUID().replaceAll('-', '')}`;
const defaultMeasurementId = createMeasurementId();
const immediateMeasurementId = createMeasurementId();
const invalidMeasurementId = 'UA-invalid';
const gaDisableKey = `ga-disable-${defaultMeasurementId}`;
const immediateGaDisableKey = `ga-disable-${immediateMeasurementId}`;

function setSavedAnalytics(allowed: boolean, performanceCode = 'C0002'): void {
  document.cookie = `OptanonConsent=groups=C0001:1,${performanceCode}:${allowed ? '1' : '0'}; path=/`;
}

function setPreferenceCenter(
  open: boolean,
  analyticsAllowed = true,
  performanceCode = 'C0002'
): HTMLInputElement {
  let preferenceCenter = document.getElementById('onetrust-pc-sdk');
  if (!preferenceCenter) {
    preferenceCenter = document.createElement('div');
    preferenceCenter.id = 'onetrust-pc-sdk';
    preferenceCenter.innerHTML = `<div id="ot-group-id-${performanceCode}"><input type="checkbox"></div>`;
    document.body.appendChild(preferenceCenter);
  }

  preferenceCenter.setAttribute('aria-hidden', open ? 'false' : 'true');
  const toggle = preferenceCenter.querySelector<HTMLInputElement>('input')!;
  toggle.checked = analyticsAllowed;
  return toggle;
}

describe('GtmConsentGate', () => {
  let reloadSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    document.cookie = 'OptanonConsent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.getElementById('onetrust-pc-sdk')?.remove();
    for (const gtagScript of document.querySelectorAll<HTMLScriptElement>('script[src*="gtag/js"]')) {
      gtagScript.remove();
    }
    (window as Window & { OnetrustActiveGroups?: string; OptanonActiveGroups?: string }).OnetrustActiveGroups = '';
    (window as Window & { OptanonActiveGroups?: string }).OptanonActiveGroups = '';
    (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer = [];
    (window as Window & Record<string, unknown>)[gaDisableKey] = undefined;
    (window as Window & Record<string, unknown>)[immediateGaDisableKey] = undefined;
    reloadSpy = vi.spyOn(browserNavigation, 'reload').mockImplementation(() => undefined);
  });

  afterEach(() => {
    reloadSpy.mockRestore();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  test('loads GTM by default when no saved opt-out exists', async () => {
    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);

    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(false);
  });

  test('allows GTM when OptanonActiveGroups contains the bare analytics category', async () => {
    window.OptanonActiveGroups = ',C0001,C0002,';
    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);

    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(false);
  });

  test('uses OnetrustActiveGroups as the primary active-groups source', async () => {
    window.OnetrustActiveGroups = ',C0001,C0002,';
    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);

    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));
  });

  test('denies GTM when OnetrustActiveGroups omits analytics', () => {
    window.OnetrustActiveGroups = ',C0001,';
    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);

    expect(screen.queryByTestId('gtm')).toBeNull();
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(true);
  });

  test('preserves unrelated active groups when the primary global is empty during pause', async () => {
    setSavedAnalytics(true);
    window.OnetrustActiveGroups = '';
    window.OptanonActiveGroups = 'C0001,C0002,C0004';
    const toggle = setPreferenceCenter(true, true);
    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));

    act(() => {
      toggle.checked = false;
      window.dispatchEvent(new Event('OneTrustGroupsUpdated'));
    });

    await waitFor(() => expect(screen.queryByTestId('gtm')).toBeNull());
    const dataLayer = window.dataLayer ?? [];
    const events = dataLayer.filter((entry) => entry.event === 'OneTrustGroupsUpdated');
    const latestEvent = events[events.length - 1];
    expect(latestEvent).toMatchObject({
      event: 'OneTrustGroupsUpdated',
      OneTrustActiveGroups: ',C0001,C0004,',
    });
    expect(latestEvent?.OneTrustActiveGroups).not.toContain('C0002');
    expect(latestEvent?.OneTrustActiveGroups).not.toBe('');
  });

  test('treats a whitespace-only primary active-group global as empty', async () => {
    setSavedAnalytics(true);
    window.OnetrustActiveGroups = ' ';
    window.OptanonActiveGroups = 'C0001,C0002';
    const toggle = setPreferenceCenter(true, true);
    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));

    act(() => {
      toggle.checked = false;
      window.dispatchEvent(new Event('OneTrustGroupsUpdated'));
    });

    await waitFor(() => expect(screen.queryByTestId('gtm')).toBeNull());
    const dataLayer = window.dataLayer ?? [];
    const events = dataLayer.filter((entry) => entry.event === 'OneTrustGroupsUpdated');
    const latestEvent = events[events.length - 1];
    expect(latestEvent?.OneTrustActiveGroups).toBe(',C0001,');
  });

  test('uses a non-empty primary active-group global over the fallback', async () => {
    setSavedAnalytics(true);
    window.OnetrustActiveGroups = 'C0001,C0002';
    window.OptanonActiveGroups = 'C0004';
    const toggle = setPreferenceCenter(true, true);
    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));

    act(() => {
      toggle.checked = false;
      window.dispatchEvent(new Event('OneTrustGroupsUpdated'));
    });

    await waitFor(() => expect(screen.queryByTestId('gtm')).toBeNull());
    const dataLayer = window.dataLayer ?? [];
    const events = dataLayer.filter((entry) => entry.event === 'OneTrustGroupsUpdated');
    const latestEvent = events[events.length - 1];
    expect(latestEvent?.OneTrustActiveGroups).toBe(',C0001,');
    expect(latestEvent?.OneTrustActiveGroups).not.toContain('C0004');
  });

  test('denies GTM when OptanonActiveGroups omits the analytics category', () => {
    window.OptanonActiveGroups = ',C0001,';
    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);

    expect(screen.queryByTestId('gtm')).toBeNull();
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(true);
  });

  test('falls through when OptanonActiveGroups is empty or undefined', async () => {
    window.OptanonActiveGroups = '';
    setSavedAnalytics(true);
    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);

    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));
  });

  test('parses only exact cookie consent tokens', () => {
    document.cookie = 'OptanonConsent=groups=C0001:1,C0002:0; path=/';
    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);
    expect(screen.queryByTestId('gtm')).toBeNull();
    cleanup();

    window.OptanonActiveGroups = ',C0001,';
    document.cookie = 'OptanonConsent=groups=C0001:1,C0002:10; path=/';
    render(<GtmConsentGate gtmId="GTM-TEST-2" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);
    expect(screen.queryByTestId('gtm')).toBeNull();
  });

  test('reads OptanonConsent when it is not the first cookie', () => {
    document.cookie = 'OptanonAlertBoxClosed=2026-01-01; path=/';
    document.cookie = 'OptanonConsent=groups=C0001:1,C0002:0; path=/';
    window.OptanonActiveGroups = '';

    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);

    expect(screen.queryByTestId('gtm')).toBeNull();
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(true);
  });

  test('ignores decoy cookie names and malformed cookie segments', async () => {
    document.cookie = 'XOptanonConsent=groups=C0001:1,C0002:0; path=/';
    document.cookie = 'OptanonConsent=groups=C0001:1,C0002:1; path=/';
    window.OptanonActiveGroups = '';

    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);

    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(false);
  });

  test('does not load GTM after a saved analytics opt-out', () => {
    setSavedAnalytics(false);
    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);

    expect(screen.queryByTestId('gtm')).toBeNull();
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(true);
  });

  test('does not access process when it is unavailable in a browser runtime', async () => {
    vi.stubGlobal('process', undefined);
    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);

    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(false);
  });

  test('does not reload on OTConsentApplied when a saved analytics opt-out already exists on initialization', async () => {
    setSavedAnalytics(false);

    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);

    expect(screen.queryByTestId('gtm')).toBeNull();
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(true);

    vi.useFakeTimers();
    act(() => {
      window.dispatchEvent(new Event('OTConsentApplied'));
      window.dispatchEvent(new Event('OneTrustGroupsUpdated'));
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(reloadSpy).not.toHaveBeenCalled();
    expect(screen.queryByTestId('gtm')).toBeNull();
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(true);
  });

  test('suppresses GTM immediately for a pending analytics opt-out', async () => {
    setSavedAnalytics(true);
    const toggle = setPreferenceCenter(true, true);
    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => expect(screen.queryByTestId('gtm')).not.toBeNull());

    act(() => {
      toggle.checked = false;
      toggle.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await waitFor(() => expect(screen.queryByTestId('gtm')).toBeNull());
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(true);
    expect(reloadSpy).not.toHaveBeenCalled();
    expect(document.cookie).toContain('C0002:1');
  });

  test('keeps a cached GTM script during an unsaved opt-out and restores it on close', async () => {
    setSavedAnalytics(true);
    const toggle = setPreferenceCenter(true, true);
    let cachedScript: HTMLScriptElement | undefined;
    let scriptInsertions = 0;
    const CachedGoogleTagManager = ({ gtmId }: { gtmId: string }) => {
      if (!cachedScript) {
        cachedScript = document.createElement('script');
        cachedScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
        document.body.appendChild(cachedScript);
        scriptInsertions += 1;
      }
      return <div data-testid="gtm">{gtmId}</div>;
    };

    render(
      <GtmConsentGate
        gtmId="GTM-TEST"
        gaMeasurementIds={[defaultMeasurementId]}
        GoogleTagManager={CachedGoogleTagManager}
      />
    );
    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));
    expect(cachedScript?.isConnected).toBe(true);
    expect(scriptInsertions).toBe(1);

    act(() => {
      toggle.checked = false;
      toggle.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await waitFor(() => expect(screen.queryByTestId('gtm')).toBeNull());
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(true);
    expect(reloadSpy).not.toHaveBeenCalled();
    expect(cachedScript?.isConnected).toBe(true);

    act(() => {
      setPreferenceCenter(false);
    });

    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));
    expect(cachedScript?.isConnected).toBe(true);
    expect(scriptInsertions).toBe(1);
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(false);
    const dataLayer = window.dataLayer ?? [];
    expect(dataLayer[dataLayer.length - 1]?.OneTrustActiveGroups).toBe(',C0001,C0002,');
  });

  test('does not grant a saved opt-out when the pending Preference Center toggle is checked', async () => {
    setSavedAnalytics(false);
    window.OnetrustActiveGroups = ',C0001,';
    const toggle = setPreferenceCenter(true, false);
    expect(document.cookie).toContain('C0002:0');
    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => {
      expect(screen.queryByTestId('gtm')).toBeNull();
      expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(true);
    });

    act(() => {
      toggle.click();
      toggle.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(screen.queryByTestId('gtm')).toBeNull();
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(true);
  });

  test('honors a custom performance category for cookie, toggle, and pause behavior', async () => {
    const customMeasurementId = createMeasurementId();
    const customGaDisableKey = `ga-disable-${customMeasurementId}`;
    setSavedAnalytics(true, 'C0003');
    window.OnetrustActiveGroups = 'C0001,C0003';
    const toggle = setPreferenceCenter(true, true, 'C0003');

    render(
      <GtmConsentGate
        gtmId="GTM-TEST"
        gaMeasurementIds={[customMeasurementId]}
        performanceCode="C0003"
        GoogleTagManager={GoogleTagManager}
      />
    );
    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));

    act(() => {
      toggle.checked = false;
      toggle.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await waitFor(() => expect(screen.queryByTestId('gtm')).toBeNull());
    expect((window as Window & Record<string, unknown>)[customGaDisableKey]).toBe(true);
    expect(reloadSpy).not.toHaveBeenCalled();
    const events = (window.dataLayer ?? []).filter((entry) => entry.event === 'OneTrustGroupsUpdated');
    expect(events[events.length - 1]).toMatchObject({
      OneTrustActiveGroups: ',C0001,',
    });
  });

  test('pauses an initialized GTM dataLayer listener for a pending opt-out', async () => {
    setSavedAnalytics(true);
    const toggle = setPreferenceCenter(true, true);
    const dataLayer = (window as Window & { dataLayer: Array<Record<string, unknown>> }).dataLayer;
    const listener = vi.fn();
    const originalPush = dataLayer.push.bind(dataLayer);
    dataLayer.push = (...events) => {
      events.forEach((event) => listener(event));
      return originalPush(...events);
    };

    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => expect(screen.queryByTestId('gtm')).not.toBeNull());

    act(() => {
      toggle.checked = false;
      window.dispatchEvent(new Event('OneTrustGroupsUpdated'));
    });

    await waitFor(() => expect(listener).toHaveBeenCalledWith(expect.objectContaining({ event: 'OneTrustGroupsUpdated' })));
    expect(screen.queryByTestId('gtm')).toBeNull();
  });

  test('does not collect GA events after an unsaved opt-out and does not reload', async () => {
    setSavedAnalytics(true);
    const toggle = setPreferenceCenter(true, true);
    const dataLayer = (window as Window & { dataLayer: Array<Record<string, unknown>> }).dataLayer;
    const collectedEvents: Record<string, unknown>[] = [];
    dataLayer.push = (...events) => {
      for (const event of events) {
        if (!(window as Window & Record<string, unknown>)[gaDisableKey]) collectedEvents.push(event);
      }
      return dataLayer.length;
    };

    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => expect(screen.queryByTestId('gtm')).not.toBeNull());
    collectedEvents.length = 0;

    act(() => {
      toggle.checked = false;
      window.dispatchEvent(new Event('OneTrustGroupsUpdated'));
    });
    dataLayer.push({ event: 'ga4_collect' });

    expect(reloadSpy).not.toHaveBeenCalled();
    expect(collectedEvents).toEqual([]);
    expect(document.cookie).toContain('C0002:1');
  });

  test('disables every valid GA4 ID immediately when OneTrust reports a pending opt-out', async () => {
    setSavedAnalytics(true);
    const toggle = setPreferenceCenter(true, true);
    render(
      <GtmConsentGate
        gtmId="GTM-TEST"
        gaMeasurementIds={[immediateMeasurementId, defaultMeasurementId, invalidMeasurementId]}
        GoogleTagManager={GoogleTagManager}
      />
    );
    await waitFor(() => expect(screen.queryByTestId('gtm')).not.toBeNull());

    act(() => {
      toggle.checked = false;
      window.dispatchEvent(new Event('OneTrustGroupsUpdated'));
    });

    expect((window as Window & Record<string, unknown>)[immediateGaDisableKey]).toBe(true);
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(true);
    expect((window as Window & Record<string, unknown>)[`ga-disable-${invalidMeasurementId}`]).toBeUndefined();
  });

  test('derives GA4 IDs from gtag scripts and disables them before save on pending opt-out', async () => {
    const derivedMeasurementId = createMeasurementId();
    const derivedDisableKey = `ga-disable-${derivedMeasurementId}`;

    setSavedAnalytics(true);
    const toggle = setPreferenceCenter(true, true);
    const gtagScript = document.createElement('script');
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${derivedMeasurementId}`;
    document.body.appendChild(gtagScript);

    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => expect(screen.queryByTestId('gtm')).not.toBeNull());

    act(() => {
      toggle.checked = false;
      window.dispatchEvent(new Event('OneTrustGroupsUpdated'));
    });

    expect((window as Window & Record<string, unknown>)[derivedDisableKey]).toBe(true);
  });

  test('detects a gtag script inserted after mount while consent is denied', async () => {
    const lateMeasurementId = createMeasurementId();
    const lateDisableKey = `ga-disable-${lateMeasurementId}`;
    setSavedAnalytics(true);
    const toggle = setPreferenceCenter(true, true);

    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));

    act(() => {
      toggle.checked = false;
      toggle.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => expect(screen.queryByTestId('gtm')).toBeNull());

    const lateScript = document.createElement('script');
    lateScript.src = `https://www.googletagmanager.com/gtag/js?id=${lateMeasurementId}`;
    document.body.appendChild(lateScript);

    await waitFor(() => expect((window as Window & Record<string, unknown>)[lateDisableKey]).toBe(true));
  });

  test('detects a gtag script src assigned after mount while consent is denied', async () => {
    const lateMeasurementId = createMeasurementId();
    const lateDisableKey = `ga-disable-${lateMeasurementId}`;
    setSavedAnalytics(true);
    const toggle = setPreferenceCenter(true, true);

    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));

    act(() => {
      toggle.checked = false;
      toggle.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await waitFor(() => expect(screen.queryByTestId('gtm')).toBeNull());

    const lateScript = document.createElement('script');
    document.body.appendChild(lateScript);
    lateScript.src = `https://www.googletagmanager.com/gtag/js?id=${lateMeasurementId}`;

    await waitFor(() => expect((window as Window & Record<string, unknown>)[lateDisableKey]).toBe(true));
  });

  test('reads NEXT_PUBLIC_GA4_IDS and disables each ID before save on pending opt-out', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA4_IDS', 'G-TEST123');
    const derivedDisableKey = 'ga-disable-G-TEST123';

    setSavedAnalytics(true);
    const toggle = setPreferenceCenter(true, true);

    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => expect(screen.queryByTestId('gtm')).not.toBeNull());

    act(() => {
      toggle.checked = false;
      window.dispatchEvent(new Event('OneTrustGroupsUpdated'));
    });

    expect((window as Window & Record<string, unknown>)[derivedDisableKey]).toBe(true);
  });

  test('restores the saved state when the preference center closes without saving', async () => {
    setSavedAnalytics(true);
    setPreferenceCenter(true, false);
    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    expect(screen.queryByTestId('gtm')).toBeNull();

    act(() => setPreferenceCenter(false));
    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));
  });

  test('tears down only the configured GTM container after a saved opt-out', async () => {
    setSavedAnalytics(true);
    document.body.innerHTML += '<script src="https://www.googletagmanager.com/gtm.js?id=GTM-TEST"></script>';
    document.body.innerHTML += '<script src="https://www.googletagmanager.com/gtm.js?id=GTM-TEST2"></script>';
    document.body.innerHTML += '<script src="https://www.googletagmanager.com/gtm.js?id=GTM-OTHER"></script>';
    const nextGtm = document.createElement('script');
    nextGtm.id = '_next-gtm';
    nextGtm.dataset.gtmId = 'GTM-OTHER';
    nextGtm.textContent = '"GTM-OTHER"';
    document.body.appendChild(nextGtm);
    const nextOther = document.createElement('script');
    nextOther.id = '_next-gtm-init';
    nextOther.dataset.gtmId = 'GTM-TEST';
    nextOther.textContent = '"GTM-TEST"';
    document.body.appendChild(nextOther);
    (window as Window & { google_tag_manager?: Record<string, unknown> }).google_tag_manager = {
      'GTM-TEST': {},
      'GTM-OTHER': {},
    };
    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => expect(screen.queryByTestId('gtm')).not.toBeNull());

    vi.useFakeTimers();
    setSavedAnalytics(false);
    act(() => window.dispatchEvent(new Event('OTConsentApplied')));
    await act(async () => vi.advanceTimersByTimeAsync(0));

    expect(reloadSpy).toHaveBeenCalledOnce();
    const remainingGtmIds = Array.from(document.querySelectorAll<HTMLScriptElement>('script[src]'))
      .map((script) => new URL(script.src).searchParams.get('id'))
      .filter(Boolean);
    expect(remainingGtmIds).toEqual(expect.arrayContaining(['GTM-TEST2', 'GTM-OTHER']));
    expect(remainingGtmIds).not.toContain('GTM-TEST');
    expect(document.getElementById('_next-gtm')).not.toBeNull();
    expect(document.getElementById('_next-gtm-init')).toBeNull();
    expect((window as Window & { google_tag_manager?: Record<string, unknown> }).google_tag_manager).toEqual({
      'GTM-OTHER': {},
    });
  });

  test('blocks queued GA collection on the saved opt-out reload path', async () => {
    const collectedEvents: Record<string, unknown>[] = [];
    const dataLayer = (window as Window & { dataLayer: Array<Record<string, unknown>> }).dataLayer;
    const originalPush = dataLayer.push.bind(dataLayer);
    dataLayer.push = (...events) => {
      for (const event of events) {
        if (!(window as Window & Record<string, unknown>)[gaDisableKey]) collectedEvents.push(event);
      }
      return originalPush(...events);
    };
    setSavedAnalytics(true);
    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => expect(screen.queryByTestId('gtm')).not.toBeNull());
    collectedEvents.length = 0;

    setSavedAnalytics(false);
    act(() => window.dispatchEvent(new Event('OTConsentApplied')));

    expect(reloadSpy).toHaveBeenCalledOnce();
    dataLayer.push({ event: 'ga4_collect_after_reload' });
    expect(collectedEvents).toEqual([]);
  });

  test('detects a delayed saved opt-out after OTConsentApplied', async () => {
    setSavedAnalytics(true);
    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => expect(screen.queryByTestId('gtm')).not.toBeNull());

    vi.useFakeTimers();
    act(() => window.dispatchEvent(new Event('OTConsentApplied')));
    setSavedAnalytics(false);
    await act(async () => vi.advanceTimersByTimeAsync(150));

    expect(reloadSpy).toHaveBeenCalledOnce();
  });

  test('rechecks a Preference Center that is added after the gate mounts', async () => {
    setSavedAnalytics(true);
    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));

    const toggle = setPreferenceCenter(true, false);
    act(() => window.dispatchEvent(new Event('OneTrustPCLoaded')));

    await waitFor(() => expect(screen.queryByTestId('gtm')).toBeNull());
    expect(toggle.checked).toBe(false);
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(true);
  });

  test('reloads after a saved denial changes while the Preference Center is open', async () => {
    setSavedAnalytics(true);
    setPreferenceCenter(true, true);
    render(<GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={[defaultMeasurementId]} GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));

    vi.useFakeTimers();
    act(() => {
      setSavedAnalytics(false);
      window.dispatchEvent(new Event('OTConsentApplied'));
    });
    expect(reloadSpy).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1600));
    expect(reloadSpy).not.toHaveBeenCalled();

    await act(async () => {
      setPreferenceCenter(false);
      await Promise.resolve();
    });

    expect(reloadSpy).toHaveBeenCalledOnce();
  });

  test('denial dominates shared GA4 ownership', async () => {
    const sharedMeasurementId = createMeasurementId();
    const sharedDisableKey = `ga-disable-${sharedMeasurementId}`;
    setSavedAnalytics(true);
    const toggle = setPreferenceCenter(true, true);

    render(
      <>
        <GtmConsentGate
          gtmId="GTM-TEST"
          gaMeasurementIds={[sharedMeasurementId]}
          GoogleTagManager={GoogleTagManager}
        />
        <GtmConsentGate
          gtmId="GTM-OTHER"
          gaMeasurementIds={[sharedMeasurementId]}
          performanceCode="C0003"
          GoogleTagManager={GoogleTagManager}
        />
      </>
    );
    await waitFor(() => expect(screen.getAllByTestId('gtm')).toHaveLength(2));

    act(() => {
      toggle.checked = false;
      window.dispatchEvent(new Event('OneTrustGroupsUpdated'));
    });

    expect((window as Window & Record<string, unknown>)[sharedDisableKey]).toBe(true);
    const collectedEvents: Record<string, unknown>[] = [];
    const dataLayer = (window as Window & { dataLayer: Array<Record<string, unknown>> }).dataLayer;
    dataLayer.push = (...events) => {
      if (!(window as Window & Record<string, unknown>)[sharedDisableKey]) collectedEvents.push(...events);
      return dataLayer.length;
    };
    dataLayer.push({ event: 'shared_ga_collect' });
    expect(collectedEvents).toEqual([]);
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  test('preserves an external ga-disable baseline through mount and unmount', async () => {
    const baselineMeasurementId = createMeasurementId();
    const baselineFlag = `ga-disable-${baselineMeasurementId}`;
    (window as Window & Record<string, unknown>)[baselineFlag] = true;

    const { unmount } = render(
      <GtmConsentGate
        gtmId="GTM-TEST"
        gaMeasurementIds={[baselineMeasurementId]}
        GoogleTagManager={GoogleTagManager}
      />
    );
    await waitFor(() => expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST'));

    expect((window as Window & Record<string, unknown>)[baselineFlag]).toBe(true);
    unmount();
    expect((window as Window & Record<string, unknown>)[baselineFlag]).toBe(true);
    delete (window as Window & Record<string, unknown>)[baselineFlag];
  });
});
