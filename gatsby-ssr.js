// gatsby-ssr.js :
const React = require("react");
const { wrapPageElement: wrap } = require("./src/i18n/wrapPageElement");

// ✅ SENTRY INITIALISATIE
const Sentry = require("@sentry/react");

const SENTRY_DSN = process.env.SENTRY_DSN;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

if (SENTRY_DSN) {
  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: IS_PRODUCTION ? 1.0 : 0.1, // 🔹 Dynamisch sample rate
    });

    console.info("✅ Sentry SSR-initialisatie succesvol.");
  } catch (error) {
    console.warn("⚠️ Fout bij initialisatie van Sentry SSR:", error);
  }
} else {
  console.warn("⚠️ Sentry DSN ontbreekt, monitoring is niet actief.");
}

exports.wrapPageElement = wrap;

exports.onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: "en", xmlns: "http://www.w3.org/1999/xhtml" });
};

exports.onRenderBody = ({ setHeadComponents }) => {
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
        "fontWeight": weight,
        "fontStyle": style,
      })
    )
  );
};
