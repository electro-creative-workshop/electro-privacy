import { describe, test, expect, beforeEach, vi } from 'vitest';

async function loadLanguageSupport({ lang, customMap } = {}) {
  vi.resetModules();

  if (customMap) {
    window.ElectroPrivacyLanguageMap = customMap;
  } else {
    delete window.ElectroPrivacyLanguageMap;
  }

  if (lang) {
    document.documentElement.setAttribute('lang', lang);
  } else {
    document.documentElement.removeAttribute('lang');
  }

  return import('../src/js/language-support.js');
}

describe('language-support', () => {
  beforeEach(() => {
    vi.resetModules();
    delete window.ElectroPrivacyLanguageMap;
    document.documentElement.removeAttribute('lang');
  });

  test('defaults to English when lang is not set', async () => {
    const { getLanguageString } = await loadLanguageSupport();
    expect(getLanguageString('Submit')).toBe('Submit');
  });

  test('uses Spanish map for es-US locale', async () => {
    const { getLanguageString } = await loadLanguageSupport({ lang: 'es-US' });
    expect(getLanguageString('Submit')).toBe('Enviar');
  });

  test('falls back to base language when full locale key does not exist', async () => {
    const { getLanguageString } = await loadLanguageSupport({ lang: 'es-MX' });
    expect(getLanguageString('On')).toBe('Habilitadas');
  });

  test('falls back to English for unsupported languages', async () => {
    const { getLanguageString } = await loadLanguageSupport({ lang: 'fr-CA' });
    expect(getLanguageString('Submit')).toBe('Submit');
  });

  test('returns the key when a translation is missing', async () => {
    const { getLanguageString } = await loadLanguageSupport({ lang: 'es-US' });
    expect(getLanguageString('This string does not exist')).toBe('This string does not exist');
  });

  test('merges and uses custom language maps provided by the host site', async () => {
    const customFrenchMap = {
      fr: {
        Submit: 'Soumettre',
      },
    };

    const { getLanguageString } = await loadLanguageSupport({
      lang: 'fr-CA',
      customMap: customFrenchMap,
    });

    expect(getLanguageString('Submit')).toBe('Soumettre');
  });
});
