/*! version: 1.2.1 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 115:
/***/ (() => {

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

if (window.electroPrivacyStaging) {
    url = ' https://privacyportaluat.onetrust.com/request/v1/consentreceipts';
    token =
        '"eyJhbGciOiJSUzUxMiJ9.eyJvdEp3dFZlcnNpb24iOjEsInByb2Nlc3NJZCI6IjBkZjc2NTAwLWRmNWEtNGQzMC1hOTFhLWFjZmMyMzAyZTFhNyIsInByb2Nlc3NWZXJzaW9uIjoxLCJpYXQiOiIyMDIyLTA5LTI2VDAzOjMyOjIxLjE2NyIsIm1vYyI6IkFQSSIsInBvbGljeV91cmkiOm51bGwsInN1YiI6IkVtYWlsIiwiaXNzIjpudWxsLCJ0ZW5hbnRJZCI6ImM1NzQ2ZTQzLWQyMjItNGI3ZS04ZjRkLTJiNzkzYjViZmFjZiIsImRlc2NyaXB0aW9uIjoiTi9BIiwiY29uc2VudFR5cGUiOiJDT05ESVRJT05BTFRSSUdHRVIiLCJhbGxvd05vdEdpdmVuQ29uc2VudHMiOmZhbHNlLCJkb3VibGVPcHRJbiI6ZmFsc2UsInB1cnBvc2VzIjpbeyJpZCI6IjljYjc2Yjk0LTY3NjYtNGY1MS04ZjRiLTFmNTE4YWNkZDE2NSIsInZlcnNpb24iOjIsInBhcmVudElkIjpudWxsLCJ0b3BpY3MiOltdLCJjdXN0b21QcmVmZXJlbmNlcyI6W10sImVuYWJsZUdlb2xvY2F0aW9uIjpmYWxzZX1dLCJub3RpY2VzIjpbXSwiZHNEYXRhRWxlbWVudHMiOltdLCJhdXRoZW50aWNhdGlvblJlcXVpcmVkIjpmYWxzZSwicmVjb25maXJtQWN0aXZlUHVycG9zZSI6ZmFsc2UsIm92ZXJyaWRlQWN0aXZlUHVycG9zZSI6dHJ1ZSwiZHluYW1pY0NvbGxlY3Rpb25Qb2ludCI6ZmFsc2UsImFkZGl0aW9uYWxJZGVudGlmaWVycyI6W10sIm11bHRpcGxlSWRlbnRpZmllclR5cGVzIjpmYWxzZSwiZW5hYmxlUGFyZW50UHJpbWFyeUlkZW50aWZpZXJzIjpmYWxzZSwicGFyZW50UHJpbWFyeUlkZW50aWZpZXJzVHlwZSI6bnVsbCwiYWRkaXRpb25hbFBhcmVudElkZW50aWZpZXJUeXBlcyI6W10sImVuYWJsZUdlb2xvY2F0aW9uIjpmYWxzZX0.MsM-CdCqBswZHRwR4N_E-RxcHlu368mLb9hIMUJTZ3U5FJMtdIQGr_AmqR5ik6Bx9RedlEZ87Kq8P9-dvPprz0OlHRPZeq-I56khj-C6lvB348mdM_Zr0V-nsBiX72wv6piNWqDJ6cogQRO_92QXZgjrbZYTHKrN5g2VxXqkJrKTQP9OfbIwfnTuK8W37jeLVcWh5KFVGtSC0Wgq64B1VnzwUpn3OGDmWLPp0rjqbE57kqy6eY6fX4d8mulZUpFH8lEqZ8i-xACXmze8lMBuijN26UI2PY6CL1KKfksNIXa9I4I43NBj5AIiaWDioUaQzAZZrqkxKRJGyY7mYbEcxFji5w8kPSfbMBnoRDHF9djVQdQ-gIcFwD_xn1m6NvgmWqeo-vZABn5s7Kg24nS_2Bb7TKk-b5-mrydpE5jMt85kawRCH7tue4F94Y--84ug64FU0cHafB9Byobw-ZCDQQ7Ua8AZVHIIqxDVzK-QZQSSF3OgBoDfhu1-1cM0yTGFDAkCXC7z1aEg2dTyQkG1jF-JEE2pF-jpDSi9hN9A5BRtG8Wh42E4MEj3Xo97y-8Xdnd0V61WDWaLSgVPUclMYdOyTBp_6_QESXqwEraMP6MGubqV_-Br4lbUVkkggvBARx6k46wPke-0u3NrWwgks627GS1DoO349dlVw2YT-YA"';
    preferences = '"purposes": [{"Id": "9cb76b94-6766-4f51-8f4b-1f518acdd165","TransactionType": "WITHDRAWN"}]';
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
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
    const targetingToggle = document.querySelectorAll('#ot-group-id-C0004[checked]')[0];
    const paidMarketingText = document.getElementById('ot-email-text');
    const emailInput = document.getElementById('ot-email-submit');
    const pcCatTitle = document.getElementById('ot-category-title');
    const catDescription = document.getElementById('ot-desc-id-C0004');
    const pcTitle = document.getElementById('ot-pc-title');

    pcTitle.textContent = 'Privacy Choices';

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

    if (targetingToggle) {
        // targetingToggle.click();
    } else {
        // do nothing;
    }

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
        const targetingToggle = document.querySelectorAll('#ot-group-id-C0004[checked]')[0];
        const paidMarketingText = document.getElementById('ot-email-text');
        const emailInput = document.getElementById('ot-email-submit');
        const pcCatTitle = document.getElementById('ot-category-title');
        const catDescription = document.getElementById('ot-desc-id-C0004');
        const pcTitle = document.getElementById('ot-pc-title');

        pcTitle.textContent = 'Your Privacy';

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
        document.getElementById('ot-email').setCustomValidity('Please enter a valid email.');

        document.getElementById('ot-dns-submit').addEventListener('click', inputValidation);
        document.getElementById('do-not-share').addEventListener('click', doNotShareUI);

        // footer link
        document.getElementById('ot-sdk-btn').addEventListener('click', hideDnsUI);

        // ot banner link
        if (document.getElementById('onetrust-pc-btn-handler')) {
            document.getElementById('onetrust-pc-btn-handler').addEventListener('click', hideDnsUI);
        }

        clearInterval(domCheckInterval);
        domCheckInterval = null;
    }
}


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
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
let dsIdSet = false;
async function OptanonWrapperLocal() {
    window.dataLayer.push({
        event: 'OneTrustGroupsUpdated',
        OneTrustActiveGroups: window.OnetrustActiveGroups,
    });

    if (dsIdSet == false) {
        let otEmailHTML = '<div id="ot-email-text" style="display: none">';
        otEmailHTML +=
            'You may have previously provided your email address to us. In some cases, we use email addresses or other ';
        otEmailHTML +=
            'non-cookie personal information to deliver behavioral advertising to consumers on third party platforms like ';
        otEmailHTML +=
            'Facebook and Google. To request that your personal information is not shared for these purposes, please ';
        otEmailHTML += 'enter your email address below:';
        otEmailHTML += '<form id="ot-email-submit" onsubmit="return false;">';
        otEmailHTML += '<label for="ot-email">Email: ';
        otEmailHTML += '<input type="email" id="ot-email" name="ot-email" required>';
        otEmailHTML += '<input type="submit" id="ot-dns-submit" value="Submit">';
        otEmailHTML += '</label></form><br>';
        otEmailHTML +=
            'Once you have made all of your elections, click “Save Settings” to save your settings and close the window.<br><br>';
        otEmailHTML += '<h3 style="font-size: .875em;">Deletion, Access, Or Correction Requests</h3>';
        otEmailHTML += 'If you are a U.S. consumer and would like to exercise other privacy rights,';
        otEmailHTML +=
            'such as a deletion, access, or correction request, please visit our <a href="//thecloroxcompany.com/">U.S. Data Subject Request</a> page.';
        otEmailHTML +=
            'If you are a consumer that resides outside the U.S., please visit the <a href="//thecloroxcompany.com/privacy/dsar/">International Data Subject Request</a> page.<br /><br />';
        otEmailHTML +=
            'For more information about additional privacy practices and choices available to you, please visit our <a href="//www.thecloroxcompany.com/privacy/">Privacy Policy</a>.';
        otEmailHTML += '</div>';

        let dnsCustomText = '<h3 style="font-size: .875em;">Do Not Sell or Share for Targeted Advertising</h3>';
        dnsCustomText +=
            '<div id="dns-custom-text" style="display: none">Under some state laws you have the right to opt out of the selling or sharing of your information for cross-context ';
        dnsCustomText +=
            'behavioral advertising and/or certain types of targeted advertising (“behavioral advertising”).<br><br>';

        const otEmailForm = document.querySelectorAll('.ot-sdk-row.ot-cat-grp')[0];
        otEmailForm.insertAdjacentHTML('afterend', otEmailHTML);

        const otDnsText = document.getElementById('ot-pc-desc');
        otDnsText.insertAdjacentHTML('afterend', dnsCustomText);

        dsIdSet = true;

        dnsCustomText +=
            'To turn off the  behavioral advertising cookies and trackers on this website, toggle “Targeting / Advertising ';
        dnsCustomText +=
            'Cookies” to “off” and click “Save Settings.” If the toggle is already set to “off” - you may have already updated ';
        dnsCustomText +=
            'your cookie settings, or the Global Privacy Control (“GPC”) signal may be enabled in your browser.';
        dnsCustomText += '<br><br>';
        dnsCustomText +=
            'In most cases, your opt-out preference will be tracked via a cookie, which means your selection is limited to the ';
        dnsCustomText +=
            'specific device and browser you are using during this visit to our website. If you visit this website from a ';
        dnsCustomText +=
            'different device or browser, change your browser settings, or if you clear your cookies, you may need to opt out again.';
        dnsCustomText +=
            'If you would like to updated other cookie-related preferences visit our <button id="ot-sdk-btn" class="ot-sdk-show-settings">Cookie Settings</button> link';

        // import 2nd js file
        await Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 115, 23));
    }

    // Optanon.InsertScript('otDnsScript2.js', 'body', null, null, 'C0001', true);
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

})();

/******/ })()
;