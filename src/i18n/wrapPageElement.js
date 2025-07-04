// src/i18n/wrapPageElement.js
const React = require("react");
const { useEffect } = require("react");
const { I18nextProvider, useI18next } = require("gatsby-plugin-react-i18next");
const i18n = require("./i18n");

function WrapPageElement({ element }) {
  const { language } = useI18next();

  useEffect(() => {
    if (typeof document !== "undefined") {
      const htmlLang = document.documentElement.getAttribute("lang");
      if (htmlLang !== language) {
        document.documentElement.setAttribute("lang", language);
        console.log("🔄 Documenttaal geüpdatet naar", { language });
      }
    }
  }, [language]);

  return <I18nextProvider i18n={i18n}>{element}</I18nextProvider>;
}

module.exports = WrapPageElement;
