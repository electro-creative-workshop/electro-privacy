let dsIdSet = false;
async function OptanonWrapperLocal() {
    window.dataLayer.push({
        event: 'OneTrustGroupsUpdated',
        OneTrustActiveGroups: window.OnetrustActiveGroups,
    });

    if (dsIdSet == false) {
        let otEmailHTML = '<hr />';
        otEmailHTML += '<div id="ot-email-text" style="display: none">';
        otEmailHTML += '<h3 style="font-size: inherit;">Behavioral Advertising Linked To Your Email Address:</h3>';
        otEmailHTML += '<br />';

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
        otEmailHTML += '<hr />';

        otEmailHTML += '<h3 style="font-size: inherit;">Deletion, Access, Or Correction Requests</h3>';

        otEmailHTML += '<br />';
        otEmailHTML += 'If you are a U.S. consumer and would like to exercise other privacy rights,';
        otEmailHTML +=
            'such as a deletion, access, or correction request, please visit our <a target="_blank" href="//privacyportal.onetrust.com/webform/65ca6b46-70b1-4ee1-9074-7a63e800ea4c/7baf0e2e-4724-44fe-af48-4138faca9d23">U.S. Data Subject Request</a> page.';
        otEmailHTML += '<br /><br />';
        otEmailHTML +=
            'For more information about additional privacy practices and choices available to you, please visit our <a href="//www.thecloroxcompany.com/privacy/">Privacy Policy</a>.';
        otEmailHTML += '</div>';

        let dnsCustomText = '<div id="dns-custom-text" style="display: none">';
        dnsCustomText += '<h3 style="font-size: inherit;">Do Not Sell or Share for Targeted Advertising</h3>';
        dnsCustomText += '<br />';
        dnsCustomText +=
            'Under some state laws you have the right to opt out of the selling or sharing of your information for cross-context ';
        dnsCustomText +=
            'behavioral advertising and/or certain types of targeted advertising (“behavioral advertising”).<br><br>';
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
        dnsCustomText += '<br><br>';
        dnsCustomText +=
            'If you would like to update other cookie-related preferences visit the "Cookie Settings" link in the footer of this webpage.';

        const otEmailForm = document.querySelectorAll('.ot-sdk-row.ot-cat-grp')[0];
        otEmailForm.insertAdjacentHTML('afterend', otEmailHTML);

        const otDnsText = document.getElementById('ot-pc-desc');
        otDnsText.insertAdjacentHTML('afterend', dnsCustomText);

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
