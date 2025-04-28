// gatsby-ssr.js :
const React = require("react");
const { wrapPageElement: wrap } = require("./src/i18n/wrapPageElement");
const { warn } = require("./src/utils/logger");
const { initSentry } = require("./src/utils/sentryInit");

// ✅ SENTRY INITIALISATIE
initSentry({ mode: "ssr" });

exports.wrapPageElement = wrap;

exports.onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: "en", xmlns: "http://www.w3.org/1999/xhtml" });

  const fonts = [
    { key: "inter-regular", href: "/fonts/Inter-Regular.woff2", weight: "400", style: "normal" },
    { key: "inter-bold", href: "/fonts/Inter-Bold.woff2", weight: "700", style: "normal" },
    { key: "interdisplay-regular", href: "/fonts/InterDisplay-Regular.woff2", weight: "400", style: "normal" },
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
