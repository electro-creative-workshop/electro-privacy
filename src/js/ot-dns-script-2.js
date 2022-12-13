// / /////////////////////////////////////////////
//  Do Not Share script part two
// / /////////////////////////////////////////////

// Define variables
let otDataSubjectId;
let preferences;
let dnsUI = false;

// Collection Point Information
const url = 'https://privacyportal.onetrust.com/request/v1/consentreceipts';
const token =
    '"eyJhbGciOiJSUzUxMiJ9.eyJvdEp3dFZlcnNpb24iOjEsInByb2Nlc3NJZCI6ImUxNDMwZTBkLWUzNTgtNGQ4NC1hNGViLTVmMjI3OTRmZGQwZCIsInByb2Nlc3NWZXJzaW9uIjoxLCJpYXQiOiIyMDIyLTEyLTA5VDE3OjQxOjAxLjg4IiwibW9jIjoiQVBJIiwicG9saWN5X3VyaSI6bnVsbCwic3ViIjoiRW1haWwiLCJpc3MiOm51bGwsInRlbmFudElkIjoiNjVjYTZiNDYtNzBiMS00ZWUxLTkwNzQtN2E2M2U4MDBlYTRjIiwiZGVzY3JpcHRpb24iOiJFbmRwb2ludCBmb3Igd2ViIG1vZGFscyIsImNvbnNlbnRUeXBlIjoiQ09ORElUSU9OQUxUUklHR0VSIiwiYWxsb3dOb3RHaXZlbkNvbnNlbnRzIjpmYWxzZSwiZG91YmxlT3B0SW4iOmZhbHNlLCJwdXJwb3NlcyI6W3siaWQiOiI1MjhkZTE1MC1iNWYzLTQ2N2QtYmUxMS03NTc3NTY2MDEyMjQiLCJ2ZXJzaW9uIjoxLCJwYXJlbnRJZCI6bnVsbCwidG9waWNzIjpbXSwiY3VzdG9tUHJlZmVyZW5jZXMiOltdLCJlbmFibGVHZW9sb2NhdGlvbiI6ZmFsc2V9XSwibm90aWNlcyI6W10sImRzRGF0YUVsZW1lbnRzIjpbXSwiYXV0aGVudGljYXRpb25SZXF1aXJlZCI6ZmFsc2UsInJlY29uZmlybUFjdGl2ZVB1cnBvc2UiOmZhbHNlLCJvdmVycmlkZUFjdGl2ZVB1cnBvc2UiOnRydWUsImR5bmFtaWNDb2xsZWN0aW9uUG9pbnQiOmZhbHNlLCJhZGRpdGlvbmFsSWRlbnRpZmllcnMiOltdLCJtdWx0aXBsZUlkZW50aWZpZXJUeXBlcyI6ZmFsc2UsImVuYWJsZVBhcmVudFByaW1hcnlJZGVudGlmaWVycyI6ZmFsc2UsInBhcmVudFByaW1hcnlJZGVudGlmaWVyc1R5cGUiOm51bGwsImFkZGl0aW9uYWxQYXJlbnRJZGVudGlmaWVyVHlwZXMiOltdLCJlbmFibGVHZW9sb2NhdGlvbiI6ZmFsc2V9.g2zafM0cd3qCeVZEXR1AzZfFL6n277n8xPRxGaIUi5oIRoyeDH5ESKvbXT1b4wN1pVzTXZJIl2TKXfHOxzhszfA7oX0gUoYsV6xw_GQIUkF4m8Qly_Pv8r_A0XK4QgvH5iCKcfTmNxOBXRF8vcPj8kT5Rh8G7RsuR6o1rfWBg4IaLPfG3ip7xMo8p2Z4elL3hcTi8dsEJkdSbxyugVOyqydo7Djibq5AtX4l4tI5cWRlf1eG5F1Gr9yBcCzeHl3O-mPx3j344PGgz-AYixQpWhztFUJa13NaD4gycCqNiDbeHqQ16U-696E8lM7uUJ3921qDQQoSAqV6uDnELYHuCi27VDYM8RCzaq9zloWs8G5bSRPSbHIP-YvJUKdHrzjT8_B7ZDBG1efnqMcrqMrQHErG2yDVD_DhlDBLwpokkWpmt3ryYvn9jd4Tk615J73Mxpxu2NpaXnuaothZSXRXIxL7BYUP-PS5y2edp18SKS7eXOWrU0ahEPXKKWhIfXVE7t_PSER8ZO-E-8oLtzMHfbK2bRIS44N37yUGEpmd8Th6ovZiQvTtxBkC0dJbd0FGM4su7NRXyoNY_8dHbXGc9GC1M9P54Ke4pyFfVKrcD4spavrSj2wxiqToTPFpaeFxK8XJn9xENM3_ATJhGpW19CayJm2sesiqaambsymutsk"';
// Purpose Ids Assigned to Collection Point

// make POST call to hit collection point
function setPreferences(otDataSubjectId) {
    // preferences = '"purposes":[{"Id":' + purpose1 + ',"TransactionType": "OPT_OUT"}]';
    preferences = '"purposes": [{"Id": "528de150-b5f3-467d-be11-757756601224","TransactionType": "WITHDRAWN"}]';

    const body = `{"identifier":"${otDataSubjectId}","requestInformation":${token},${preferences}}`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(body);
    console.log(body);
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
        console.log(`email returned valid; emailInputValue = ${emailInputValue}`);
        submitPreferences();
        textInput.disabled = true;
        document.getElementById('ot-dns-submit').disabled = true;

        const confirmSubmit =
            '<div id="ot-submit-text" style="display: inline; margin-left: 10px !important;">Successfully Submitted!</div>';
        const otEmailSubmit = document.querySelectorAll('#ot-email-submit #ot-dns-submit')[0];
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

    document.getElementById('ot-dns-submit').addEventListener('click', inputValidation);
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
