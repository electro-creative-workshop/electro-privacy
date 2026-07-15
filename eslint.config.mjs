import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    ignores: ["docs/**", "dist/**", "coverage/**"],
  },
  // Base ESLint rules
  pluginJs.configs.recommended,

  // Node/CommonJS config files
  {
    files: ["webpack.config.js"],
    languageOptions: {
      sourceType: "script",
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
    },
  },

  // Node/ESM config files
  {
    files: ["vitest.config.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },

  // Custom config
  {
    files: ["**/*.{js,mjs,cjs}"],

    languageOptions: {
      globals: {
        ...globals.browser,
        require: "readonly",
        ELECTRO_PRIVACY_VERSION: "readonly",
      },
    },
  },
];
