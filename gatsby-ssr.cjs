// gatsby-ssr.cjs :

const React = require("react");
const { wrapPageElement: wrap } = require("./src/i18n/wrapPageElement");
const { warn } = require("./src/utils/logger");
const { initSentry } = require("./src/utils/sentryInit");
const i18nConfig = require("./src/i18n/i18nConfig");

// ✅ SENTRY INITIALISATIE
initSentry({ mode: "ssr" });

exports.wrapPageElement = wrap;

exports.onRenderBody = ({ pathname, setHtmlAttributes, setHeadComponents }) => {
  const supportedLangs = i18nConfig.supportedLngs;

  if (!supportedLangs || supportedLangs.length === 0) {
    throw new Error(
      "❌ i18nConfig.supportedLngs ontbreekt of is leeg. Controleer je i18n-configuratie."
    );
  }
  const pathLang = pathname?.split("/")[1] || "";
  const lang = supportedLangs.includes(pathLang) ? pathLang : i18nConfig.fallbackLng;

  if (
    process.env.NODE_ENV !== "production" &&
    !supportedLangs.includes(pathLang) &&
    pathLang !== ""
  ) {
    warn("⚠️ Onbekende taal gedetecteerd in URL, fallback gebruikt.", {
      pathLang,
      fallbackLang: i18nConfig.fallbackLng,
    });
  }
  setHtmlAttributes({ lang, xmlns: "http://www.w3.org/1999/xhtml" });

  const fonts = [
    { key: "inter-regular", href: "/fonts/Inter-Regular.woff2", weight: "400", style: "normal" },
    { key: "inter-bold", href: "/fonts/Inter-Bold.woff2", weight: "700", style: "normal" },
    {
      key: "interdisplay-regular",
      href: "/fonts/InterDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ];

  setHeadComponents(
    fonts.map(({ key, href, weight, style }) =>
      React.createElement("link", {
        key,
        rel: "preload",
        href,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
        fontWeight: weight,
        fontStyle: style,
      })
    )
  );
};
