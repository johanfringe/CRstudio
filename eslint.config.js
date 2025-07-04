// eslint.config.js :
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import jest from "eslint-plugin-jest";
import prettier from "eslint-plugin-prettier";
import i18next from "eslint-plugin-i18next";

export default [
  // ── 0. Root-settings voor React vóór alles ──
  {
    settings: {
      react: {
        version: "detect",
        runtime: "automatic",
      },
    },
  },

  // ── 1. Core ignores & recommended JS rules ──
  {
    ignores: [
      "**/.cache/**",
      "**/.env.sentry-build-plugin",
      "**/.git/**",
      "**/.idea/**",
      "**/.netlify/**",
      "**/.vscode/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/public/**",
      "**/supabase/**",
      "**/coverage/**",
      "**/__testsBackup__/**",
      "**/*.bak",
      "**/*.log",
      "**/*.swp",
      "**/*.tmp",
    ],
  },
  js.configs.recommended,

  // ── 2. React-plugin flat-presets ──
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],

  // ── 3. Jest override ──
  {
    files: ["**/__tests__/**/*.js", "**/*.test.js", "**/*.spec.js"],
    plugins: { jest },
    rules: { ...jest.configs.recommended.rules },
  },

  // ── 4. Gatsby-CJS override ──
  {
    files: ["gatsby-*.cjs", "gatsby-browser.js", "gatsby-config.js", "gatsby-node.js"],
    languageOptions: {
      ecmaVersion: 2023,
      globals: { ...globals.browser, ...globals.node },
      sourceType: "script",
    },
  },

  // ── 5. Node/ESM override ──
  {
    files: [
      "*.config.js",
      "*.mjs",
      "check-unused-keys.js",
      "pingRedis.js",
      "postcss.config.js",
      "tailwind.config.mjs",
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: { ...globals.node },
      sourceType: "module",
    },
  },

  // ── 6. Node scripts override ──
  {
    files: ["scripts/check-unused-keys.js"],
    languageOptions: {
      ecmaVersion: 2023,
      globals: { ...globals.node },
      sourceType: "script",
    },
  },

  // ── 7. Project-code override ──
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      globals: { ...globals.browser, ...globals.jest, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
      sourceType: "module",
    },
    plugins: {
      i18next,
      "jsx-a11y": jsxA11y,
      prettier,
      react,
      "react-hooks": reactHooks,
    },
    settings: {
      react: { runtime: "automatic", version: "detect" },
    },
    rules: {
      "i18next/no-literal-string": [
        "warn",
        {
          ignoreAttribute: ["id", "name", "type", "htmlFor", "data-testid"],
          markupOnly: true,
          varsIgnorePattern: "^React$",
        },
      ],
      "no-unused-vars": ["error", { varsIgnorePattern: "^React$" }],
      "prettier/prettier": "error",
      "react/jsx-uses-vars": "error",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
];
