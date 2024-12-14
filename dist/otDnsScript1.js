/*! version: 1.4.5 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 132:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

// console.log('languageMap keys', Object.keys(window.ElectroPrivacyLanguageMap));

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


/***/ }),

/***/ 478:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _language_support__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(132);
// / /////////////////////////////////////////////
//  Do Not Share script part two
// / /////////////////////////////////////////////


// Define variables
let otDataSubjectId;
let dnsUI = false;

// Collection Point Information
let url = 'https://privacyportal.onetrust.com/request/v1/consentreceipts';
let token =
    '"eyJhbGciOiJSUzUxMiJ9.eyJvdEp3dFZlcnNpb24iOjEsInByb2Nlc3NJZCI6ImUxNDMwZTBkLWUzNTgtNGQ4NC1hNGViLTVmMjI3OTRmZGQwZCIsInByb2Nlc3NWZXJzaW9uIjoxLCJpYXQiOiIyMDIyLTEyLTA5VDE3OjQxOjAxLjg4IiwibW9jIjoiQVBJIiwicG9saWN5X3VyaSI6bnVsbCwic3ViIjoiRW1haWwiLCJpc3MiOm51bGwsInRlbmFudElkIjoiNjVjYTZiNDYtNzBiMS00ZWUxLTkwNzQtN2E2M2U4MDBlYTRjIiwiZGVzY3JpcHRpb24iOiJFbmRwb2ludCBmb3Igd2ViIG1vZGFscyIsImNvbnNlbnRUeXBlIjoiQ09ORElUSU9OQUxUUklHR0VSIiwiYWxsb3dOb3RHaXZlbkNvbnNlbnRzIjpmYWxzZSwiZG91YmxlT3B0SW4iOmZhbHNlLCJwdXJwb3NlcyI6W3siaWQiOiI1MjhkZTE1MC1iNWYzLTQ2N2QtYmUxMS03NTc3NTY2MDEyMjQiLCJ2ZXJzaW9uIjoxLCJwYXJlbnRJZCI6bnVsbCwidG9waWNzIjpbXSwiY3VzdG9tUHJlZmVyZW5jZXMiOltdLCJlbmFibGVHZW9sb2NhdGlvbiI6ZmFsc2V9XSwibm90aWNlcyI6W10sImRzRGF0YUVsZW1lbnRzIjpbXSwiYXV0aGVudGljYXRpb25SZXF1aXJlZCI6ZmFsc2UsInJlY29uZmlybUFjdGl2ZVB1cnBvc2UiOmZhbHNlLCJvdmVycmlkZUFjdGl2ZVB1cnBvc2UiOnRydWUsImR5bmFtaWNDb2xsZWN0aW9uUG9pbnQiOmZhbHNlLCJhZGRpdGlvbmFsSWRlbnRpZmllcnMiOltdLCJtdWx0aXBsZUlkZW50aWZpZXJUeXBlcyI6ZmFsc2UsImVuYWJsZVBhcmVudFByaW1hcnlJZGVudGlmaWVycyI6ZmFsc2UsInBhcmVudFByaW1hcnlJZGVudGlmaWVyc1R5cGUiOm51bGwsImFkZGl0aW9uYWxQYXJlbnRJZGVudGlmaWVyVHlwZXMiOltdLCJlbmFibGVHZW9sb2NhdGlvbiI6ZmFsc2V9.g2zafM0cd3qCeVZEXR1AzZfFL6n277n8xPRxGaIUi5oIRoyeDH5ESKvbXT1b4wN1pVzTXZJIl2TKXfHOxzhszfA7oX0gUoYsV6xw_GQIUkF4m8Qly_Pv8r_A0XK4QgvH5iCKcfTmNxOBXRF8vcPj8kT5Rh8G7RsuR6o1rfWBg4IaLPfG3ip7xMo8p2Z4elL3hcTi8dsEJkdSbxyugVOyqydo7Djibq5AtX4l4tI5cWRlf1eG5F1Gr9yBcCzeHl3O-mPx3j344PGgz-AYixQpWhztFUJa13NaD4gycCqNiDbeHqQ16U-696E8lM7uUJ3921qDQQoSAqV6uDnELYHuCi27VDYM8RCzaq9zloWs8G5bSRPSbHIP-YvJUKdHrzjT8_B7ZDBG1efnqMcrqMrQHErG2yDVD_DhlDBLwpokkWpmt3ryYvn9jd4Tk615J73Mxpxu2NpaXnuaothZSXRXIxL7BYUP-PS5y2edp18SKS7eXOWrU0ahEPXKKWhIfXVE7t_PSER8ZO-E-8oLtzMHfbK2bRIS44N37yUGEpmd8Th6ovZiQvTtxBkC0dJbd0FGM4su7NRXyoNY_8dHbXGc9GC1M9P54Ke4pyFfVKrcD4spavrSj2wxiqToTPFpaeFxK8XJn9xENM3_ATJhGpW19CayJm2sesiqaambsymutsk"';
let preferences = '"purposes": [{"Id": "528de150-b5f3-467d-be11-757756601224","TransactionType": "WITHDRAWN"}]';

if (window.electroPrivacyStaging || isNonProduction()) {
    url = ' https://privacyportaluat.onetrust.com/request/v1/consentreceipts';
    token =
        '"eyJhbGciOiJSUzUxMiJ9.eyJvdEp3dFZlcnNpb24iOjEsInByb2Nlc3NJZCI6IjBkZjc2NTAwLWRmNWEtNGQzMC1hOTFhLWFjZmMyMzAyZTFhNyIsInByb2Nlc3NWZXJzaW9uIjoxLCJpYXQiOiIyMDIyLTA5LTI2VDAzOjMyOjIxLjE2NyIsIm1vYyI6IkFQSSIsInBvbGljeV91cmkiOm51bGwsInN1YiI6IkVtYWlsIiwiaXNzIjpudWxsLCJ0ZW5hbnRJZCI6ImM1NzQ2ZTQzLWQyMjItNGI3ZS04ZjRkLTJiNzkzYjViZmFjZiIsImRlc2NyaXB0aW9uIjoiTi9BIiwiY29uc2VudFR5cGUiOiJDT05ESVRJT05BTFRSSUdHRVIiLCJhbGxvd05vdEdpdmVuQ29uc2VudHMiOmZhbHNlLCJkb3VibGVPcHRJbiI6ZmFsc2UsInB1cnBvc2VzIjpbeyJpZCI6IjljYjc2Yjk0LTY3NjYtNGY1MS04ZjRiLTFmNTE4YWNkZDE2NSIsInZlcnNpb24iOjIsInBhcmVudElkIjpudWxsLCJ0b3BpY3MiOltdLCJjdXN0b21QcmVmZXJlbmNlcyI6W10sImVuYWJsZUdlb2xvY2F0aW9uIjpmYWxzZX1dLCJub3RpY2VzIjpbXSwiZHNEYXRhRWxlbWVudHMiOltdLCJhdXRoZW50aWNhdGlvblJlcXVpcmVkIjpmYWxzZSwicmVjb25maXJtQWN0aXZlUHVycG9zZSI6ZmFsc2UsIm92ZXJyaWRlQWN0aXZlUHVycG9zZSI6dHJ1ZSwiZHluYW1pY0NvbGxlY3Rpb25Qb2ludCI6ZmFsc2UsImFkZGl0aW9uYWxJZGVudGlmaWVycyI6W10sIm11bHRpcGxlSWRlbnRpZmllclR5cGVzIjpmYWxzZSwiZW5hYmxlUGFyZW50UHJpbWFyeUlkZW50aWZpZXJzIjpmYWxzZSwicGFyZW50UHJpbWFyeUlkZW50aWZpZXJzVHlwZSI6bnVsbCwiYWRkaXRpb25hbFBhcmVudElkZW50aWZpZXJUeXBlcyI6W10sImVuYWJsZUdlb2xvY2F0aW9uIjpmYWxzZX0.MsM-CdCqBswZHRwR4N_E-RxcHlu368mLb9hIMUJTZ3U5FJMtdIQGr_AmqR5ik6Bx9RedlEZ87Kq8P9-dvPprz0OlHRPZeq-I56khj-C6lvB348mdM_Zr0V-nsBiX72wv6piNWqDJ6cogQRO_92QXZgjrbZYTHKrN5g2VxXqkJrKTQP9OfbIwfnTuK8W37jeLVcWh5KFVGtSC0Wgq64B1VnzwUpn3OGDmWLPp0rjqbE57kqy6eY6fX4d8mulZUpFH8lEqZ8i-xACXmze8lMBuijN26UI2PY6CL1KKfksNIXa9I4I43NBj5AIiaWDioUaQzAZZrqkxKRJGyY7mYbEcxFji5w8kPSfbMBnoRDHF9djVQdQ-gIcFwD_xn1m6NvgmWqeo-vZABn5s7Kg24nS_2Bb7TKk-b5-mrydpE5jMt85kawRCH7tue4F94Y--84ug64FU0cHafB9Byobw-ZCDQQ7Ua8AZVHIIqxDVzK-QZQSSF3OgBoDfhu1-1cM0yTGFDAkCXC7z1aEg2dTyQkG1jF-JEE2pF-jpDSi9hN9A5BRtG8Wh42E4MEj3Xo97y-8Xdnd0V61WDWaLSgVPUclMYdOyTBp_6_QESXqwEraMP6MGubqV_-Br4lbUVkkggvBARx6k46wPke-0u3NrWwgks627GS1DoO349dlVw2YT-YA"';
    preferences = '"purposes": [{"Id": "9cb76b94-6766-4f51-8f4b-1f518acdd165","TransactionType": "WITHDRAWN"}]';
}

// check url against known list of non-production environments
function isNonProduction()
{
    const testList = [
        'lndo.site',
        'pantheonsite',
        'staging',
        'qa',
        'dev',
        'local',
    ];
    const serverName = location.host;
    if (testList.some(testString => serverName.includes(testString))) {
        return true;
    }
    return false;
}

// Purpose Ids Assigned to Collection Point

// make POST call to hit collection point
function setPreferences(otDataSubjectId) {
    // set above based on production or staging
    // preferences = '"purposes":[{"Id":' + purpose1 + ',"TransactionType": "OPT_OUT"}]';
    // preferences = '"purposes": [{"Id": "528de150-b5f3-467d-be11-757756601224","TransactionType": "WITHDRAWN"}]';

    const body = `{"identifier":"${otDataSubjectId}","requestInformation":${token},${preferences}}`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(body);
    //console.log(body);
}

const re =
    /^(([^<>\(\)\[\]\\.,;:\s@"]+(\.[^<>\(\)\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// email format validation
function validateEmail(email) {
    return re.test(String(email).toLowerCase());
}

// if email input is valid, trigger submitPreferences function and disable text input field and submit button
function inputValidation() {
    const emailInputValue = document.getElementById('ot-email').value;
    const textInput = document.getElementById('ot-email');

    if (validateEmail(emailInputValue)) {
        // console.log(`email returned valid; emailInputValue = ${emailInputValue}`);
        submitPreferences();
        textInput.disabled = true;
        document.getElementById('ot-dns-submit').disabled = true;

        const confirmSubmit =
            '<div id="ot-submit-text" style="display: inline; margin-left: 10px !important;">Successfully Submitted!</div>';
        const otEmailSubmit = document.querySelectorAll('#ot-email-submit #ot-dns-submit')[0];
        otEmailSubmit.insertAdjacentHTML('afterend', confirmSubmit);
    } else {
        //console.log(`function returned false; emailInputValue = ${emailInputValue}`);
        //console.log('invalid email');
    }
}

// grab email input value and trigger API POST
function submitPreferences() {
    // grab value from email form field
    otDataSubjectId = document.getElementById('ot-email').value;

    if (otDataSubjectId === '') {
        console.error('Identifier Not Set');
    }
    // else if(OnetrustActiveGroups === ",," && saveButtonClicked === false){
    //    console.warn("New Preferences Set")
    //    setTimeout(setPreferences,100);
    // }
    else {
        setTimeout(setPreferences(otDataSubjectId), 100);
    }
}

// when clicking on "Do Not Share" footer link:
// - hide cookie categories BESIDES targeting
// - show email input DIV
// - simulate click on Targeting to toggle off (may be removed depending on Clorox decision about UX)
function doNotShareUI() {
    // let stockText = document.getElementById("stock-text");
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
    pcTitle.textContent = (0,_language_support__WEBPACK_IMPORTED_MODULE_0__/* .getLanguageString */ .M)('Privacy Choices');

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
    document.querySelectorAll('#ot-group-id-C0004')[0].dispatchEvent(new Event('change'))
    document.getElementById('ot-checkbox-status').style.display = 'position: relative; top: -5px; display: inline-block; margin-left: 5px;';

    dnsUI = true;
}

// reverse everything from doNotShareUI function once clicking of CTA
function hideDnsUI() {
    if (dnsUI) {
        // let stockText = document.getElementById("stock-text");
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
    }

    dnsUI = false;
}

// adding click event listeners to email submit button in DNS UI and CTAs
let domCheckInterval = setInterval(dnsCheck, 100);
function dnsCheck() {
    if (document.getElementById('do-not-share') != null) {
        // add pattern to email input
        document.getElementById('ot-email').pattern = re;
        document.getElementById('ot-email').setCustomValidity((0,_language_support__WEBPACK_IMPORTED_MODULE_0__/* .getLanguageString */ .M)('Please enter a valid email.'));

        document.getElementById('ot-dns-submit').addEventListener('click', inputValidation);

        // add handling for buttons being recreated (dtc shop)
        document.addEventListener('click', function(e) {
            const sdkButton = document.getElementById('ot-sdk-btn');
            const dnsButton = document.getElementById('do-not-share');
            if (e.target && e.target.id === 'ot-sdk-btn' || sdkButton && sdkButton.contains(e.target)) {
                hideDnsUI();
            } else if (e.target && e.target.id === 'do-not-share' || dnsButton && dnsButton.contains(e.target)) {
                doNotShareUI();
            }
        }, {
            capture: true
        })

        /*
        document.getElementById('do-not-share').addEventListener('click', doNotShareUI);
        document.getElementById('ot-sdk-btn').addEventListener('click', hideDnsUI);
         */

        // ot banner link
        if (document.getElementById('onetrust-pc-btn-handler')) {
            document.getElementById('onetrust-pc-btn-handler').addEventListener('click', hideDnsUI);
        }

        // ESC key handling to close
        //  Needed with onetrust-banner-sdk changes in
        //  v202304.1.0 - which can remove keyboard handler when cookies popup closes
        document.addEventListener('keydown', function(e) {
            if ('Escape' === e.code) {
                // click dialog close button
                const close = document.getElementById('close-pc-btn-handler');
                if (close) {
                    close.click();
                }
            }
        });

        // listen for styled checkbox state
        document.querySelectorAll('#ot-group-id-C0004')[0].addEventListener('change', function () {
            document.getElementById('ot-checkbox-status').textContent = this.checked ? (0,_language_support__WEBPACK_IMPORTED_MODULE_0__/* .getLanguageString */ .M)('On') : (0,_language_support__WEBPACK_IMPORTED_MODULE_0__/* .getLanguageString */ .M)('Off');
        });

        clearInterval(domCheckInterval);
        domCheckInterval = null;
    }
}


/***/ }),

/***/ 286:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"emailTextBlock":"You may have previously provided your email address to us. In some cases, we may use email addresses or other non-cookie personal information to deliver behavioral advertising to consumers via third parties such as Amazon, Facebook, Google, Omnicom, and Walmart. To request that your personal information is not shared for these purposes, please enter your email address below:","deletionTextBlock1":"If you are a U.S. consumer and would like to submit other privacy requests, please visit our <a target=\\"_blank\\" href=\\"//privacyportal.onetrust.com/webform/65ca6b46-70b1-4ee1-9074-7a63e800ea4c/7baf0e2e-4724-44fe-af48-4138faca9d23\\">U.S. Data Subject Request</a> page.","deletionTextBlock2":"For more information about additional privacy practices and choices available to you, please visit our <a target=\\"_blank\\" href=\\"//thecloroxcompany.com/privacy/\\">Privacy Policy</a>.","targetedAdsTextBlock":"Under some state laws you have the right to opt out of the selling or sharing of your information for cross-context behavioral advertising and/or certain types of targeted advertising (“behavioral advertising”).<br><br>To turn off the  behavioral advertising cookies and trackers on this website, toggle “Targeting / Advertising Cookies” to “off” and click “Save Settings.” If the toggle is already set to “off” - you may have already updated your cookie settings, or the Global Privacy Control (“GPC”) signal may be enabled in your browser.<br><br>In most cases, your opt-out preference will be tracked via a cookie, which means your selection is limited to the specific device and browser you are using during this visit to our website. If you visit this website from a different device or browser, change your browser settings, or if you clear your cookies, you may need to opt out again.<br><br>If you would like to update other cookie-related preferences visit the \\"Cookie Settings\\" link in the footer of this webpage.<br /><br />Additionally, you may have the right to obtain a list of specific third parties (as defined under applicable law) to which we may have disclosed personal information. That information can be found below.","Privacy Choices":"Privacy Choices","Please enter a valid email.":"Please enter a valid email.","On":"On","Off":"Off","Behavioral Advertising Linked To Your Email Address:":"Behavioral Advertising Linked To Your Email Address:","Email:":"Email:","Submit":"Submit","Once you have made all of your elections, click “Save Settings” to save your settings and close the window.":"Once you have made all of your elections, click “Save Settings” to save your settings and close the window.","Deletion, Access, Or Correction Requests":"Deletion, Access, Correction, or Portability Requests","Do Not Sell or Share for Targeted Advertising":"Do Not Sell or Share for Targeted Advertising"}');

/***/ }),

/***/ 331:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"emailTextBlock":"Es posible que nos haya proporcionado previamente su dirección de correo electrónico. En algunos casos, utilizamos direcciones de correo electrónico u otra información personal que no sea de cookies para entregar publicidad conductual a los consumidores en plataformas de terceros como Amazon, Facebook, Google, Omnicom y Walmart. Para solicitar que su información personal no se comparta para estos fines, ingrese su dirección de correo electrónico a continuación:","deletionTextBlock1":"Si usted es un consumidor estadounidense y desea ejercer otros derechos de privacidad, como una solicitud de eliminación, acceso o corrección, visite nuestra página de <a target=\\"_blank\\" href=\\"//privacyportal.onetrust.com/webform/65ca6b46-70b1-4ee1-9074-7a63e800ea4c/7baf0e2e-4724-44fe-af48-4138faca9d23\\">Solicitud del sujeto de datos de EE. UU.</a>","deletionTextBlock2":"Para obtener más información sobre las prácticas de privacidad adicionales y las opciones disponibles para usted, visite nuestra <a target=\\"_blank\\" href=\\"//thecloroxcompany.com/privacy/es-privacy/\\">Política de privacidad.</a>","targetedAdsTextBlock":"En virtud de algunas leyes estatales, usted tiene derecho a excluirse de la venta o el intercambio de su información para publicidad conductual entre contextos y/o ciertos tipos de publicidad dirigida (“publicidad conductual”).<br><br>Para desactivar las cookies de publicidad conductual y los rastreadores en este sitio web, cambie “Cookies de publicidad/dirigidas” a “desactivado” y haga clic en “Guardar configuración”. Si el conmutador ya está configurado en “desactivado”, es posible que ya haya actualizado su configuración de cookies o que la señal de Control de Privacidad Global (Global Privacy Control, “GPC”) esté habilitada en su navegador.<br><br>En la mayoría de los casos, se hará un seguimiento de su preferencia de exclusión mediante una cookie, lo que significa que su selección se limita al dispositivo y navegador específicos que está utilizando durante esta visita a nuestro sitio web. Si visita este sitio web desde un dispositivo o navegador diferente, cambia la configuración de su navegador o si borra sus cookies, es posible que deba excluirse nuevamente.<br><br>Si desea actualizar otras preferencias relacionadas con cookies, visite el enlace \\"Configuración de cookies\\" en el pie de página de esta página web.","Privacy Choices":"Sus opciones de privacidad","Please enter a valid email.":"Ingrese un correo electrónico válido","On":"Habilitadas","Off":"Deshabilitadas","Behavioral Advertising Linked To Your Email Address:":"Publicidad conductual vinculada a su dirección de correo electrónico:","Email:":"Correo electrónico:","Submit":"Enviar","Once you have made all of your elections, click “Save Settings” to save your settings and close the window.":"Una vez que haya realizado todas sus elecciones, haga clic en “Guardar configuración” para guardar su configuración y cerrar la ventana.","Deletion, Access, Or Correction Requests":"Solicitudes de eliminación, acceso o corrección","Do Not Sell or Share for Targeted Advertising":"No vender ni compartir para publicidad dirigida"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
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
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/* harmony import */ var _language_support__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(132);
// load language support & determine lang based on url



let dsIdSet = false;
async function OptanonWrapperLocal() {
    window.dataLayer.push({
        event: 'OneTrustGroupsUpdated',
        OneTrustActiveGroups: window.OnetrustActiveGroups,
    });

    if (dsIdSet == false) {
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
                        <input type="email" style="border: 1px solid #000 !important;" id="ot-email" name="ot-email" required>
                        <input type="submit" style="border-radius: 4px; padding: 7px; border: 1px solid #000 !important;" id="ot-dns-submit" value="${submit}">
                    </label>
                </form>
                <br/>
                <p>${emailInstructions}</p>
                 <br/><br/>
                <hr />
                <h3 style="style="padding-top: 20px; font-size: 15px !important;">${deletionRequests}</h3>
                <br />
                <p>${deletionTextBlock1}</p>
                <br />
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
        await Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 478));
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