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
        otEmailHTML += 'Once you have made all of your elections, click “Save Settings” to save your settings and close the window.';
        otEmailHTML += '</div>';

        let dnsCustomText =
            '<div id="dns-custom-text" style="display: none">Under some state laws you have the right to opt out of the sharing of your information for cross-context ';
        dnsCustomText +=
            'behavioral advertising and/or certain types of targeted advertising (“behavioral advertising”).<br><br>To turn off the ';
        dnsCustomText +=
            'behavioral advertising cookies and trackers on this website, toggle “Targeting / Advertising ';
        dnsCustomText +=
            'Cookies” to “off” and click “Save Settings.” If the toggle is already set to “off” - you may have already updated ';
        dnsCustomText +=
            'your cookie settings, or the Global Privacy Control (“GPC”) signal may be enabled in your browser.';
        dnsCustomText +=
            '<br><br>';
        dnsCustomText +=
            'In most cases, your opt-out preference will be tracked via a cookie, which means your selection is limited to the ';
        dnsCustomText +=
            'specific device and browser you are using during this visit to our website. If you visit this website from a ';
        dnsCustomText +=
            'different device or browser, change your browser settings, or if you clear your cookies, you may need to opt out again.';

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
