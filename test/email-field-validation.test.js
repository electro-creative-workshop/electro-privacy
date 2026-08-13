import { describe, test, expect, beforeEach, vi } from 'vitest';
import { EMAIL_PATTERN, re } from '../src/js/validateEmail.js';
import { initEmailFieldValidation, resetEmailFormState, syncEmailFieldValidity } from '../src/js/privacy-form-ui.js';

const VALID_ADDRESS = ['user', 'example.com'].join('@');
const INVALID_ADDRESS = 'not-an-address';
const INVALID_MESSAGE = 'Please enter a valid email.';

function renderForm() {
    document.body.innerHTML = `
        <button id="do-not-share"></button>
        <form id="ot-email-submit" onsubmit="return false;">
            <input type="text" id="ot-email" name="ot-email" required maxlength="254" />
            <input type="submit" id="ot-dns-submit" value="Submit" />
        </form>
        <div id="ot-submit-status"></div>
        <div id="ot-group-id-C0004"></div>
        <div id="ot-checkbox-status"></div>
    `;
}

describe('email field pattern source', () => {
    test('compiles the way a browser compiles the pattern attribute', () => {
        expect(() => new RegExp(`^(?:${EMAIL_PATTERN})$`, 'v')).not.toThrow();
        expect(() => new RegExp(`^(?:${EMAIL_PATTERN})$`, 'u')).not.toThrow();
    });

    test('accepts and rejects the same addresses as the JS validation', () => {
        const asPattern = new RegExp(`^(?:${EMAIL_PATTERN})$`, 'v');

        expect(asPattern.test(VALID_ADDRESS)).toBe(true);
        expect(re.test(VALID_ADDRESS)).toBe(true);

        expect(asPattern.test(INVALID_ADDRESS)).toBe(false);
        expect(re.test(INVALID_ADDRESS)).toBe(false);
    });
});

describe('initEmailFieldValidation', () => {
    beforeEach(() => {
        renderForm();
    });

    test('leaves a valid address reported as valid', () => {
        initEmailFieldValidation(INVALID_MESSAGE);

        const emailField = document.getElementById('ot-email');
        emailField.value = VALID_ADDRESS;
        emailField.dispatchEvent(new Event('input'));

        expect(emailField.validity.customError).toBe(false);
        expect(emailField.checkValidity()).toBe(true);
        expect(document.getElementById('ot-email-submit').checkValidity()).toBe(true);
    });

    test('reports the localized message while the value is invalid', () => {
        initEmailFieldValidation(INVALID_MESSAGE);

        const emailField = document.getElementById('ot-email');
        emailField.value = INVALID_ADDRESS;
        emailField.dispatchEvent(new Event('input'));

        expect(emailField.validity.customError).toBe(true);
        expect(emailField.validationMessage).toBe(INVALID_MESSAGE);
        expect(emailField.checkValidity()).toBe(false);
    });

    test('clears the message again once the value is corrected', () => {
        initEmailFieldValidation(INVALID_MESSAGE);

        const emailField = document.getElementById('ot-email');
        emailField.value = INVALID_ADDRESS;
        emailField.dispatchEvent(new Event('input'));
        emailField.value = VALID_ADDRESS;
        emailField.dispatchEvent(new Event('input'));

        expect(emailField.validity.customError).toBe(false);
        expect(emailField.checkValidity()).toBe(true);
    });

    test('leaves an empty field to the required attribute', () => {
        initEmailFieldValidation(INVALID_MESSAGE);

        const emailField = document.getElementById('ot-email');
        emailField.dispatchEvent(new Event('input'));

        expect(emailField.validity.customError).toBe(false);
        expect(emailField.validity.valueMissing).toBe(true);
    });

    test('sets the pattern attribute to the shared source string', () => {
        initEmailFieldValidation(INVALID_MESSAGE);

        expect(document.getElementById('ot-email').getAttribute('pattern')).toBe(EMAIL_PATTERN);
    });

    test('does nothing when the field is absent', () => {
        document.body.innerHTML = '';

        expect(() => initEmailFieldValidation(INVALID_MESSAGE)).not.toThrow();
        expect(() => syncEmailFieldValidity(INVALID_MESSAGE)).not.toThrow();
    });
});

describe('resetEmailFormState', () => {
    beforeEach(() => {
        renderForm();
    });

    test('drops a stale custom error when the value is cleared', () => {
        initEmailFieldValidation(INVALID_MESSAGE);

        const emailField = document.getElementById('ot-email');
        emailField.value = INVALID_ADDRESS;
        emailField.dispatchEvent(new Event('input'));
        expect(emailField.validity.customError).toBe(true);

        resetEmailFormState();

        expect(emailField.value).toBe('');
        expect(emailField.validity.customError).toBe(false);
    });

    test('keeps the custom error when the value is preserved', () => {
        initEmailFieldValidation(INVALID_MESSAGE);

        const emailField = document.getElementById('ot-email');
        emailField.value = INVALID_ADDRESS;
        emailField.dispatchEvent(new Event('input'));

        resetEmailFormState({ clearValue: false });

        expect(emailField.value).toBe(INVALID_ADDRESS);
        expect(emailField.validity.customError).toBe(true);
    });
});

describe('do-not-share script init', () => {
    beforeEach(() => {
        renderForm();
    });

    test('leaves a valid address submittable after the init interval runs', async () => {
        vi.useFakeTimers();
        await import('../src/js/ot-dns-script-2.js');
        vi.advanceTimersByTime(200);
        vi.useRealTimers();

        const emailField = document.getElementById('ot-email');
        emailField.value = VALID_ADDRESS;
        emailField.dispatchEvent(new Event('input'));

        expect(emailField.validity.customError).toBe(false);
        expect(emailField.checkValidity()).toBe(true);
        expect(document.getElementById('ot-email-submit').checkValidity()).toBe(true);
    });
});
