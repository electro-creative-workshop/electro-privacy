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
            'and click “Save Settings.”   Note that your opt-out preference will be tracked via a cookie which, means ';
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
        await import(/* webpackMode: "eager" */ './ot-dns-script-2');
    }

    // Optanon.InsertScript('otDnsScript2.js', 'body', null, null, 'C0001', true);
}
// make global
window.OptanonWrapper = OptanonWrapper;
