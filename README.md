# Clorox OneTrust Do Not Share Integration

The goal with this code is to simplify the integration into the WordPress and NextJS sites.

1. Add this package as a project dependency in package.json

    `"electro-privacy": "github:electro-creative-workshop/electro-privacy#semver:^1.0.0",`

2. Load required JS & CSS from this package

    - main.js:
        - `import 'electro-privacy'`
    - in scss/decoration/index.scss
    - `@import '../../../node_modules/electro-privacy/dist/electro-privacy';`

3. Add to your footer near the "Cookie Settings" button:

-   `<button id="do-not-share" onclick="OneTrust.ToggleInfoDisplay()">Do Not Share My Personal Information</button>`
