# History

## 1.1.1 Stable Version

-   Version that was approved by initial QA testing.

## 1.1.2 Token Change

-   Changed token after it was changed in the OneTrust dashboard.

## 1.1.3 Fixed Broken Token

-   Note: the token has to be in quotation marks.

## 1.1.4 Production Token

-   Changed to production token/url/id (removing UAT information).

## 1.1.5 Form submit button conflict

-   Changed id from submit to ot-dns-submit

## 1.1.6 remove console.log

-   console.log(`email returned valid; emailInputValue = ${emailInputValue}`);

## 1.1.7 remove more console.log

-   console.log(`function returned false; emailInputValue = ${emailInputValue}`);
-   console.log('invalid email');

## 1.1.8 Updated language

-   in DNS popup

## 1.1.9 Support parameter on import path to use staging server

-   if `window.electroPrivacyStaging` set to `true` before electro-privacy js is imported, the library will use staging parameters for backend submissions.

## 1.2.0 Changed setTimeout to setInterval

## 1.2.1 Legal requested copy changes

## 1.2.2 Bug Fixes
 - Fix for Escape key not closing DNS popup (caused by onetrust-banner-sdk changes) - add our own keydown handler
 - Fix some errors with the Display of on/off text in DNS popup for Targeting/Advertising Cookies in addition to slider

## 1.2.3 Bug Fixes
  - Fix display of on/off text when switching between popups

## 1.2.4 Bug Fixes
- Add display=flex when showing on/off text
