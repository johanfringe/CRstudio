// src/i18n/i18n.js :
const i18n = require("i18next");
const { initReactI18next } = require("react-i18next");
const i18nConfig = require("./i18nConfig");

// 🔹 Alleen de relevante keys van `i18nConfig` gebruiken
const { fallbackLng, supportedLngs, interpolation, detection, debug } = i18nConfig;

i18n.use(initReactI18next).init({
  fallbackLng,
  supportedLngs,
  interpolation,
  detection,
  debug,
  resources: {}, // 🔥 Zorgt ervoor dat er geen backend nodig is
});

module.exports = i18n;
