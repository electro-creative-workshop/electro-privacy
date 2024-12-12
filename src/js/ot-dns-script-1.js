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

        const deletionRequests = getLanguageString('Deletion, Access, Or Correction Requests');
        const deletionTextBlock1 = getLanguageString('deletionTextBlock1');
        const deletionTextBlock2 = getLanguageString('deletionTextBlock2');

        const otEmailHTML = `
            <hr/>
            <div id="ot-email-text" style="padding-top: 20px; font-size: 13px !important;display: none">
                <h3 style="font-size: 16px !important;">${emailTitle}</h3>
                <br/>
                ${emailBlock}
                <form id="ot-email-submit" style="padding-top: 20px;" onsubmit="return false;">
                    <label for="ot-email">${emailLabel}
                        <input type="email" style="border: 1px solid #000 !important;" id="ot-email" name="ot-email" required>
                        <input type="submit" style="border-radius: 4px; padding: 7px; border: 1px solid #000 !important;" id="ot-dns-submit" value="${submit}">
                    </label>
                </form>
                <br/>
                ${emailInstructions}
                 <br/><br/>
                <hr />
                <h3 style="font-size: inherit;">${deletionRequests}</h3>
                <br />
                ${deletionTextBlock1}
                <br />
                <br />
                ${deletionTextBlock2}
            </div>
        `;

        const targetedAdsTitle = getLanguageString('Do Not Sell or Share for Targeted Advertising');
        const targetedAdsTextBlock = getLanguageString('targetedAdsTextBlock');

        const dnsCustomText = `
            <div id="dns-custom-text" style="display: none">
                <h3 style="padding-top: 20px; font-size: 16px !important;">${targetedAdsTitle}</h3>
                <br />
                ${targetedAdsTextBlock}
            </div>
        `;

        const otEmailForm = document.querySelectorAll('.ot-sdk-row.ot-cat-grp')[0];
        otEmailForm.insertAdjacentHTML('afterend', otEmailHTML);

        const otDnsText = document.getElementById('ot-pc-desc');
        otDnsText.insertAdjacentHTML('afterend', dnsCustomText);

        // show "on/off" text near the toggle
        const toggleTextContainer = document.createElement('div');
        toggleTextContainer.setAttribute('id', 'ot-checkbox-status');
        toggleTextContainer.setAttribute('style', 'position: relative; width: 30px; display: inline-block; margin-left: 5px;');
        const insertAfterThis = document.querySelectorAll('[data-optanongroupid="C0004"]')[0];
        const toggleContainer = insertAfterThis.querySelector('.ot-tgl');
        toggleContainer.appendChild(toggleTextContainer);

        dsIdSet = true;

        // import 2nd js file
        await import(/* webpackMode: "eager" */ './ot-dns-script-2');
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
