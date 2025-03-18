// gatsby-browser.js :
import "./src/styles/global.css"; // ✅ Zorg ervoor dat de styling correct wordt geïmporteerd
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { Replay } from "@sentry/replay";

import { wrapPageElement as wrap } from "./src/i18n/wrapPageElement";
import i18n from "./src/i18n/i18n";
import i18nConfig from "./src/i18n/i18nConfig";

// ✅ SENTRY INITIALISATIE (Plaats deze hier!)

if (process.env.SENTRY_DSN) {
  try {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [new BrowserTracing(), new Replay()],
      tracesSampleRate: process.env.NODE_ENV === "production" ? 1.0 : 0.1, 
      tracePropagationTargets: ["localhost", /^https:\/\/crstudio\.online\/api/],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });

    console.log("✅ Sentry succesvol geïnitialiseerd.");
  } catch (error) {
    console.error("❌ Fout bij initialisatie van Sentry:", error);
  }
} else {
  console.warn("⚠️ Sentry DSN ontbreekt, monitoring is niet actief.");
}

// ✅ Exporteer de Page Wrapper zoals normaal
export const wrapPageElement = wrap;

// ✅ Gatsby's client-side initiële rendering
export const onInitialClientRender = () => {
  if (typeof window === "undefined") return; // 🚀 Voorkomt SSR-fouten

  try {
    // 🚀 Veilig ophalen van localStorage (voorkomt privacy-modus fouten)
    let storedLang;
    try {
      storedLang = window.localStorage.getItem("i18nextLng");
    } catch (error) {
      console.warn("⚠️ localStorage is niet toegankelijk. Voorkeurstaal wordt niet opgeslagen.", error);
      storedLang = null; // 🚀 Zorgt voor een fallback
    }

    const supportedLangs = i18nConfig.supportedLngs;
    // 🚀 Valideer browsertaal en gebruik fallback als nodig
    const browserLangs = (Array.isArray(navigator.languages) && navigator.languages.length 
      ? navigator.languages 
      : [navigator.language ?? i18nConfig.fallbackLng]
    ).filter(Boolean); // 🚀 Verwijdert lege strings **direct**

    if (process.env.NODE_ENV === "development") {
      console.log("🚀 Gedetecteerde talen:", browserLangs);
    }

    // 🚀 Detecteer de beste taal
    const detectedLang = browserLangs
      .map(lang => lang?.split("-")[0]) // ✅ Converteer "nl-BE" → "nl"
      .find(lang => supportedLangs.includes(lang)) || i18nConfig.fallbackLng;

    // 🚀 Controleer of de opgeslagen taal geldig is
    const validStoredLang = storedLang && supportedLangs.includes(storedLang) ? storedLang : null;

    // 🚀 Bepaal de uiteindelijke taal
    const finalLang = validStoredLang || detectedLang;

    // 🚀 Alleen opslaan als de taal wijzigt
    if (storedLang !== finalLang) {
      try {
        window.localStorage.setItem("i18nextLng", finalLang);
        if (process.env.NODE_ENV === "development") {
          console.log(`🌍 Taal opgeslagen: ${finalLang}`);
        }
      } catch (error) {
        console.warn("⚠️ localStorage niet toegankelijk. Probeer fallback via navigator.language.", error);

        // 🚀 Fallback als localStorage niet toegankelijk is
        const fallbackLang = navigator.language?.split("-")[0] || i18nConfig.fallbackLng;
        
        if (fallbackLang !== i18n.language) {
          console.log(`🔄 Fallback ingeschakeld. Taal gewijzigd naar: ${fallbackLang}`);
          i18n.changeLanguage(fallbackLang);
        }

        // 🚀 Update <html lang=""> alleen als nodig
        if (document.documentElement.lang !== fallbackLang) {
          document.documentElement.lang = fallbackLang;
          console.log(`🌍 <html lang> ingesteld op: ${fallbackLang}`);
        }
      }
    }

    // 🚀 Update <html lang="xx"> alleen indien nodig
    if (document.documentElement.lang !== finalLang) {
      document.documentElement.lang = finalLang;
      if (process.env.NODE_ENV === "development") {
        console.log(`🌍 <html lang> ingesteld op: ${finalLang}`);
      }
    }

    // 🚀 Voorkom onnodige i18n-taalwijzigingen
    if (i18n.language !== finalLang) {
      i18n.changeLanguage(finalLang);
      if (process.env.NODE_ENV === "development") {
        console.log(`✅ i18n taal gewijzigd naar: ${finalLang}`);
      }
    }

  } catch (error) {
    console.warn("⚠️ localStorage of navigator.language niet toegankelijk. Fallback geactiveerd.", error);
  }
};
