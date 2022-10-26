# Clorox OneTrust Do Not Share Integration

This code is to simplify the integration of the second OneTrust modal into WordPress and NextJS sites.

## WordPress Sites

1. Add this package as a project dependency in `package.json`

    - `"electro-privacy": "github:electro-creative-workshop/electro-privacy#semver:^1.0.0",`
    - Note: where ^1.0.x is the latest version. See https://github.com/electro-creative-workshop/electro-privacy/tags

2. Load required JS & CSS from this package

    - in `main.js`:
        - `import 'electro-privacy'`
    - in `scss/decoration/index.scss`
        - `@import '../../../node_modules/electro-privacy/dist/electro-privacy';`

3. Add to the footer near the "Cookie Settings" button:

    - `<button id="do-not-share" onclick="OneTrust.ToggleInfoDisplay()">Do Not Share My Personal Information</button>`

4. In footer.scss, add the `#do-not-share` to the `#ot-sdk-btn` rule to style "Do Not Share My Personal Information" button the same way as "Cookie Settings". For example:

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

    - `"electro-privacy": "github:electro-creative-workshop/electro-privacy#semver:^1.0.0",`

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
