# Clorox OneTrust Do Not Share Integration

The goal with this code is to simplify the integration into the WordPress and NextJS sites.

1. Add this package as a project dependency in package.json

   `"clorox-privacy": "github:electro-creative-workshop/clorox-privacy#semver:^1.0.0",`

2. Load required JS & CSS from this package

   - import {initCloroxSearch} from 'clorox-search';

   - @import "../../node_modules/clorox-search/dist/clorox-search";
