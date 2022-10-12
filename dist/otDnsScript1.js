/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 115:
/***/ (() => {

// / /////////////////////////////////////////////
//  Do Not Share script part two
// / /////////////////////////////////////////////

// Define variables
let otDataSubjectId;
let preferences;
let dnsUI = false;

// Collection Point Information
const url = ' https://privacyportaluat.onetrust.com/request/v1/consentreceipts';
const token =
    '"eyJhbGciOiJSUzUxMiJ9.eyJvdEp3dFZlcnNpb24iOjEsInByb2Nlc3NJZCI6IjBkZjc2NTAwLWRmNWEtNGQzMC1hOTFhLWFjZmMyMzAyZTFhNyIsInByb2Nlc3NWZXJzaW9uIjoxLCJpYXQiOiIyMDIyLTA5LTI2VDAzOjMyOjIxLjE2NyIsIm1vYyI6IkFQSSIsInBvbGljeV91cmkiOm51bGwsInN1YiI6IkVtYWlsIiwiaXNzIjpudWxsLCJ0ZW5hbnRJZCI6ImM1NzQ2ZTQzLWQyMjItNGI3ZS04ZjRkLTJiNzkzYjViZmFjZiIsImRlc2NyaXB0aW9uIjoiTi9BIiwiY29uc2VudFR5cGUiOiJDT05ESVRJT05BTFRSSUdHRVIiLCJhbGxvd05vdEdpdmVuQ29uc2VudHMiOmZhbHNlLCJkb3VibGVPcHRJbiI6ZmFsc2UsInB1cnBvc2VzIjpbeyJpZCI6IjljYjc2Yjk0LTY3NjYtNGY1MS04ZjRiLTFmNTE4YWNkZDE2NSIsInZlcnNpb24iOjIsInBhcmVudElkIjpudWxsLCJ0b3BpY3MiOltdLCJjdXN0b21QcmVmZXJlbmNlcyI6W10sImVuYWJsZUdlb2xvY2F0aW9uIjpmYWxzZX1dLCJub3RpY2VzIjpbXSwiZHNEYXRhRWxlbWVudHMiOltdLCJhdXRoZW50aWNhdGlvblJlcXVpcmVkIjpmYWxzZSwicmVjb25maXJtQWN0aXZlUHVycG9zZSI6ZmFsc2UsIm92ZXJyaWRlQWN0aXZlUHVycG9zZSI6dHJ1ZSwiZHluYW1pY0NvbGxlY3Rpb25Qb2ludCI6ZmFsc2UsImFkZGl0aW9uYWxJZGVudGlmaWVycyI6W10sIm11bHRpcGxlSWRlbnRpZmllclR5cGVzIjpmYWxzZSwiZW5hYmxlUGFyZW50UHJpbWFyeUlkZW50aWZpZXJzIjpmYWxzZSwicGFyZW50UHJpbWFyeUlkZW50aWZpZXJzVHlwZSI6bnVsbCwiYWRkaXRpb25hbFBhcmVudElkZW50aWZpZXJUeXBlcyI6W10sImVuYWJsZUdlb2xvY2F0aW9uIjpmYWxzZX0.MsM-CdCqBswZHRwR4N_E-RxcHlu368mLb9hIMUJTZ3U5FJMtdIQGr_AmqR5ik6Bx9RedlEZ87Kq8P9-dvPprz0OlHRPZeq-I56khj-C6lvB348mdM_Zr0V-nsBiX72wv6piNWqDJ6cogQRO_92QXZgjrbZYTHKrN5g2VxXqkJrKTQP9OfbIwfnTuK8W37jeLVcWh5KFVGtSC0Wgq64B1VnzwUpn3OGDmWLPp0rjqbE57kqy6eY6fX4d8mulZUpFH8lEqZ8i-xACXmze8lMBuijN26UI2PY6CL1KKfksNIXa9I4I43NBj5AIiaWDioUaQzAZZrqkxKRJGyY7mYbEcxFji5w8kPSfbMBnoRDHF9djVQdQ-gIcFwD_xn1m6NvgmWqeo-vZABn5s7Kg24nS_2Bb7TKk-b5-mrydpE5jMt85kawRCH7tue4F94Y--84ug64FU0cHafB9Byobw-ZCDQQ7Ua8AZVHIIqxDVzK-QZQSSF3OgBoDfhu1-1cM0yTGFDAkCXC7z1aEg2dTyQkG1jF-JEE2pF-jpDSi9hN9A5BRtG8Wh42E4MEj3Xo97y-8Xdnd0V61WDWaLSgVPUclMYdOyTBp_6_QESXqwEraMP6MGubqV_-Br4lbUVkkggvBARx6k46wPke-0u3NrWwgks627GS1DoO349dlVw2YT-YA"';
// Purpose Ids Assigned to Collection Point

// make POST call to hit collection point
function setPreferences(otDataSubjectId) {
    // preferences = '"purposes":[{"Id":' + purpose1 + ',"TransactionType": "OPT_OUT"}]';
    preferences = '"purposes": [{"Id": "9cb76b94-6766-4f51-8f4b-1f518acdd165","TransactionType": "WITHDRAWN"}]';

    const body = `{"identifier":"${otDataSubjectId}","requestInformation":${token},${preferences}}`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(body);
    console.log(body);
}

// set variable for Email Submit button
const submitBtn = document.getElementById('submit');

// email format validation
function validateEmail(email) {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// if email input is valid, trigger submitPreferences function and disable text input field and submit button
function inputValidation() {
    const emailInputValue = document.getElementById('ot-email').value;
    const textInput = document.getElementById('ot-email');
    const confirmSubmit =
        '<div id="ot-submit-text" style="display: inline; margin-left: 10px !important;">Successfully Submitted!</div>';
    const otEmailSubmit = document.querySelectorAll('#ot-email-submit #submit')[0];

    otEmailSubmit.insertAdjacentHTML('afterend', confirmSubmit);

    if (validateEmail(emailInputValue)) {
        console.log(`email returned valid; emailInputValue = ${emailInputValue}`);
        submitPreferences();
        textInput.disabled = true;
        document.getElementById('submit').disabled = true;
    } else {
        console.log(`function returned false; emailInputValue = ${emailInputValue}`);
        console.log('invalid email');
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

    pcTitle.textContent = 'Do Not Share My Personal Information';

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
setTimeout(() => {
    document.getElementById('submit').addEventListener('click', inputValidation);
    document.getElementById('do-not-share').addEventListener('click', doNotShareUI);
    document.getElementById('accept-recommended-btn-handler').addEventListener('click', hideDnsUI);
    document
        .querySelectorAll('.save-preference-btn-handler.onetrust-close-btn-handler')[0]
        .addEventListener('click', hideDnsUI);
}, 200);


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
async function OptanonWrapper() {
    window.dataLayer.push({
        event: 'OneTrustGroupsUpdated',
        OneTrustActiveGroups: window.OnetrustActiveGroups,
    });

    if (dsIdSet == false) {
        let otEmailHTML = '<div id="ot-email-text" style="display: none">';
        otEmailHTML +=
            'To request that your personal information is not shared for these purposes outside of the cookie context,';
        otEmailHTML +=
            ' we will need your email address. You will not need to provide us with your email address again';
        otEmailHTML += ' if you visit from a different device or browser:';
        otEmailHTML += '<form id="ot-email-submit" onsubmit="return false;">';
        otEmailHTML += '<label for="ot-email">Email: ';
        otEmailHTML += '<input type="email" id="ot-email" name="ot-email">';
        otEmailHTML += '<input type="submit" id="submit" value="Submit">';
        otEmailHTML += '</label></form></div>';

        let dnsCustomText =
            '<div id="dns-custom-text" style="display: none">Under some state laws you have the right to opt out of cross-context behavioral ';
        dnsCustomText +=
            'advertising and/or certain types of targeted advertising (“behavioral advertising”).<br><br>To turn off the ';
        dnsCustomText +=
            'behavioral advertising cookies and trackers on this website toggle “Targeting / Advertising” cookies to “off” ';
        dnsCustomText +=
            'and click “Confirm My Choices.”   Note that your opt-out preference will be tracked via a cookie which, means ';
        dnsCustomText +=
            'your selection is limited to the specific device and browser you are using during this visit to our website. ';
        dnsCustomText +=
            'If you visit this website from a different device or browser, or if you clear your cookies, you will need to opt out again.</div>';
        const otEmailForm = document.querySelectorAll('.ot-sdk-row.ot-cat-grp')[0];
        otEmailForm.insertAdjacentHTML('afterend', otEmailHTML);

        const otDnsText = document.getElementById('ot-pc-desc');
        otDnsText.insertAdjacentHTML('afterend', dnsCustomText);

        dsIdSet = true;

        // import 2nd js file
        await Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 115, 23));
    }

    // Optanon.InsertScript('otDnsScript2.js', 'body', null, null, 'C0001', true);
}
// make global
window.OptanonWrapper = OptanonWrapper;

})();

/******/ })()
;