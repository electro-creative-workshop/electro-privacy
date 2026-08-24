import { describe, test, expect } from 'vitest';
import { isNonProductionEnvironment, getPrivacyRequestConfig } from '../src/js/privacy-config.js';

describe('privacy-config', () => {
  test('detects non-production hosts from known patterns', () => {
    expect(isNonProductionEnvironment('mysite.staging.example.com')).toBe(true);
    expect(isNonProductionEnvironment('shop-dev.example.com')).toBe(true);
    expect(isNonProductionEnvironment('brand.lndo.site')).toBe(true);
  });

  test('detects non-production Vercel domains', () => {
    expect(isNonProductionEnvironment('project-pr-123.vercel.app')).toBe(true);
  });

  test('detects non-production from vercel env value', () => {
    expect(isNonProductionEnvironment('www.example.com', 'preview')).toBe(true);
    expect(isNonProductionEnvironment('www.example.com', 'development')).toBe(true);
  });

  test('does not mark normal production host as non-production', () => {
    expect(isNonProductionEnvironment('www.example.com')).toBe(false);
  });

  test('returns staging config when staging flag is enabled', () => {
    const config = getPrivacyRequestConfig({
      host: 'www.example.com',
      electroPrivacyStaging: true,
    });

    expect(config.url).toBe('https://privacyportaluat.onetrust.com/request/v1/consentreceipts');
    expect(typeof config.token).toBe('string');
    expect(config.environment).toBe('STAGING');
  });

  test('returns production config for production host without staging signal', () => {
    const config = getPrivacyRequestConfig({
      host: 'www.example.com',
      electroPrivacyStaging: false,
    });

    expect(config.url).toBe('https://privacyportal.onetrust.com/request/v1/consentreceipts');
    expect(typeof config.token).toBe('string');
    expect(config.environment).toBe('PRODUCTION');
  });
});
