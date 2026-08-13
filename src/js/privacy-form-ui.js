import { EMAIL_PATTERN } from './validateEmail.js';
import { isValidEmailIdentifier } from './privacy-request.js';

export function getEmailFormElements(doc = document) {
    return {
        emailField: doc.getElementById('ot-email'),
        submitButton: doc.getElementById('ot-dns-submit'),
    };
}

export function setEmailFormDisabled(disabled, doc = document) {
    const { emailField, submitButton } = getEmailFormElements(doc);
    if (emailField) emailField.disabled = disabled;
    if (submitButton) submitButton.disabled = disabled;
}

export function clearSubmitStatus(doc = document) {
    const existingError = doc.getElementById('ot-submit-error');
    const existingSuccess = doc.getElementById('ot-submit-text');
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();
}

// Keep the browser's validity state in step with the current value: an empty field is left to the
// `required` attribute, anything else carries the localized message only while it is actually invalid.
export function syncEmailFieldValidity(invalidMessage, doc = document) {
    const { emailField } = getEmailFormElements(doc);
    if (!emailField) return;

    const value = emailField.value.trim();
    const isInvalid = value.length > 0 && !isValidEmailIdentifier(value);
    emailField.setCustomValidity(isInvalid ? invalidMessage : '');
}

// Wire the email field for native validation: same address pattern the JS validation uses, and a
// custom message that follows the value instead of being pinned on at init.
export function initEmailFieldValidation(invalidMessage, doc = document) {
    const { emailField } = getEmailFormElements(doc);
    if (!emailField) return;

    emailField.pattern = EMAIL_PATTERN;
    emailField.addEventListener('input', () => syncEmailFieldValidity(invalidMessage, doc));
    syncEmailFieldValidity(invalidMessage, doc);
}

export function resetEmailFormState({ clearValue = true, enabled = true, doc = document } = {}) {
    const { emailField } = getEmailFormElements(doc);

    if (emailField && clearValue) {
        emailField.value = '';
        // Clearing the value programmatically fires no `input` event, so drop any stale error too.
        emailField.setCustomValidity('');
    }

    if (enabled) {
        setEmailFormDisabled(false, doc);
    }
}
