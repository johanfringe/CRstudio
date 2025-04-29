// src/utils/sentryInit.js
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/browser";
import { Replay } from "@sentry/replay";
import { log, warn, error } from "./logger";

/**
 * Initialiseert Sentry op basis van de omgeving en mode.
 * 
 * @param {Object} options
 * @param {("browser"|"ssr"|"build")} options.mode - Bepaalt de initialisatiemodus
 */
export function initSentry({ mode = "browser" } = {}) {
  if (typeof window === "undefined" && mode === "browser") {
    warn("🚫 initSentry(): 'browser' mode maar window is undefined. Init geannuleerd.");
    return;
  }

  const dsn = process.env.GATSBY_SENTRY_DSN || process.env.SENTRY_DSN;
  const env = process.env.NODE_ENV;
  const isDev = env === "development";

  if (!dsn) {
    warn("⚠️ Geen DSN gevonden. Sentry wordt niet geïnitialiseerd.");
    return;
  }

  const commonOptions = {
    dsn,
    environment: env,
    debug: isDev,
    release: process.env.SENTRY_RELEASE || "unknown",
  };

  try {
    if (mode === "browser") {
      Sentry.init({
        ...commonOptions,
        integrations: [new BrowserTracing(), new Replay()],
        tracesSampleRate: isDev ? 0.0 : 0.1,
        replaysSessionSampleRate: isDev ? 0.0 : 0.0, // tijdelijk, normaal 0.0 : 0.1, (geen 429 errors meer!)
        replaysOnErrorSampleRate: isDev ? 0.0 : 1.0,
      });
      log("✅ Sentry succesvol geïnitialiseerd in browser-mode");
    } else if (mode === "ssr") {
      Sentry.init({
        ...commonOptions,
        tracesSampleRate: isDev ? 0.1 : 1.0, // Server-side mag iets ruimer in dev
      });
      log("✅ Sentry succesvol geïnitialiseerd in SSR-mode");
    } else if (mode === "build") {
      // Voor gebruik tijdens build processing (bv. uploads sourcemaps)
      Sentry.init(commonOptions);
      log("✅ Sentry succesvol geïnitialiseerd in build-mode");
    } else {
      warn(`⚠️ Onbekende Sentry init mode: ${mode}`);
    }
  } catch (err) {
    error("❌ Fout tijdens initialisatie van Sentry", { err, mode });
  }
}
