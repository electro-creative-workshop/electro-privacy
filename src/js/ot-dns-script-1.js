// load language support & determine lang based on url
import {getLanguageString} from "./language-support";


let dsIdSet = false;
async function OptanonWrapperLocal() {
    window.dataLayer.push({
        event: 'OneTrustGroupsUpdated',
        OneTrustActiveGroups: window.OnetrustActiveGroups,
    });

    if (dsIdSet == false) {
        const emailTitle = getLanguageString('Behavioral Advertising Linked To Your Email Address:');
        const emailBlock = getLanguageString('emailTextBlock');
        const emailLabel = getLanguageString('Email:');
        const submit = getLanguageString('Submit');
        const emailInstructions = getLanguageString('Once you have made all of your elections, click “Save Settings” to save your settings and close the window.');

        let otEmailHTML = '<hr />';
        otEmailHTML += '<div id="ot-email-text" style="display: none">';
        otEmailHTML += `<h3 style="font-size: inherit;">${emailTitle}</h3>`;
        otEmailHTML += '<br />';
        otEmailHTML += emailBlock;
        otEmailHTML += '<form id="ot-email-submit" onsubmit="return false;">';
        otEmailHTML += `<label for="ot-email">${emailLabel} `;
        otEmailHTML += '<input type="email" id="ot-email" name="ot-email" required>';
        otEmailHTML += `<input type="submit" id="ot-dns-submit" value="${submit}">`;
        otEmailHTML += '</label></form><br>';
        otEmailHTML += emailInstructions + '<br><br>';
        otEmailHTML += '<hr />';

        const deletionRequests = getLanguageString('Deletion, Access, Or Correction Requests');
        const deletionTextBlock1 = getLanguageString('deletionTextBlock1');
        const deletionTextBlock2 = getLanguageString('deletionTextBlock2');
        otEmailHTML += `<h3 style="font-size: inherit;">${deletionRequests}</h3>`;

        otEmailHTML += '<br />';
        otEmailHTML += deletionTextBlock1;
        otEmailHTML += '<br /><br />';
        otEmailHTML += deletionTextBlock2;
        otEmailHTML += '</div>';

        const targetedAdsTitle = getLanguageString('Do Not Sell or Share for Targeted Advertising');
        const targetedAdsTextBlock = getLanguageString('targetedAdsTextBlock');
        let dnsCustomText = '<div id="dns-custom-text" style="display: none">';
        dnsCustomText += `<h3 style="font-size: inherit;">${targetedAdsTitle}</h3>`;
        dnsCustomText += '<br />';
        dnsCustomText += targetedAdsTextBlock;

        const otEmailForm = document.querySelectorAll('.ot-sdk-row.ot-cat-grp')[0];
        otEmailForm.insertAdjacentHTML('afterend', otEmailHTML);

        const otDnsText = document.getElementById('ot-pc-desc');
        otDnsText.insertAdjacentHTML('afterend', dnsCustomText);

        // show "on/off" text near the toggle
        const toggleTextContainer = document.createElement('div');
        toggleTextContainer.setAttribute('id', 'ot-checkbox-status');
        toggleTextContainer.setAttribute('style', 'display: flex; justify-content: flex-end; width: 100%;');
        const insertAfterThis = document.querySelectorAll('[data-optanongroupid="C0004"]')[0];
        insertAfterThis.append(toggleTextContainer);

        dsIdSet = true;

        // import 2nd js file
        await import(/* webpackMode: "eager" */ './ot-dns-script-2');
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
