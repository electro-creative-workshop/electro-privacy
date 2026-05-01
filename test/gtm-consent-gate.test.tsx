import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import * as GtmConsentGateModule from '../src/js/gtm-consent-gate';

const { GtmConsentGate, browserNavigation } = GtmConsentGateModule;

const GoogleTagManager = ({ gtmId }: { gtmId: string }) => <div data-testid="gtm">{gtmId}</div>;

function clearOneTrustCookies() {
  document.cookie = 'OptanonAlertBoxClosed=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  document.cookie = 'OptanonConsent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}

function setPreferenceCenterState(open: boolean) {
  let preferenceCenter = document.getElementById('onetrust-pc-sdk');
  if (!preferenceCenter) {
    preferenceCenter = document.createElement('div');
    preferenceCenter.id = 'onetrust-pc-sdk';
    document.body.appendChild(preferenceCenter);
  }
  preferenceCenter.setAttribute('aria-hidden', open ? 'false' : 'true');
}

describe('GtmConsentGate', () => {
  let reloadSpy: ReturnType<typeof vi.spyOn>;
  const gaDisableKey = 'ga-disable-G-XH03LSMZTX';

  beforeEach(() => {
    clearOneTrustCookies();
    setPreferenceCenterState(false);
    (window as Window & { OptanonActiveGroups?: string }).OptanonActiveGroups = '';
    (window as Window & Record<string, unknown>)[gaDisableKey] = undefined;
    reloadSpy = vi.spyOn(browserNavigation, 'reload').mockImplementation(() => undefined);
  });

  afterEach(() => {
    document.getElementById('onetrust-pc-sdk')?.remove();
    reloadSpy.mockRestore();
    vi.useRealTimers();
  });

  test('does not render GTM before explicit performance consent is available', () => {
    (window as Window & { OptanonActiveGroups?: string }).OptanonActiveGroups = '';
    render(
      <GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={['G-XH03LSMZTX']} GoogleTagManager={GoogleTagManager} />
    );
    expect(screen.queryByTestId('gtm')).toBeNull();
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(true);
  });

  test('does not render GTM when performance consent is not granted', () => {
    document.cookie =
      'OptanonConsent=isGpcEnabled=0&datestamp=2026-04-15T00:00:00.000Z&groups=C0001:1,C0002:0,C0003:1,C0004:1&hosts=&consentId=test; path=/';
    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    expect(screen.queryByTestId('gtm')).toBeNull();
  });

  test('renders GTM when performance consent is granted', async () => {
    document.cookie =
      'OptanonConsent=isGpcEnabled=0&datestamp=2026-04-15T00:00:00.000Z&groups=C0001:1,C0002:1,C0003:1,C0004:1&hosts=&consentId=test; path=/';
    render(
      <GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={['G-XH03LSMZTX']} GoogleTagManager={GoogleTagManager} />
    );
    await waitFor(() => {
      expect(screen.getByTestId('gtm').textContent).toBe('GTM-TEST');
    });
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(false);
  });

  test('sets GA runtime disable flag when consent is revoked', async () => {
    document.cookie =
      'OptanonConsent=isGpcEnabled=0&datestamp=2026-04-15T00:00:00.000Z&groups=C0001:1,C0002:1,C0003:1,C0004:1&hosts=&consentId=test; path=/';
    render(
      <GtmConsentGate gtmId="GTM-TEST" gaMeasurementIds={['G-XH03LSMZTX']} GoogleTagManager={GoogleTagManager} />
    );
    await waitFor(() => {
      expect(screen.queryByTestId('gtm')).not.toBeNull();
    });
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(false);
    document.cookie =
      'OptanonConsent=isGpcEnabled=0&datestamp=2026-04-15T00:00:00.000Z&groups=C0001:1,C0002:0,C0003:1,C0004:1&hosts=&consentId=test; path=/';
    act(() => {
      window.dispatchEvent(new Event('OTConsentApplied'));
    });
    expect((window as Window & Record<string, unknown>)[gaDisableKey]).toBe(true);
    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  test('suppresses GTM while preference center is open and restores after close', async () => {
    document.cookie =
      'OptanonConsent=isGpcEnabled=0&datestamp=2026-04-15T00:00:00.000Z&groups=C0001:1,C0002:1,C0003:1,C0004:1&hosts=&consentId=test; path=/';
    setPreferenceCenterState(true);
    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    expect(screen.queryByTestId('gtm')).toBeNull();
    act(() => {
      setPreferenceCenterState(false);
      window.dispatchEvent(new Event('OTConsentApplied'));
    });
    await waitFor(() => {
      expect(screen.queryByTestId('gtm')).not.toBeNull();
    });
  });

  test('reloads the page when performance consent is revoked after GTM has loaded', async () => {
    document.cookie =
      'OptanonConsent=isGpcEnabled=0&datestamp=2026-04-15T00:00:00.000Z&groups=C0001:1,C0002:1,C0003:1,C0004:1&hosts=&consentId=test; path=/';
    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => {
      expect(screen.queryByTestId('gtm')).not.toBeNull();
    });
    document.cookie =
      'OptanonConsent=isGpcEnabled=0&datestamp=2026-04-15T00:00:00.000Z&groups=C0001:1,C0002:0,C0003:1,C0004:1&hosts=&consentId=test; path=/';
    act(() => {
      window.dispatchEvent(new Event('OTConsentApplied'));
    });
    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  test('reloads when active groups deny performance even before cookie catches up', async () => {
    document.cookie =
      'OptanonConsent=isGpcEnabled=0&datestamp=2026-04-15T00:00:00.000Z&groups=C0001:1,C0002:1,C0003:1,C0004:1&hosts=&consentId=test; path=/';
    (window as Window & { OptanonActiveGroups?: string }).OptanonActiveGroups = 'C0001,C0002,C0003,C0004';
    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => {
      expect(screen.queryByTestId('gtm')).not.toBeNull();
    });
    (window as Window & { OptanonActiveGroups?: string }).OptanonActiveGroups = 'C0001,C0003,C0004';
    act(() => {
      window.dispatchEvent(new Event('OTConsentApplied'));
    });
    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  test('reloads when cookie updates shortly after OTConsentApplied', async () => {
    document.cookie =
      'OptanonConsent=isGpcEnabled=0&datestamp=2026-04-15T00:00:00.000Z&groups=C0001:1,C0002:1,C0003:1,C0004:1&hosts=&consentId=test; path=/';
    (window as Window & { OptanonActiveGroups?: string }).OptanonActiveGroups = 'C0001,C0002,C0003,C0004';
    render(<GtmConsentGate gtmId="GTM-TEST" GoogleTagManager={GoogleTagManager} />);
    await waitFor(() => {
      expect(screen.queryByTestId('gtm')).not.toBeNull();
    });
    vi.useFakeTimers();
    act(() => {
      window.dispatchEvent(new Event('OTConsentApplied'));
    });
    document.cookie =
      'OptanonConsent=isGpcEnabled=0&datestamp=2026-04-15T00:00:00.000Z&groups=C0001:1,C0002:0,C0003:1,C0004:1&hosts=&consentId=test; path=/';
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });
});
