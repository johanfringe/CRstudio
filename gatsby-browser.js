// gatsby-browser.js :
import "./src/styles/global.css";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/browser";
import { Replay } from "@sentry/replay";

import { wrapPageElement as wrap } from "./src/i18n/wrapPageElement";
import i18n from "./src/i18n/i18n";
import i18nConfig from "./src/i18n/i18nConfig";

// ✅ SENTRY INITIALISATIE
if (typeof window !== "undefined") {
  const env = process.env.NODE_ENV;
  const isDev = env === "development";
  const dsn = process.env.GATSBY_SENTRY_DSN;

  console.log(`✅ [DEBUG] NODE_ENV: ${env}`);
  console.log("✅ [DEBUG] GATSBY_SENTRY_DSN waarde:", dsn ?? "(undefined)");

  if (dsn) {
    try {
      Sentry.init({
        dsn,
        integrations: [new BrowserTracing(), new Replay()],
        tracesSampleRate: isDev ? 0.0 : 0.0, // quota te hoog, dan isDev ? 0.1 : 0.05,
        replaysSessionSampleRate: isDev ? 0.0 : 0.0, // quota te hoog, dan isDev ? 0.0 : 0.0,
        replaysOnErrorSampleRate: isDev ? 0.0 : 1.0, // ❗ Alleen op errors in prod
        release: process.env.SENTRY_RELEASE || "unknown",
        beforeSend(event) {
          if (isDev) {
            // null=niets, event=alles doorlaten
            return event; // ... in dev
          }
          return event; // ... in productie
        },
        environment: isDev ? "development" : "production",
        debug: isDev,
      });

      console.log("✅ [DEBUG] Sentry.init() succesvol uitgevoerd");
    } catch (error) {
      console.error("❌ [FOUT] Fout bij initialisatie van Sentry:", error);
    }
  } else {
    console.warn("⚠️ [WAARSCHUWING] Geen geldige GATSBY_SENTRY_DSN gevonden. Sentry is NIET geactiveerd.");
  }

  // ✅ Testfunctie beschikbaar maken in browser
  window.SENTRY_TEST = () => {
    const error = new Error("🧪 Manueel getriggerde testfout via SENTRY_TEST()");
    console.log("🧪 [TEST] SENTRY_TEST() werd uitgevoerd:", error.message);
    Sentry.captureException(error);
  };

  // ✅ Ongecontroleerde globale errors loggen
  window.onerror = (message, source, lineno, colno, error) => {
    console.warn("🛑 [UNHANDLED] Global error opgevangen:", message);
    if (!isDev) {
      Sentry.captureException(error || new Error(message));
    }
  };
}

console.log("✅ [DEBUG] gatsby-browser.js werd volledig geladen");

export const wrapPageElement = wrap;

// ✅ Taaldetectie bij eerste render
export const onInitialClientRender = () => {
  if (typeof window === "undefined") return;

  try {
    let storedLang;
    try {
      storedLang = window.localStorage.getItem("i18nextLng");
    } catch (error) {
      console.warn("⚠️ localStorage niet toegankelijk:", error);
      storedLang = null;
    }

    const supportedLangs = i18nConfig.supportedLngs;
    const browserLangs = (
      Array.isArray(navigator.languages) && navigator.languages.length
        ? navigator.languages
        : [navigator.language ?? i18nConfig.fallbackLng]
    ).filter(Boolean);

    console.log("🌐 Gedetecteerde browsertalen:", browserLangs);

    const detectedLang =
      browserLangs
        .map((lang) => lang?.split("-")[0])
        .find((lang) => supportedLangs.includes(lang)) || i18nConfig.fallbackLng;

    const validStoredLang = storedLang && supportedLangs.includes(storedLang) ? storedLang : null;
    const finalLang = validStoredLang || detectedLang;

    if (storedLang !== finalLang) {
      try {
        window.localStorage.setItem("i18nextLng", finalLang);
        console.log(`🌍 Taal opgeslagen: ${finalLang}`);
      } catch (error) {
        console.warn("⚠️ localStorage niet toegankelijk. Fallback ingeschakeld.", error);

        const fallbackLang = navigator.language?.split("-")[0] || i18nConfig.fallbackLng;

        if (fallbackLang !== i18n.language) {
          console.log(`🔄 Fallback ingeschakeld. Taal gewijzigd naar: ${fallbackLang}`);
          i18n.changeLanguage(fallbackLang);
        }

        if (document.documentElement.lang !== fallbackLang) {
          document.documentElement.lang = fallbackLang;
          console.log(`🌍 <html lang> ingesteld op: ${fallbackLang}`);
        }
      }
    }

    if (document.documentElement.lang !== finalLang) {
      document.documentElement.lang = finalLang;
      console.log(`🌍 <html lang> ingesteld op: ${finalLang}`);
    }

    if (i18n.language !== finalLang) {
      i18n.changeLanguage(finalLang);
      console.log(`✅ i18n taal gewijzigd naar: ${finalLang}`);
    }
  } catch (error) {
    console.warn("⚠️ Fout bij taalinitialisatie. Fallback geactiveerd.", error);
  }
};
