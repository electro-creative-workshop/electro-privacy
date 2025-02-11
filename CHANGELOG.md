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

## 1.2.5 Remove optional chaining operator (.?)
- Not all sites support it

## 1.2.6 Detect non production systems for testing
- Use UAT backend for urls that match non-production

## 1.2.7 Fix regex pattern console error
- HTML pattern attribute change to use regex v flag (needs more chars escaped in character classes)
- https://groups.google.com/a/chromium.org/g/blink-dev/c/gIyvMw0n2qw

## 1.3.0 Add support for Translation
- add Spanish (US) language file
- add Arabic language file

## 1.3.1 Bug Fix
- Remove stray ';

## 1.4.0 Handle dynamic buttons for cookies & DNS
- use document level capture event handlers to handle dynamic buttons being recreated (dtc shops)

## 1.4.1 bug fix
- look for buttons as event targets or a child of button

## 1.4.2 bug fix
- legal text change

## 1.4.4 bug fix - Dec 6, 2024
- Move "on"/"off" text to be closer the slider
- Legal requested copy changes

## 1.4.6 bug fix - Dec 16, 2024
- CSS fixes: moved most styles to be inline instead of competing with OneTrust styles
- Spanish updates
- Markup changes to target text size

## 1.4.7 bug fix - Dec 16, 2024
- Minor HR spacing fix

## 1.4.8 bug fix - Feb 11, 2025
- Fix JS error "document.getElementById('ot-email') is null"
- Fix race condition with adding dns ui & js manipulating controls
- Fix endless interval loop when dnsCheck fn has error
