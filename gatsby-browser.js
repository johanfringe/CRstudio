// gatsby-browser.js :
import "./src/styles/global.css";
import { wrapPageElement as wrap } from "./src/i18n/wrapPageElement";
import i18n from "./src/i18n/i18n";
import i18nConfig from "./src/i18n/i18nConfig";
import { log, warn, error } from "./src/utils/logger";
import { initSentry } from "./src/utils/sentryInit";

// ✅ SENTRY INITIALISATIE
if (typeof window !== "undefined") {
  initSentry({ mode: "browser" });

  // ✅ Testfunctie beschikbaar maken in browser
  window.SENTRY_TEST = () => {
    const testError = new Error("🧪 Manueel getriggerde testfout via SENTRY_TEST()");
    error("🧪 Manueel testfout gegenereerd via SENTRY_TEST()", { testError });
  };

  // ✅ Ongecontroleerde globale errors loggen
  window.onerror = (message, source, lineno, colno, err) => {
    warn("🛑 Globale fout opgevangen:", message, { source, lineno, colno, err });
    if (typeof Sentry?.captureException === "function" && err instanceof Error) {
      Sentry.captureException(err, {
        extra: { source, lineno, colno },
      });
    }
  };
}

log("✅ gatsby-browser.js werd volledig geladen");
// ✅ Gatsby Lifecycle: wrapPageElement
export const wrapPageElement = wrap;

// ✅ Automatische taaldetectie bij eerste client render
export const onInitialClientRender = () => {
  if (typeof window === "undefined") return;

  try {
    let storedLang;
    try {
      storedLang = window.localStorage.getItem("i18nextLng");
    } catch (err) {
      warn("⚠️ localStorage niet toegankelijk bij taal ophalen", { err });
      storedLang = null;
    }

    const supportedLangs = i18nConfig.supportedLngs;
    const browserLangs = (
      Array.isArray(navigator.languages) && navigator.languages.length
        ? navigator.languages
        : [navigator.language ?? i18nConfig.fallbackLng]
    ).filter(Boolean);

    log("🌐 Gedetecteerde browsertalen:", browserLangs);

    const detectedLang =
      browserLangs
        .map((lang) => lang?.split("-")[0])
        .find((lang) => supportedLangs.includes(lang)) || i18nConfig.fallbackLng;

    const validStoredLang = storedLang && supportedLangs.includes(storedLang) ? storedLang : null;
    const finalLang = validStoredLang || detectedLang;

    if (storedLang !== finalLang) {
      try {
        window.localStorage.setItem("i18nextLng", finalLang);
        log("🌍 Taal opgeslagen in localStorage:", { finalLang });
      } catch (err) {
        warn("⚠️ localStorage niet toegankelijk. Fallback wordt gebruikt.", { err });

        const fallbackLang = navigator.language?.split("-")[0] || i18nConfig.fallbackLng;

        if (fallbackLang !== i18n.language) {
          i18n.changeLanguage(fallbackLang);
          log("🔁 Taal geforceerd gewijzigd via fallback", { fallbackLang });
        }

        if (document.documentElement.lang !== fallbackLang) {
          document.documentElement.lang = fallbackLang;
          log("🌍 <html lang> ingesteld op", { lang: fallbackLang });
        }
      }
    }

    if (document.documentElement.lang !== finalLang) {
      document.documentElement.lang = finalLang;
      log("🌍 <html lang> ingesteld op", { finalLang });
    }

    if (i18n.language !== finalLang) {
      i18n.changeLanguage(finalLang);
      log("✅ i18n taal gewijzigd naar", { finalLang });
    }
  } catch (err) {
    error("⚠️ Taalinitialisatie faalde. Fallback ingeschakeld", { err });
  }
};
