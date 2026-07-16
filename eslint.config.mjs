import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    {
        ignores: ['docs/**', 'dist/**', 'coverage/**'],
    },
    // Base ESLint rules
    pluginJs.configs.recommended,

    // Project runtime and tests
    {
        files: ['src/**/*.js', 'test/**/*.js'],

        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                require: 'readonly',
                ELECTRO_PRIVACY_VERSION: 'readonly',
            },
        },
    },

    // Node/CommonJS config files
    {
        files: ['webpack.config.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'script',
            globals: {
                ...globals.node,
                ...globals.commonjs,
            },
        },
    },

    // Node/ESM config files
    {
        files: ['vitest.config.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
    },

    // Node/ESM utility scripts
    {
        files: ['scripts/**/*.mjs'],
        languageOptions: {
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
    },
];
