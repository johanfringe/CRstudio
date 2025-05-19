// lint-staged.config.mjs :

export default {
  "src/**/*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md}": ["prettier --write"]
};
