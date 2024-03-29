# Clorox OneTrust "Your Privacy Choices" Integration

This code is to simplify the integration of the second OneTrust modal into WordPress and NextJS sites.

## WordPress Sites

1. Add this package as a project dependency in `package.json`

    - `"electro-privacy": "github:electro-creative-workshop/electro-privacy#semver:^x.x.x",`
    - Note: where ^x.x.x is the latest version. See https://github.com/electro-creative-workshop/electro-privacy/tags

2. Load required JS & CSS from this package

    - in `main.js`:
        - `import 'electro-privacy'`
    - in `scss/decoration/index.scss`
        - `@import '../../../node_modules/electro-privacy/dist/electro-privacy';`

3. Add to the footer near the "Cookie Settings" button:

    - `<button id="do-not-share" onclick="OneTrust.ToggleInfoDisplay()">Your Privacy Choices</button>`
    - Add the "opt out" icon here next to the text: https://oag.ca.gov/privacy/ccpa/icons-download

4. In footer.scss, add the `#do-not-share` to the `#ot-sdk-btn` rule to style "Your Privacy Choices" button the same way as "Cookie Settings". For example:

    ```
    #ot-sdk-btn, #do-not-share {
     margin-bottom: 1em;
     padding: 0 !important;
     font-size: 1em !important;
     color: $color-white !important;
     border: none !important;
    }
    ```

## NextJS sites:

### Your NextJS site may differ slightly, but this is the general flavor of the changes

1. Add this package as a project dependency in `package.json`

    - `"electro-privacy": "github:electro-creative-workshop/electro-privacy#semver:^x.x.x",`

2. in `src/pages/\_app.js`

    - `import { useEffect } from 'react'`
    - in `export default function App({ Component, pageProps }) {` or something similar, add: - `useEffect(() => { import('electro-privacy'); }, [])`

3. in `src/styles/global.scss`

    - `@import '../../node_modules/electro-privacy/dist/electro-privacy';`

4. Add near the "Cookie Settings" button:

```
    <button id="do-not-share" onClick={() => OneTrust.ToggleInfoDisplay()}>
```

5. Add `#do-not-share` to the existing `#ot-sdk-btn` rule to style the "Do Not Share..." text:

```
#ot-sdk-btn,
#do-not-share {
  background: none !important;
  border: none !important;
  color: #133d8d !important;
```

## UAT Values

The current production version sends entries to the live OneTrust collection point by default. If you need to support UAT, set this variable before importing electro-privacy:

`window.electroPrivacyStaging = true;`

This will change the following values to the non-production values:

-   url
-   token
-   ID


## Language Support

The default implementation supports English & Spanish based on the lang attribute in the html tag:

    <html lang="es-US">

Other languages will be supported as needed, but the using site will need to load the appropriate strings into a global array used by electro-privacy:

    /**
    * Add language support to electro-privacy module
    *   This code needs to be executed before importing
        electro-privacy
    */

    window.ElectroPrivacyLanguageMap = {
    'zz-US': require('../../..
      /node_modules/electro-privacy/dist/lang/zz-US.json'),
    };

NOE: This needs to be setup before electro-privacy is included by the client. The mapping needs to the lang value for the html tag for the site.
