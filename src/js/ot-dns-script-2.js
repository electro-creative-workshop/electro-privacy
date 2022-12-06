// / /////////////////////////////////////////////
//  Do Not Share script part two
// / /////////////////////////////////////////////

// Define variables
let otDataSubjectId;
let preferences;
let dnsUI = false;

// Collection Point Information
const url = 'https://privacyportaluat.onetrust.com/request/v1/consentreceipts';
const token =
    'eyJhbGciOiJSUzUxMiJ9.eyJvdEp3dFZlcnNpb24iOjEsInByb2Nlc3NJZCI6IjBkZjc2NTAwLWRmNWEtNGQzMC1hOTFhLWFjZmMyMzAyZTFhNyIsInByb2Nlc3NWZXJzaW9uIjoyLCJpYXQiOiIyMDIyLTA5LTI2VDAzOjMyOjIxLjE2NyIsIm1vYyI6IkFQSSIsInBvbGljeV91cmkiOm51bGwsInN1YiI6IkVtYWlsIiwiaXNzIjpudWxsLCJ0ZW5hbnRJZCI6ImM1NzQ2ZTQzLWQyMjItNGI3ZS04ZjRkLTJiNzkzYjViZmFjZiIsImRlc2NyaXB0aW9uIjoiTi9BIiwiY29uc2VudFR5cGUiOiJDT05ESVRJT05BTFRSSUdHRVIiLCJhbGxvd05vdEdpdmVuQ29uc2VudHMiOmZhbHNlLCJkb3VibGVPcHRJbiI6ZmFsc2UsInB1cnBvc2VzIjpbeyJpZCI6IjljYjc2Yjk0LTY3NjYtNGY1MS04ZjRiLTFmNTE4YWNkZDE2NSIsInZlcnNpb24iOjIsInBhcmVudElkIjpudWxsLCJ0b3BpY3MiOltdLCJjdXN0b21QcmVmZXJlbmNlcyI6W10sImVuYWJsZUdlb2xvY2F0aW9uIjpmYWxzZX1dLCJub3RpY2VzIjpbXSwiZHNEYXRhRWxlbWVudHMiOltdLCJhdXRoZW50aWNhdGlvblJlcXVpcmVkIjpmYWxzZSwicmVjb25maXJtQWN0aXZlUHVycG9zZSI6ZmFsc2UsIm92ZXJyaWRlQWN0aXZlUHVycG9zZSI6dHJ1ZSwiZHluYW1pY0NvbGxlY3Rpb25Qb2ludCI6ZmFsc2UsImFkZGl0aW9uYWxJZGVudGlmaWVycyI6bnVsbCwibXVsdGlwbGVJZGVudGlmaWVyVHlwZXMiOmZhbHNlLCJlbmFibGVQYXJlbnRQcmltYXJ5SWRlbnRpZmllcnMiOmZhbHNlLCJwYXJlbnRQcmltYXJ5SWRlbnRpZmllcnNUeXBlIjpudWxsLCJhZGRpdGlvbmFsUGFyZW50SWRlbnRpZmllclR5cGVzIjpbXSwiZW5hYmxlR2VvbG9jYXRpb24iOmZhbHNlfQ.owhHskl9t5d9doT4gfB2ZhtQsnTupr6J8Ppu2YV2NijxlRYw3nB-2JcpF5bV6zRSS4psKnDn5xB7QvKb-KlXc41XIRi8hOuMMLHtEc_2BNZXoaxwjzVmTCFQIsLN8LGIqcYegT7YUvzTdOoBbjfQLqjHoiVqS_Ncjc7TBHHV6-pWfh4SO0YPMtx-MxOZAPw8JpLrhDYuZliYCQgKyboINToqPjUIfgRwUFO6GYklE7V5slfj9R-Z3dTk0VnWE9_O_9_NPTjmwJNEzBoxcCCczhuoTET4Mi4gLMR71uG4VuMgFbKEbVf6mJXMPsRyLyMu8GWu3SXxQH9-mC-qeItmZeVacO2q3D5XjZEeEXK5vlP023DNmHxT4iMe1BwA6HPJD2s0qLtfWg4Xz0TvRf6wmn8pVmqqs0uwk2VRD-2gQYTfDb0LuaJsYxyxTJZQbwsDuvGrG-rms4mUC0F43_pcR6ODQCz3jOrRcLVjQIaYhzQv7oAWd5ISQ1jNm5dTdUTRZ6ciL82AQrdkxzWqfx6uRGbdpSwV0e1yUv0Ngf-hQkmh2a3y8iFZEoik-41AghyTmczV7tF_s2mNmJJqgTBJvtU6T4sujvT4Ua-EnCWMfteDGUmfHpp-wYfgHzru8OD2UQsh5NO2UVMn5tHihj_5gqoRgkZXtdBg4Z1Gyje747Y';
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
        console.log(`email returned valid; emailInputValue = ${emailInputValue}`);
        submitPreferences();
        textInput.disabled = true;
        document.getElementById('submit').disabled = true;

        const confirmSubmit =
            '<div id="ot-submit-text" style="display: inline; margin-left: 10px !important;">Successfully Submitted!</div>';
        const otEmailSubmit = document.querySelectorAll('#ot-email-submit #submit')[0];
        otEmailSubmit.insertAdjacentHTML('afterend', confirmSubmit);
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
    // add pattern to email input
    document.getElementById('ot-email').pattern = re;
    document.getElementById('ot-email').setCustomValidity('Please enter a valid email.');

    document.getElementById('submit').addEventListener('click', inputValidation);
    document.getElementById('do-not-share').addEventListener('click', doNotShareUI);

    // footer link
    document.getElementById('ot-sdk-btn').addEventListener('click', hideDnsUI);

    // ot banner link
    if (document.getElementById('onetrust-pc-btn-handler')) {
        document.getElementById('onetrust-pc-btn-handler').addEventListener('click', hideDnsUI);
    }

    /*
    document.getElementById('accept-recommended-btn-handler').addEventListener('click', hideDnsUI);
    document
        .querySelectorAll('.save-preference-btn-handler.onetrust-close-btn-handler')[0]
        .addEventListener('click', hideDnsUI);

     */
}, 200);
