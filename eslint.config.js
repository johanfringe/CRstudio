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
  // 🔒 Globale uitsluitingen
  {
    ignores: [
      "**/node_modules/**",
      "**/.cache/**",
      "**/public/**",
      "**/dist/**",
      "**/.netlify/**",
      "**/supabase/**",
      "**/.git/**",
      "**/.vscode/**",
      "**/.idea/**",
      "**/coverage/**",
      "**/__testsBackup__/**",
      "**/*.log",
      "**/*.bak",
      "**/*.tmp",
      "**/*.swp",
      "**/.env.sentry-build-plugin",
    ],
  },

  // 🧠 Aanbevolen JS-config
  js.configs.recommended,

  // 🎯 Jest testbestanden
  {
    files: ["**/__tests__/**/*.js", "**/*.test.js", "**/*.spec.js"],
    plugins: { jest },
    rules: {
      ...jest.configs.recommended.rules,
    },
  },

  // 📁 gatsby-browser.js is ESM in browsercontext
  {
    files: ["gatsby-browser.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module", // ✅ ESM
      globals: {
        ...globals.browser, // ✅ lost window, document, navigator op
        ...globals.node,
      },
    },
  },

  // 📁 Gatsby root-bestanden
  {
    files: ["gatsby-*.cjs", "gatsby-config.cjs", "gatsby-node.cjs"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "script", // = CommonJS
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // 📦 Configuratie- en Node-bestanden buiten src/
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
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },

  // 📦 Node scripts zoals check-unused-keys
  {
    files: ["scripts/check-unused-keys.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "script",
      globals: {
        ...globals.node,
      },
    },
  },

  // 🎯 Je eigen projectbestanden
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      i18next,
      prettier,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "prettier/prettier": "error",
      "react/jsx-uses-vars": "error",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "i18next/no-literal-string": [
        "warn",
        {
          markupOnly: true,
          ignoreAttribute: ["id", "name", "type", "htmlFor", "data-testid"],
        },
      ],
    },
  },
];
