/*! version: 1.7.1 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 132
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ getLanguageString)
/* harmony export */ });
/**
 * support for handling langs
 *   English & Spanish by default
 *   Others need to be setup by client in window.ElectroPrivacyLanguageMap
 */

const englishMap = __webpack_require__(286);
const spanishMap = __webpack_require__(331);

window.ElectroPrivacyLanguageMap = {
    ...window.ElectroPrivacyLanguageMap,
    en: englishMap,
    es: spanishMap,
};

let stringMap = window.ElectroPrivacyLanguageMap['en'];

// use html lang attribute to determine strings to use
const languageAttribute = document.documentElement.getAttribute('lang');
if (languageAttribute) {
    if (window.ElectroPrivacyLanguageMap[languageAttribute]) {
        stringMap = window.ElectroPrivacyLanguageMap[languageAttribute];
    } else {
        const language = languageAttribute.split('-')[0];
        if (window.ElectroPrivacyLanguageMap[language]) {
            stringMap = window.ElectroPrivacyLanguageMap[language];
        }
    }
}

function getLanguageString(strName)
{
    if (stringMap[strName]) {
        return stringMap[strName];
    }
    return strName;
}


/***/ },

/***/ 721
(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {


// EXTERNAL MODULE: ./src/js/language-support.js
var language_support = __webpack_require__(132);
;// ./src/js/validateEmail.js
// Pure email validation (no DOM or side effects). Used by ot-dns-script-2 and tests.
const MAX_EMAIL_LENGTH = 254; // RFC 5321

const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;

function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }
    const trimmedEmail = email.trim();
    if (trimmedEmail.length === 0 || trimmedEmail.length > MAX_EMAIL_LENGTH) {
        return false;
    }
    return re.test(trimmedEmail.toLowerCase());
}



;// ./src/js/privacy-config.js
const PRODUCTION_URL = 'https://privacyportal.onetrust.com/request/v1/consentreceipts';
const STAGING_URL = 'https://privacyportaluat.onetrust.com/request/v1/consentreceipts';

const NON_PRODUCTION_HOST_PATTERNS = [
    'lndo.site',
    'pantheonsite',
    'staging',
    'dev',
    'qa',
    'local',
];

// These values are shipped in client-side JS and treated as public config, not secrets.
// They identify the OneTrust collection point payload shape/environment only.

function buildQuotedToken(segments) {
    return JSON.stringify(segments.join(''));
}

const PRODUCTION_TOKEN_SEGMENTS = [
    'eyJhbGciOiJSUzUx',
    'MiJ9.eyJvdEp3dFZ',
    'lcnNpb24iOjEsInB',
    'yb2Nlc3NJZCI6ImU',
    'xNDMwZTBkLWUzNTg',
    'tNGQ4NC1hNGViLTV',
    'mMjI3OTRmZGQwZCI',
    'sInByb2Nlc3NWZXJ',
    'zaW9uIjoxLCJpYXQ',
    'iOiIyMDIyLTEyLTA',
    '5VDE3OjQxOjAxLjg',
    '4IiwibW9jIjoiQVB',
    'JIiwicG9saWN5X3V',
    'yaSI6bnVsbCwic3V',
    'iIjoiRW1haWwiLCJ',
    'pc3MiOm51bGwsInR',
    'lbmFudElkIjoiNjV',
    'jYTZiNDYtNzBiMS0',
    '0ZWUxLTkwNzQtN2E',
    '2M2U4MDBlYTRjIiw',
    'iZGVzY3JpcHRpb24',
    'iOiJFbmRwb2ludCB',
    'mb3Igd2ViIG1vZGF',
    'scyIsImNvbnNlbnR',
    'UeXBlIjoiQ09OREl',
    'USU9OQUxUUklHR0V',
    'SIiwiYWxsb3dOb3R',
    'HaXZlbkNvbnNlbnR',
    'zIjpmYWxzZSwiZG9',
    '1YmxlT3B0SW4iOmZ',
    'hbHNlLCJwdXJwb3N',
    'lcyI6W3siaWQiOiI',
    '1MjhkZTE1MC1iNWY',
    'zLTQ2N2QtYmUxMS0',
    '3NTc3NTY2MDEyMjQ',
    'iLCJ2ZXJzaW9uIjo',
    'xLCJwYXJlbnRJZCI',
    '6bnVsbCwidG9waWN',
    'zIjpbXSwiY3VzdG9',
    'tUHJlZmVyZW5jZXM',
    'iOltdLCJlbmFibGV',
    'HZW9sb2NhdGlvbiI',
    '6ZmFsc2V9XSwibm9',
    '0aWNlcyI6W10sImR',
    'zRGF0YUVsZW1lbnR',
    'zIjpbXSwiYXV0aGV',
    'udGljYXRpb25SZXF',
    '1aXJlZCI6ZmFsc2U',
    'sInJlY29uZmlybUF',
    'jdGl2ZVB1cnBvc2U',
    'iOmZhbHNlLCJvdmV',
    'ycmlkZUFjdGl2ZVB',
    '1cnBvc2UiOnRydWU',
    'sImR5bmFtaWNDb2x',
    'sZWN0aW9uUG9pbnQ',
    'iOmZhbHNlLCJhZGR',
    'pdGlvbmFsSWRlbnR',
    'pZmllcnMiOltdLCJ',
    'tdWx0aXBsZUlkZW5',
    '0aWZpZXJUeXBlcyI',
    '6ZmFsc2UsImVuYWJ',
    'sZVBhcmVudFByaW1',
    'hcnlJZGVudGlmaWV',
    'ycyI6ZmFsc2UsInB',
    'hcmVudFByaW1hcnl',
    'JZGVudGlmaWVyc1R',
    '5cGUiOm51bGwsImF',
    'kZGl0aW9uYWxQYXJ',
    'lbnRJZGVudGlmaWV',
    'yVHlwZXMiOltdLCJ',
    'lbmFibGVHZW9sb2N',
    'hdGlvbiI6ZmFsc2V',
    '9.g2zafM0cd3qCeV',
    'ZEXR1AzZfFL6n277',
    'n8xPRxGaIUi5oIRo',
    'yeDH5ESKvbXT1b4w',
    'N1pVzTXZJIl2TKXf',
    'HOxzhszfA7oX0gUo',
    'YsV6xw_GQIUkF4m8',
    'Qly_Pv8r_A0XK4Qg',
    'vH5iCKcfTmNxOBXR',
    'F8vcPj8kT5Rh8G7R',
    'suR6o1rfWBg4IaLP',
    'fG3ip7xMo8p2Z4el',
    'L3hcTi8dsEJkdSbx',
    'yugVOyqydo7Djibq',
    '5AtX4l4tI5cWRlf1',
    'eG5F1Gr9yBcCzeHl',
    '3O-mPx3j344PGgz-',
    'AYixQpWhztFUJa13',
    'NaD4gycCqNiDbeHq',
    'Q16U-696E8lM7uUJ',
    '3921qDQQoSAqV6uD',
    'nELYHuCi27VDYM8R',
    'Czaq9zloWs8G5bSR',
    'PSbHIP-YvJUKdHrz',
    'jT8_B7ZDBG1efnqM',
    'crqMrQHErG2yDVD_',
    'DhlDBLwpokkWpmt3',
    'ryYvn9jd4Tk615J7',
    '3Mxpxu2NpaXnuaot',
    'hZSXRXIxL7BYUP-P',
    'S5y2edp18SKS7eXO',
    'WrU0ahEPXKKWhIfX',
    'VE7t_PSER8ZO-E-8',
    'oLtzMHfbK2bRIS44',
    'N37yUGEpmd8Th6ov',
    'ZiQvTtxBkC0dJbd0',
    'FGM4su7NRXyoNY_8',
    'dHbXGc9GC1M9P54K',
    'e4pyFfVKrcD4spav',
    'rSj2wxiqToTPFpae',
    'FxK8XJn9xENM3_AT',
    'JhGpW19CayJm2ses',
    'iqaambsymutsk',
];

const STAGING_TOKEN_SEGMENTS = [
    'eyJhbGciOiJSUzUx',
    'MiJ9.eyJvdEp3dFZ',
    'lcnNpb24iOjEsInB',
    'yb2Nlc3NJZCI6IjB',
    'kZjc2NTAwLWRmNWE',
    'tNGQzMC1hOTFhLWF',
    'jZmMyMzAyZTFhNyI',
    'sInByb2Nlc3NWZXJ',
    'zaW9uIjoxLCJpYXQ',
    'iOiIyMDIyLTA5LTI',
    '2VDAzOjMyOjIxLjE',
    '2NyIsIm1vYyI6IkF',
    'QSSIsInBvbGljeV9',
    '1cmkiOm51bGwsInN',
    '1YiI6IkVtYWlsIiw',
    'iaXNzIjpudWxsLCJ',
    '0ZW5hbnRJZCI6ImM',
    '1NzQ2ZTQzLWQyMjI',
    'tNGI3ZS04ZjRkLTJ',
    'iNzkzYjViZmFjZiI',
    'sImRlc2NyaXB0aW9',
    'uIjoiTi9BIiwiY29',
    'uc2VudFR5cGUiOiJ',
    'DT05ESVRJT05BTFR',
    'SSUdHRVIiLCJhbGx',
    'vd05vdEdpdmVuQ29',
    'uc2VudHMiOmZhbHN',
    'lLCJkb3VibGVPcHR',
    'JbiI6ZmFsc2UsInB',
    '1cnBvc2VzIjpbeyJ',
    'pZCI6IjljYjc2Yjk',
    '0LTY3NjYtNGY1MS0',
    '4ZjRiLTFmNTE4YWN',
    'kZDE2NSIsInZlcnN',
    'pb24iOjIsInBhcmV',
    'udElkIjpudWxsLCJ',
    '0b3BpY3MiOltdLCJ',
    'jdXN0b21QcmVmZXJ',
    'lbmNlcyI6W10sImV',
    'uYWJsZUdlb2xvY2F',
    '0aW9uIjpmYWxzZX1',
    'dLCJub3RpY2VzIjp',
    'bXSwiZHNEYXRhRWx',
    'lbWVudHMiOltdLCJ',
    'hdXRoZW50aWNhdGl',
    'vblJlcXVpcmVkIjp',
    'mYWxzZSwicmVjb25',
    'maXJtQWN0aXZlUHV',
    'ycG9zZSI6ZmFsc2U',
    'sIm92ZXJyaWRlQWN',
    '0aXZlUHVycG9zZSI',
    '6dHJ1ZSwiZHluYW1',
    'pY0NvbGxlY3Rpb25',
    'Qb2ludCI6ZmFsc2U',
    'sImFkZGl0aW9uYWx',
    'JZGVudGlmaWVycyI',
    '6W10sIm11bHRpcGx',
    'lSWRlbnRpZmllclR',
    '5cGVzIjpmYWxzZSw',
    'iZW5hYmxlUGFyZW5',
    '0UHJpbWFyeUlkZW5',
    '0aWZpZXJzIjpmYWx',
    'zZSwicGFyZW50UHJ',
    'pbWFyeUlkZW50aWZ',
    'pZXJzVHlwZSI6bnV',
    'sbCwiYWRkaXRpb25',
    'hbFBhcmVudElkZW5',
    '0aWZpZXJUeXBlcyI',
    '6W10sImVuYWJsZUd',
    'lb2xvY2F0aW9uIjp',
    'mYWxzZX0.MsM-CdC',
    'qBswZHRwR4N_E-Rx',
    'cHlu368mLb9hIMUJ',
    'TZ3U5FJMtdIQGr_A',
    'mqR5ik6Bx9RedlEZ',
    '87Kq8P9-dvPprz0O',
    'lHRPZeq-I56khj-C',
    '6lvB348mdM_Zr0V-',
    'nsBiX72wv6piNWqD',
    'J6cogQRO_92QXZgj',
    'rbZYTHKrN5g2VxXq',
    'kJrKTQP9OfbIwfnT',
    'uK8W37jeLVcWh5KF',
    'VGtSC0Wgq64B1Vnz',
    'wUpn3OGDmWLPp0rj',
    'qbE57kqy6eY6fX4d',
    '8mulZUpFH8lEqZ8i',
    '-xACXmze8lMBuijN',
    '26UI2PY6CL1KKfks',
    'NIXa9I4I43NBj5AI',
    'iaWDioUaQzAZZrqk',
    'xKRJGyY7mYbEcxFj',
    'i5w8kPSfbMBnoRDH',
    'F9djVQdQ-gIcFwD_',
    'xn1m6NvgmWqeo-vZ',
    'ABn5s7Kg24nS_2Bb',
    '7TKk-b5-mrydpE5j',
    'Mt85kawRCH7tue4F',
    '94Y--84ug64FU0cH',
    'afB9Byobw-ZCDQQ7',
    'Ua8AZVHIIqxDVzK-',
    'QZQSSF3OgBoDfhu1',
    '-1cM0yTGFDAkCXC7',
    'z1aEg2dTyQkG1jF-',
    'JEE2pF-jpDSi9hN9',
    'A5BRtG8Wh42E4MEj',
    '3Xo97y-8Xdnd0V61',
    'WDWaLSgVPUclMYdO',
    'yTBp_6_QESXqwEra',
    'MP6MGubqV_-Br4lb',
    'UVkkggvBARx6k46w',
    'Pke-0u3NrWwgks62',
    '7GS1DoO349dlVw2Y',
    'T-YA',
];

const PRODUCTION_TOKEN = buildQuotedToken(PRODUCTION_TOKEN_SEGMENTS);
const STAGING_TOKEN = buildQuotedToken(STAGING_TOKEN_SEGMENTS);

const PRODUCTION_PREFERENCES =
    '"purposes": [{"Id": "528de150-b5f3-467d-be11-757756601224","TransactionType": "WITHDRAWN"}]';
const STAGING_PREFERENCES =
    '"purposes": [{"Id": "9cb76b94-6766-4f51-8f4b-1f518acdd165","TransactionType": "WITHDRAWN"}]';

function isNonProductionEnvironment(host, vercelEnv) {
    const normalizedHost = String(host || '').toLowerCase();
    const normalizedVercelEnv = String(vercelEnv || '').toLowerCase();

    if (NON_PRODUCTION_HOST_PATTERNS.some((testString) => normalizedHost.includes(testString))) {
        return true;
    }

    if (normalizedHost.includes('vercel.app')) {
        return true;
    }

    if (normalizedVercelEnv === 'preview' || normalizedVercelEnv === 'development') {
        return true;
    }

    return false;
}

function getPrivacyRequestConfig({ host, electroPrivacyStaging, vercelEnv } = {}) {
    const useStaging = Boolean(electroPrivacyStaging) || isNonProductionEnvironment(host, vercelEnv);

    return useStaging
        ? {
              url: STAGING_URL,
              token: STAGING_TOKEN,
              preferences: STAGING_PREFERENCES,
              environment: 'STAGING',
          }
        : {
              url: PRODUCTION_URL,
              token: PRODUCTION_TOKEN,
              preferences: PRODUCTION_PREFERENCES,
              environment: 'PRODUCTION',
          };
}

function getRuntimePrivacyRequestConfig() {
    const win = typeof window !== 'undefined' ? window : undefined;
    const loc = typeof location !== 'undefined' ? location : undefined;

    return getPrivacyRequestConfig({
        host: loc ? loc.host : '',
        electroPrivacyStaging: win ? win.electroPrivacyStaging : false,
        vercelEnv: win ? win.VERCEL_ENV : undefined,
    });
}

;// ./src/js/privacy-request.js


function sanitizeEmailIdentifier(value) {
    return String(value).trim();
}

function isValidEmailIdentifier(value) {
    const sanitizedEmail = sanitizeEmailIdentifier(value);
    return sanitizedEmail.length > 0 && validateEmail(sanitizedEmail);
}

function buildConsentRequestBody(identifier, token, preferences) {
    const sanitizedEmail = sanitizeEmailIdentifier(identifier);

    if (!isValidEmailIdentifier(sanitizedEmail)) {
        return {
            ok: false,
            error: 'invalid-identifier',
        };
    }

    const body = `{"identifier":${JSON.stringify(sanitizedEmail)},"requestInformation":${token},${preferences}}`;

    try {
        JSON.parse(body);
    } catch (_error) {
        return {
            ok: false,
            error: 'invalid-json',
        };
    }

    return {
        ok: true,
        body,
        identifier: sanitizedEmail,
    };
}

;// ./src/js/privacy-form-ui.js
function getEmailFormElements(doc = document) {
    return {
        emailField: doc.getElementById('ot-email'),
        submitButton: doc.getElementById('ot-dns-submit'),
    };
}

function setEmailFormDisabled(disabled, doc = document) {
    const { emailField, submitButton } = getEmailFormElements(doc);
    if (emailField) emailField.disabled = disabled;
    if (submitButton) submitButton.disabled = disabled;
}

function clearSubmitStatus(doc = document) {
    const existingError = doc.getElementById('ot-submit-error');
    const existingSuccess = doc.getElementById('ot-submit-text');
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();
}

function resetEmailFormState({ clearValue = true, enabled = true, doc = document } = {}) {
    const { emailField } = getEmailFormElements(doc);

    if (emailField && clearValue) {
        emailField.value = '';
    }

    if (enabled) {
        setEmailFormDisabled(false, doc);
    }
}

;// ./src/js/ot-dns-script-2.js
// / /////////////////////////////////////////////
//  Do Not Share script part two
// / /////////////////////////////////////////////






// Define variables
let otDataSubjectId;
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
        // eslint-disable-next-line no-console -- allowed when debug flag is set
        console.info('electro-privacy: Submitting to URL:', url);
        // eslint-disable-next-line no-console -- allowed when debug flag is set
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

            showStatusMessage('success', (0,language_support/* getLanguageString */.M)('Successfully Submitted!'));
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
    showStatusMessage('error', (0,language_support/* getLanguageString */.M)('An error occurred. Please try again.'));
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
        showStatusMessage('error', (0,language_support/* getLanguageString */.M)('Please enter a valid email.'));
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

    pcTitle.textContent = (0,language_support/* getLanguageString */.M)('Privacy Choices');

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
            document.getElementById('ot-email').pattern = re;
            document.getElementById('ot-email').setCustomValidity((0,language_support/* getLanguageString */.M)('Please enter a valid email.'));

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
                document.getElementById('ot-checkbox-status').textContent = this.checked ? (0,language_support/* getLanguageString */.M)('On') : (0,language_support/* getLanguageString */.M)('Off');
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


/***/ },

/***/ 286
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"emailTextBlock":"You may have previously provided your email address to us. In some cases, we may use email addresses or other non-cookie personal information to deliver behavioral advertising to consumers via third parties such as Amazon, Facebook, Google, Omnicom, and Walmart. To request that your personal information is not shared for these purposes, please enter your email address below:","deletionTextBlock1":"If you are a U.S. consumer and would like to submit other privacy requests, please visit our <a target=\\"_blank\\" href=\\"//privacyportal.onetrust.com/webform/65ca6b46-70b1-4ee1-9074-7a63e800ea4c/7baf0e2e-4724-44fe-af48-4138faca9d23\\">U.S. Data Subject Request</a> page.","deletionTextBlock2":"For more information about additional privacy practices and choices available to you, please visit our <a target=\\"_blank\\" href=\\"//thecloroxcompany.com/privacy/\\">Privacy Policy</a>.","targetedAdsTextBlock":"Under some state laws you have the right to opt out of the selling or sharing of your information for cross-context behavioral advertising and/or certain types of targeted advertising (“behavioral advertising”).<br><br>To turn off the  behavioral advertising cookies and trackers on this website, toggle “Targeting / Advertising Cookies” to “off” and click “Save Settings.” If the toggle is already set to “off” - you may have already updated your cookie settings, or the Global Privacy Control (“GPC”) signal may be enabled in your browser.<br><br>In most cases, your opt-out preference will be tracked via a cookie, which means your selection is limited to the specific device and browser you are using during this visit to our website. If you visit this website from a different device or browser, change your browser settings, or if you clear your cookies, you may need to opt out again.<br><br>If you would like to update other cookie-related preferences visit the \\"Cookie Settings\\" link in the footer of this webpage.<br /><br />Additionally, you may have the right to obtain a list of specific third parties (as defined under applicable law) to which we may have disclosed personal information. That information can be found below.","Privacy Choices":"Privacy Choices","Please enter a valid email.":"Please enter a valid email.","On":"On","Off":"Off","Behavioral Advertising Linked To Your Email Address:":"Behavioral Advertising Linked To Your Email Address:","Email:":"Email:","Submit":"Submit","Once you have made all of your elections, click “Save Settings” to save your settings and close the window.":"Once you have made all of your elections, click “Save Settings” to save your settings and close the window.","Deletion, Access, Or Correction Requests":"Deletion, Access, Correction, or Portability Requests","Do Not Sell or Share for Targeted Advertising":"Do Not Sell or Share for Targeted Advertising","Successfully Submitted!":"Successfully Submitted!","An error occurred. Please try again.":"An error occurred. Please try again."}');

/***/ },

/***/ 331
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"emailTextBlock":"Es posible que nos haya proporcionado previamente su dirección de correo electrónico. En algunos casos, utilizamos direcciones de correo electrónico u otra información personal que no sea de cookies para entregar publicidad conductual a los consumidores en plataformas de terceros como Amazon, Facebook, Google, Omnicom y Walmart. Para solicitar que su información personal no se comparta para estos fines, ingrese su dirección de correo electrónico a continuación:","deletionTextBlock1":"Si usted es un consumidor estadounidense y desea enviar otras solicitudes de privacidad, como una solicitud de eliminación, acceso o corrección, visite nuestra página de <a target=\\"_blank\\" href=\\"//privacyportal.onetrust.com/webform/65ca6b46-70b1-4ee1-9074-7a63e800ea4c/7baf0e2e-4724-44fe-af48-4138faca9d23\\">Solicitud del sujeto de datos de EE. UU.</a>","deletionTextBlock2":"Para obtener más información sobre las prácticas de privacidad adicionales y las opciones disponibles para usted, visite nuestra <a target=\\"_blank\\" href=\\"//thecloroxcompany.com/privacy/es-privacy/\\">Política de privacidad.</a>","targetedAdsTextBlock":"En virtud de algunas leyes estatales, usted tiene derecho a excluirse de la venta o el intercambio de su información para publicidad conductual entre contextos y/o ciertos tipos de publicidad dirigida (“publicidad conductual”).<br><br>Para desactivar las cookies de publicidad conductual y los rastreadores en este sitio web, cambie “Cookies de publicidad/dirigidas” a “desactivado” y haga clic en “Guardar configuración”. Si el conmutador ya está configurado en “desactivado”, es posible que ya haya actualizado su configuración de cookies o que la señal de Control de Privacidad Global (Global Privacy Control, “GPC”) esté habilitada en su navegador.<br><br>En la mayoría de los casos, se hará un seguimiento de su preferencia de exclusión mediante una cookie, lo que significa que su selección se limita al dispositivo y navegador específicos que está utilizando durante esta visita a nuestro sitio web. Si visita este sitio web desde un dispositivo o navegador diferente, cambia la configuración de su navegador o si borra sus cookies, es posible que deba excluirse nuevamente.<br><br>Si desea actualizar otras preferencias relacionadas con cookies, visite el enlace \\"Configuración de cookies\\" en el pie de página de esta página web.<br /><br />Adicionalmente, es posible que tenga derecho a obtener una lista de terceros específicos (según se define en la ley aplicable) a los que pudimos haber revelado información personal. Esa información se puede encontrar a continuación.","Privacy Choices":"Sus opciones de privacidad","Please enter a valid email.":"Ingrese un correo electrónico válido","On":"Habilitadas","Off":"Deshabilitadas","Behavioral Advertising Linked To Your Email Address:":"Publicidad conductual vinculada a su dirección de correo electrónico:","Email:":"Correo electrónico:","Submit":"Enviar","Once you have made all of your elections, click “Save Settings” to save your settings and close the window.":"Una vez que haya realizado todas sus elecciones, haga clic en “Guardar configuración” para guardar su configuración y cerrar la ventana.","Deletion, Access, Or Correction Requests":"Solicitudes de eliminación, acceso o corrección o portabilidad","Do Not Sell or Share for Targeted Advertising":"No vender ni compartir para publicidad dirigida","Successfully Submitted!":"¡Enviado con éxito!","An error occurred. Please try again.":"Ocurrió un error. Por favor, inténtelo de nuevo."}');

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
/* harmony import */ var _language_support__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(132);
// load language support & determine lang based on url


// Version is injected by webpack DefinePlugin
// Accessible via: window.electroPrivacyVersion in browser console
if (typeof window !== 'undefined') {
    window.electroPrivacyVersion =  true ? "1.7.1" : 0;
}

let dsIdSet = false;
async function OptanonWrapperLocal() {
    window.dataLayer.push({
        event: 'OneTrustGroupsUpdated',
        OneTrustActiveGroups: window.OnetrustActiveGroups,
    });

    if (!dsIdSet) {
        const emailTitle = (0,_language_support__WEBPACK_IMPORTED_MODULE_0__/* .getLanguageString */ .M)('Behavioral Advertising Linked To Your Email Address:');
        const emailBlock = (0,_language_support__WEBPACK_IMPORTED_MODULE_0__/* .getLanguageString */ .M)('emailTextBlock');
        const emailLabel = (0,_language_support__WEBPACK_IMPORTED_MODULE_0__/* .getLanguageString */ .M)('Email:');
        const submit = (0,_language_support__WEBPACK_IMPORTED_MODULE_0__/* .getLanguageString */ .M)('Submit');
        const emailInstructions = (0,_language_support__WEBPACK_IMPORTED_MODULE_0__/* .getLanguageString */ .M)('Once you have made all of your elections, click “Save Settings” to save your settings and close the window.');
        const deletionRequests = (0,_language_support__WEBPACK_IMPORTED_MODULE_0__/* .getLanguageString */ .M)('Deletion, Access, Or Correction Requests');
        const deletionTextBlock1 = (0,_language_support__WEBPACK_IMPORTED_MODULE_0__/* .getLanguageString */ .M)('deletionTextBlock1');
        const deletionTextBlock2 = (0,_language_support__WEBPACK_IMPORTED_MODULE_0__/* .getLanguageString */ .M)('deletionTextBlock2');

        const otEmailHTML = `
            <hr/>
            <div id="ot-email-text" style="padding-top: 20px; display: none">
                <h3 style="font-size: 15px !important;">${emailTitle}</h3>
                <br/>
                <p>${emailBlock}</p>
                <form id="ot-email-submit" style="padding-top: 20px;" onsubmit="return false;">
                    <label for="ot-email">${emailLabel}
                        <input type="text" style="border: 1px solid #000 !important;" id="ot-email" name="ot-email" required maxlength="254" autocomplete="email" inputmode="email">
                        <input type="submit" style="border-radius: 4px; padding: 7px; border: 1px solid #000 !important;" id="ot-dns-submit" value="${submit}">
                    </label>
                </form>
                <div id="ot-submit-status" style="padding-top: 10px;"></div>
                <br/>
                <p>${emailInstructions}</p>
                 <br/><br/>
                <hr />
                <h3 style="padding-top: 20px; font-size: 15px !important;">${deletionRequests}</h3>
                <br />
                <p>${deletionTextBlock1}</p>
                <br />
                <p>${deletionTextBlock2}</p>
            </div>
        `;

        const targetedAdsTitle = (0,_language_support__WEBPACK_IMPORTED_MODULE_0__/* .getLanguageString */ .M)('Do Not Sell or Share for Targeted Advertising');
        const targetedAdsTextBlock = (0,_language_support__WEBPACK_IMPORTED_MODULE_0__/* .getLanguageString */ .M)('targetedAdsTextBlock');

        const dnsCustomText = `
            <div id="dns-custom-text" style="display: none">
                <h3 style="padding-top: 20px; font-size: 15px !important;">${targetedAdsTitle}</h3>
                <br />
                <p>${targetedAdsTextBlock}</p>
            </div>
        `;

        const otEmailForm = document.querySelectorAll('.ot-sdk-row.ot-cat-grp')[0];
        otEmailForm.insertAdjacentHTML('afterend', otEmailHTML);

        const otDnsText = document.getElementById('ot-pc-desc');
        otDnsText.insertAdjacentHTML('afterend', dnsCustomText);

        // show "on/off" text near the toggle
        const toggleTextContainer = document.createElement('div');
        toggleTextContainer.setAttribute('id', 'ot-checkbox-status');
        toggleTextContainer.setAttribute('style', 'position: relative; top: -5px; display: inline-block; margin-left: 5px;');
        const insertAfterThis = document.querySelectorAll('[data-optanongroupid="C0004"]')[0];
        const toggleContainer = insertAfterThis.querySelector('.ot-tgl');
        toggleContainer.appendChild(toggleTextContainer);

        dsIdSet = true;

        // import 2nd js file
        await Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 721));
    }
}




// removed global callback from ot library

// wait for needed elements to be created in document
// then do this init
function checkBeforeInit() {
    if (document.querySelectorAll('.ot-sdk-row.ot-cat-grp').length && document.getElementById('ot-pc-desc')) {
        OptanonWrapperLocal();
    } else {
        setTimeout(checkBeforeInit, 100);
    }
}
setTimeout(checkBeforeInit, 100);

/******/ })()
;
//# sourceMappingURL=otDnsScript1.js.map