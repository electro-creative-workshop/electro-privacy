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

export function resetEmailFormState({ clearValue = true, enabled = true, doc = document } = {}) {
  const { emailField } = getEmailFormElements(doc);

  if (emailField && clearValue) {
    emailField.value = '';
  }

  if (enabled) {
    setEmailFormDisabled(false, doc);
  }
}
