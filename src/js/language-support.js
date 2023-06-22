/**
 * support for handling langs
 */


let stringMap = {
    emailTextBlock: 'You may have previously provided your email address to us. In some cases, we use email addresses or other non-cookie personal information to deliver behavioral advertising to consumers on third party platforms like Facebook and Google. To request that your personal information is not shared for these purposes, please enter your email address below:',

    deletionTextBlock1: 'If you are a U.S. consumer and would like to exercise other privacy rights, '
        + 'such as a deletion, access, or correction request, '
        + 'please visit our <a target="_blank" href="//privacyportal.onetrust.com/webform/65ca6b46-70b1-4ee1-9074-7a63e800ea4c/7baf0e2e-4724-44fe-af48-4138faca9d23">U.S. Data Subject Request</a> page.',
    deletionTextBlock2: 'For more information about additional privacy practices and choices available to you, please visit our '
        + '<a target="_blank" href="//thecloroxcompany.com/privacy/">Privacy Policy</a>.',

    targetedAdsTextBlock: 'Under some state laws you have the right to opt out of the selling or sharing of your information for cross-context '
        + 'behavioral advertising and/or certain types of targeted advertising (“behavioral advertising”).'
        + '<br><br>'
        + 'To turn off the  behavioral advertising cookies and trackers on this website, toggle “Targeting / Advertising '
        + 'Cookies” to “off” and click “Save Settings.” If the toggle is already set to “off” - you may have already updated '
        + 'your cookie settings, or the Global Privacy Control (“GPC”) signal may be enabled in your browser.'
        + '<br><br>'
        + 'In most cases, your opt-out preference will be tracked via a cookie, which means your selection is limited to the '
        + 'specific device and browser you are using during this visit to our website. If you visit this website from a '
        + 'different device or browser, change your browser settings, or if you clear your cookies, you may need to opt out again.'
        + '<br><br>'
        + 'If you would like to update other cookie-related preferences visit the "Cookie Settings" link in the footer of this webpage.',
};

const testList = [
    'espanol',
    'lndo.site/es/',
];
const url = location.hostname + location.pathname;
if (testList.some(testString => url.includes(testString))) {
    // use Espanol
    stringMap['Privacy Choices'] = 'ivacypray oiceschay';

    stringMap['Please enter a valid email.'] = 'easeplay enteryay ayay alidvay emailyay';
    stringMap['On'] = 'Onyay';
    stringMap['Off'] = 'Offyay';

    stringMap['Behavioral Advertising Linked To Your Email Address:'] = 'ehavioralbay advertisingyay inkedlay otay ouryay emailyay address:';
    stringMap['emailTextBlock'] = 'ouyay aymay avehay eviouslypray ovidedpray ouryay emailyay addressyay otay usyay . inyay omesay asescay , eway useyay emailyay addressesyay oryay otheryay on-cookienay ersonalpay informationyay otay eliverday ehavioralbay advertisingyay otay onsumerscay onyay irdthay artypay atformsplay ikelay acebookfay andyay ooglegay . otay equestray atthay ouryay ersonalpay informationyay isyay otnay aredshay orfay esethay urposespay , easeplay enteryay ouryay emailyay addressyay below:';
    stringMap['Email:'] = 'Correo electrónico:';
    stringMap['Submit'] = 'Entregar';
    stringMap['Once you have made all of your elections, click “Save Settings” to save your settings and close the window.'] =
        'onceyay ouyay avehay ademay allyay ofyay ouryay electionsyay , ickclay “save settings” otay avesay ouryay ettingssay andyay oseclay ethay indowway.';

    stringMap['Deletion, Access, Or Correction Requests'] = 'eletionday , accessyay , oryay orrectioncay equestsray';
    stringMap['deletionTextBlock1'] = 'ifyay ouyay areyay ayay U.S> onsumercay andyay ouldway ikelay otay exerciseyay otheryay ivacypray ightsray , uchsay asyay ayay eletionday , accessyay , oryay orrectioncay equestray , easeplay isitvay our '
        + '<a target="_blank" href="//privacyportal.onetrust.com/webform/65ca6b46-70b1-4ee1-9074-7a63e800ea4c/7baf0e2e-4724-44fe-af48-4138faca9d23">U.S. ataday ubjectsay equestray agepay.</a> page.',
    stringMap['deletionTextBlock2'] = 'orfay oremay informationyay aboutyay additionalyay ivacypray acticespray andyay oiceschay availableyay otay ouyay , easeplay isitvay ouryay'
        + '<a target="_blank" href="//thecloroxcompany.com/privacy/es-privacy/">ivacypray olicypay</a>.',

    stringMap['Do Not Sell or Share for Targeted Advertising'] = 'oday otnay ellsay oryay areshay orfay argetedtay advertisingyay';
    stringMap['targetedAdsTextBlock'] = 'underyay omesay atestay awslay ouyay avehay ethay ightray otay optyay outyay ofyay ethay ellingsay oryay aringshay ofyay ouryay informationyay orfay oss-contextcray ehavioralbay advertisingyay and/or ertaincay estypay ofyay argetedtay advertisingyay (“behavioral advertising”).'
        + '<br><br>'
        + 'otay urntay offyay ethay ehavioralbay advertisingyay ookiescay andyay ackerstray onyay isthay ebsiteway , oggletay “targeting / advertisingyay cookies” otay “off” andyay ickclay “save ettingssay . ” ifyay ethay oggletay isyay alreadyyay etsay otay “off” - ouyay aymay avehay alreadyyay updatedyay ouryay ookiecay ettingssay , oryay ethay obalglay ivacypray ontrolcay (“gpc”) ignalsay aymay ebay enabledyay inyay ouryay owserbray.'
        + '<br><br>'
        + 'inyay ostmay asescay , ouryay opt-outyay eferencepray illway ebay ackedtray iavay ayay ookiecay , ichwhay eansmay ouryay electionsay isyay imitedlay otay ethay ecificspay eviceday andyay owserbray ouyay areyay usingyay uringday isthay isitvay otay ouryay ebsiteway . ifyay ouyay isitvay isthay ebsiteway omfray ayay ifferentday eviceday oryay owserbray , angechay ouryay owserbray ettingssay , oryay ifyay ouyay earclay ouryay ookiescay , ouyay aymay eednay otay optyay outyay againyay.'
        + '<br><br>'
        + 'Iifyay ouyay ouldway ikelay otay updateyay otheryay ookie-relatedcay eferencespray isitvay ethay "cookie settings" inklay inyay ethay ooterfay ofyay isthay ebpageway.';
}

export function getLanguageString(strName)
{
    if (stringMap[strName]) {
        return stringMap[strName];
    }
    return strName;
}
