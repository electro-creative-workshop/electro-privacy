// / /////////////////////////////////////////////
//  Do Not Share script part two
// / /////////////////////////////////////////////
import {getLanguageString} from "./language-support";
import { getRuntimePrivacyRequestConfig } from "./privacy-config.js";
import { buildConsentRequestBody, isValidEmailIdentifier } from "./privacy-request.js";
import { clearSubmitStatus, initEmailFieldValidation, resetEmailFormState, setEmailFormDisabled } from "./privacy-form-ui.js";

// Define variables
let dnsUI = false;
let isSubmitting = false; // Prevent duplicate submissions

// Collection Point Information
const { url, token, preferences, environment } = getRuntimePrivacyRequestConfig();

// Purpose Ids Assigned to Collection Point

// make POST call to hit collection point
function setPreferences(otDataSubjectId) {
    const requestBodyResult = buildConsentRequestBody(otDataSubjectId, token, preferences);

    if (!requestBodyResult.ok && requestBodyResult.error === 'invalid-identifier') {
        console.error('Invalid email format before API call');
        resetEmailFormState();
        showErrorMessage();
        isSubmitting = false;
        return;
    }

    if (!requestBodyResult.ok) {
        console.error('Error: Constructed JSON is invalid');
        showErrorMessage();
        isSubmitting = false;
        setEmailFormDisabled(false);
        return;
    }

    const body = requestBodyResult.body;

    // Debug logging (opt-in via window.electroPrivacyDebug; never logs request body to avoid PII/token leakage)
    if (typeof window !== 'undefined' && window.electroPrivacyDebug) {
        console.info('electro-privacy: Submitting to URL:', url);
        console.info('electro-privacy: Environment:', environment);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    // Add error handling
    xhr.onerror = function() {
        console.error('Network error occurred during API call');
        showErrorMessage();
        isSubmitting = false;
        setEmailFormDisabled(false);
    };
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            // Success - show success message and allow follow-up submissions
            isSubmitting = false;
            setEmailFormDisabled(false);

            showStatusMessage('success', getLanguageString('Successfully Submitted!'));
        } else {
            console.error('API call failed with status:', xhr.status);
            showErrorMessage();
            isSubmitting = false;
            setEmailFormDisabled(false);
        }
    };
    
    xhr.send(body);
}

// Show status message in the form area (success or error). Reusable to avoid duplication.
function showStatusMessage(type, message) {
    clearSubmitStatus();

    const isSuccess = type === 'success';
    const div = document.createElement('div');
    div.id = isSuccess ? 'ot-submit-text' : 'ot-submit-error';
    div.setAttribute('style', isSuccess ? 'color: green; font-weight: bold;' : 'color: red; font-weight: bold;');
    div.setAttribute('role', isSuccess ? 'status' : 'alert');
    div.setAttribute('aria-live', isSuccess ? 'polite' : 'assertive');
    div.setAttribute('aria-atomic', 'true');
    div.textContent = isSuccess ? `✓ ${message}` : `⚠ ${message}`;

    const statusContainer = document.getElementById('ot-submit-status');
    if (statusContainer) {
        statusContainer.appendChild(div);
    }
}

// Show error message to user
function showErrorMessage() {
    showStatusMessage('error', getLanguageString('An error occurred. Please try again.'));
}

// if email input is valid, trigger submitPreferences function and disable text input field and submit button
function inputValidation() {
    // Prevent duplicate submissions
    if (isSubmitting) {
        return;
    }
    
    const textInput = document.getElementById('ot-email');
    const submitBtn = document.getElementById('ot-dns-submit');
    
    if (!textInput || !submitBtn) {
        return;
    }
    
    // Sanitize input - trim whitespace
    const emailValue = textInput.value.trim();
    
    // Validate email
    if (isValidEmailIdentifier(emailValue)) {
        // Set submitting flag
        isSubmitting = true;
        
        // Disable form to prevent duplicate submissions
        setEmailFormDisabled(true);
        
        // Remove any existing messages
        clearSubmitStatus();
        
        // Submit with sanitized email
        // Success message will be shown after API call succeeds
        submitPreferences();
    } else {
        // Show validation error and clear partial/invalid email so user can start fresh
        textInput.value = '';
        showStatusMessage('error', getLanguageString('Please enter a valid email.'));
    }
}

// grab email input value and trigger API POST
function submitPreferences() {
    // grab value from email form field
    // Value is Data Subject ID
    const textInput = document.getElementById('ot-email');

    if (!textInput || textInput.value === '') {
        console.error('Identifier Not Set');
        isSubmitting = false;
        setEmailFormDisabled(false);
        return;
    }
    
    // Sanitize and validate email before sending
    const emailValue = textInput.value.trim();
    if (!isValidEmailIdentifier(emailValue)) {
        console.error('Invalid email format in submitPreferences');
        isSubmitting = false;
        resetEmailFormState();
        return;
    }
    
    // Call API with sanitized email (no delay needed; form is already disabled and validated)
    setPreferences(emailValue);
}

// when clicking on "Do Not Share" footer link:
// - hide cookie categories BESIDES targeting
// - show email input DIV
// - simulate click on Targeting to toggle off (may be removed depending on Clorox decision about UX)
function doNotShareUI() {
    const stockText = document.getElementById('ot-pc-desc');
    const dnsText = document.getElementById('dns-custom-text');
    const essentialCat = document.querySelectorAll(
        "div.ot-cat-item.ot-always-active-group[data-optanongroupid='C0001']"
    )[0];
    const performanceCat = document.querySelectorAll("div.ot-cat-item[data-optanongroupid='C0002']")[0];
    const functionalCat = document.querySelectorAll("div.ot-cat-item[data-optanongroupid='C0003']")[0];
    const closeBtn = document.getElementById('close-pc-btn-handler');
    const paidMarketingText = document.getElementById('ot-email-text');
    const emailInput = document.getElementById('ot-email-submit');
    const pcCatTitle = document.getElementById('ot-category-title');
    const catDescription = document.getElementById('ot-desc-id-C0004');
    const pcTitle = document.getElementById('ot-pc-title');
    const trackingCat = document.querySelectorAll('#ot-group-id-C0004')[0];
    const checkboxStatus = document.getElementById('ot-checkbox-status');

    // Make sure all referenced elements were found
    if (!stockText || !dnsText || !essentialCat || !performanceCat || !functionalCat || 
        !closeBtn || !paidMarketingText || !emailInput || !pcCatTitle || !catDescription || 
        !pcTitle || !checkboxStatus || !trackingCat
    ) {
        console.error('doNotShareUI: One or more elements not found');
        return;
    }

    pcTitle.textContent = getLanguageString('Privacy Choices');

    stockText.style.display = 'none';
    dnsText.style.display = 'block';
    paidMarketingText.style.display = 'block';
    emailInput.style.display = 'block';
    essentialCat.style.display = 'none';
    performanceCat.style.display = 'none';
    functionalCat.style.display = 'none';
    closeBtn.style.display = 'none';
    pcCatTitle.style.display = 'none';
    catDescription.style.display = 'none';

    // make sure On/Off text is displayed properly
    trackingCat.dispatchEvent(new Event('change'))
    checkboxStatus.style.position = 'relative';
    checkboxStatus.style.top = '-5px';
    checkboxStatus.style.display = 'inline-block';
    checkboxStatus.style.marginLeft = '5px';

    // Ensure email input and submit button are enabled when modal opens, and clear email so each open starts fresh
    resetEmailFormState();
    clearSubmitStatus();

    dnsUI = true;
}

// reverse everything from doNotShareUI function once clicking of CTA
function hideDnsUI() {
    if (dnsUI) {
        const stockText = document.getElementById('ot-pc-desc');
        const dnsText = document.getElementById('dns-custom-text');
        const essentialCat = document.querySelectorAll(
            "div.ot-cat-item.ot-always-active-group[data-optanongroupid='C0001']"
        )[0];
        const performanceCat = document.querySelectorAll("div.ot-cat-item[data-optanongroupid='C0002']")[0];
        const functionalCat = document.querySelectorAll("div.ot-cat-item[data-optanongroupid='C0003']")[0];
        const closeBtn = document.getElementById('close-pc-btn-handler');
        const paidMarketingText = document.getElementById('ot-email-text');
        const emailInput = document.getElementById('ot-email-submit');
        const pcCatTitle = document.getElementById('ot-category-title');
        const catDescription = document.getElementById('ot-desc-id-C0004');
        const pcTitle = document.getElementById('ot-pc-title');
        const toggleTextContainer = document.getElementById('ot-checkbox-status');

        // Make sure all referenced elements were found
        if (!stockText || !dnsText || !essentialCat || !performanceCat || !functionalCat || 
            !closeBtn || !paidMarketingText || !emailInput || !pcCatTitle || !catDescription || 
            !pcTitle || !toggleTextContainer
        ) {
            console.error('hideDnsUI: One or more elements not found');
            return;
        }

        toggleTextContainer.style.display = 'none';

        pcTitle.style.textAlign = 'center';
        stockText.style.display = 'block';
        dnsText.style.display = 'none';
        paidMarketingText.style.display = 'none';
        emailInput.style.display = 'none';
        essentialCat.style.display = 'block';
        performanceCat.style.display = 'block';
        functionalCat.style.display = 'block';
        closeBtn.style.display = 'block';
        pcCatTitle.style.display = 'block';
        catDescription.style.display = 'block';
        
        // Clear email input and status messages when modal closes
        resetEmailFormState();
        clearSubmitStatus();
    }

    dnsUI = false;
}

// adding click event listeners to email submit button in DNS UI and CTAs
let domCheckInterval = setInterval(dnsCheck, 100);
function dnsCheck() {
    try {
        // verify UI has been added to document
        if (document.getElementById('do-not-share') && document.getElementById('ot-email') && document.getElementById('ot-dns-submit')) {
            // add pattern to email input
            initEmailFieldValidation(getLanguageString('Please enter a valid email.'));

            document.getElementById('ot-dns-submit').addEventListener('click', inputValidation);

            // add handling for buttons being recreated (dtc shop)
            document.addEventListener('click', function (e) {
                const sdkButton = document.getElementById('ot-sdk-btn');
                const dnsButton = document.getElementById('do-not-share');
                if (e.target && e.target.id === 'ot-sdk-btn' || sdkButton?.contains(e.target)) {
                    hideDnsUI();
                } else if (e.target && e.target.id === 'do-not-share' || dnsButton?.contains(e.target)) {
                    doNotShareUI();
                }
            }, {
                capture: true
            })

            // ot banner link
            if (document.getElementById('onetrust-pc-btn-handler')) {
                document.getElementById('onetrust-pc-btn-handler').addEventListener('click', hideDnsUI);
            }

            // ESC key handling to close
            //  Needed with onetrust-banner-sdk changes in
            //  v202304.1.0 - which can remove keyboard handler when cookies popup closes
            document.addEventListener('keydown', function (e) {
                if ('Escape' === e.code) {
                    // Clear email input and status messages before closing
                    resetEmailFormState({ clearValue: true, enabled: false });
                    clearSubmitStatus();
                    
                    // click dialog close button
                    const close = document.getElementById('close-pc-btn-handler');
                    if (close) {
                        close.click();
                    }
                }
            });

            // listen for styled checkbox state
            document.querySelectorAll('#ot-group-id-C0004')[0].addEventListener('change', function () {
                document.getElementById('ot-checkbox-status').textContent = this.checked ? getLanguageString('On') : getLanguageString('Off');
            });

            clearInterval(domCheckInterval);
            domCheckInterval = null;
        }
    } catch (error) {
        console.error("failure to init electro-privacy", error);
        clearInterval(domCheckInterval);
        domCheckInterval = null;
    }
}
