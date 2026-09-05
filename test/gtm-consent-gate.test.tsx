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

function setSavedAnalytics(allowed: boolean): void {
  document.cookie = `OptanonConsent=groups=C0001:1,C0002:${allowed ? '1' : '0'}; path=/`;
}

function setPreferenceCenter(open: boolean, analyticsAllowed = true): HTMLInputElement {
  let preferenceCenter = document.getElementById('onetrust-pc-sdk');
  if (!preferenceCenter) {
    preferenceCenter = document.createElement('div');
    preferenceCenter.id = 'onetrust-pc-sdk';
    preferenceCenter.innerHTML = '<div id="ot-group-id-C0002"><input type="checkbox"></div>';
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
      document.getElementById('ot-group-id-C0002')?.append(document.createElement('span'));
    });

    await waitFor(() => expect(screen.queryByTestId('gtm')).toBeNull());
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(true);
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

    act(() => {
      setSavedAnalytics(false);
      window.dispatchEvent(new Event('OTConsentApplied'));
    });
    expect(reloadSpy).not.toHaveBeenCalled();

    act(() => {
      setPreferenceCenter(false);
      window.dispatchEvent(new Event('OneTrustGroupsUpdated'));
    });

    expect(reloadSpy).toHaveBeenCalledOnce();
  });

  test('keeps a shared GA4 ID enabled while another gate remains allowed', async () => {
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

    expect((window as Window & Record<string, unknown>)[sharedDisableKey]).toBe(false);
    expect(reloadSpy).not.toHaveBeenCalled();
  });
});
