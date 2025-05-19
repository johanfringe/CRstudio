// eslintrc.js :

module.exports = {
    root: true,
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:react-hooks/recommended",
      "plugin:prettier/recommended",
      "plugin:i18next/recommended",
    ],
    plugins: ["react", "jsx-a11y", "react-hooks", "prettier", "i18next"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "prettier/prettier": "error",
      "i18next/no-literal-string": [
        "warn",
        {
          markupOnly: true,
          ignoreAttribute: ["id", "name", "type", "htmlFor", "data-testid"],
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  };