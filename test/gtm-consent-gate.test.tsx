import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
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
    (window as Window & Record<string, unknown>)[gaDisableKey] = undefined;
    (window as Window & Record<string, unknown>)[immediateGaDisableKey] = undefined;
    reloadSpy = vi.spyOn(browserNavigation, 'reload').mockImplementation(() => undefined);
  });

  afterEach(() => {
    reloadSpy.mockRestore();
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  test('loads GTM by default when no saved opt-out exists', async () => {
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
    document.body.innerHTML += '<script src="https://www.googletagmanager.com/gtm.js?id=GTM-OTHER"></script>';
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
    expect(document.querySelector('script[src*="id=GTM-TEST"]')).toBeNull();
    expect(document.querySelector('script[src*="id=GTM-OTHER"]')).not.toBeNull();
    expect((window as Window & { google_tag_manager?: Record<string, unknown> }).google_tag_manager).toEqual({
      'GTM-OTHER': {},
    });
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
});
