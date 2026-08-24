import { describe, test, expect, beforeEach } from 'vitest';
import { setEmailFormDisabled, clearSubmitStatus, resetEmailFormState } from '../src/js/privacy-form-ui.js';

describe('privacy-form-ui', () => {
  beforeEach(() => {
    document.body.innerHTML = `
            <input id="ot-email" value="test@example.com" />
            <button id="ot-dns-submit"></button>
            <div id="ot-submit-error">error</div>
            <div id="ot-submit-text">success</div>
        `;
  });

  test('sets disabled state for email and submit controls', () => {
    setEmailFormDisabled(true);

    expect(document.getElementById('ot-email').disabled).toBe(true);
    expect(document.getElementById('ot-dns-submit').disabled).toBe(true);

    setEmailFormDisabled(false);

    expect(document.getElementById('ot-email').disabled).toBe(false);
    expect(document.getElementById('ot-dns-submit').disabled).toBe(false);
  });

  test('clears status elements when present', () => {
    clearSubmitStatus();

    expect(document.getElementById('ot-submit-error')).toBeNull();
    expect(document.getElementById('ot-submit-text')).toBeNull();
  });

  test('resets form value and enables controls by default', () => {
    const email = document.getElementById('ot-email');
    const submit = document.getElementById('ot-dns-submit');
    email.disabled = true;
    submit.disabled = true;

    resetEmailFormState();

    expect(email.value).toBe('');
    expect(email.disabled).toBe(false);
    expect(submit.disabled).toBe(false);
  });

  test('can preserve email value while enabling controls', () => {
    const email = document.getElementById('ot-email');
    const submit = document.getElementById('ot-dns-submit');
    email.disabled = true;
    submit.disabled = true;

    resetEmailFormState({ clearValue: false });

    expect(email.value).toBe('test@example.com');
    expect(email.disabled).toBe(false);
    expect(submit.disabled).toBe(false);
  });
});
