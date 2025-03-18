// src/i18n/i18nConfig.js :
const languages = require('../locales/languages');

const i18nConfig = {
  fallbackLng: "en",
  supportedLngs: languages.map(lang => lang.code),
  interpolation: { escapeValue: false },
  detection: {
    order: ["path", "htmlTag", "cookie", "navigator"],
    caches: ["cookie"], // ✅ SSR-proof (localStorage pas in gatsby-browser.js)
  },
  // debug: process.env.NODE_ENV === "development",
};

module.exports = i18nConfig;
