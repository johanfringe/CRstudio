import * as Sentry from "@sentry/react";

// Bepaal de omgeving (development of production)
const isDevelopment = process.env.NODE_ENV === "development";

// Sentry configureren (alleen in productie!)
if (!isDevelopment) {
  Sentry.init({
    dsn: "https://example@sentry.io/project-id", // 🔹 Vervang door je eigen Sentry DSN
    environment: process.env.NODE_ENV, // 🔹 Geeft de omgeving door (bijv. production of staging)
    tracesSampleRate: 1.0, // 🔹 100% van de fouten loggen
  });
}

// Logfunctie die alleen werkt in development
export const log = (...args) => {
  if (isDevelopment) console.log(...args);
};

// Warn-functie die alleen werkt in development
export const warn = (...args) => {
  if (isDevelopment) console.warn(...args);
};

// Error-functie die ALTIJD actief is en naar Sentry stuurt
export const error = (message, details = {}) => {
  console.error(message, details); // 🔹 Altijd tonen in console

  if (!isDevelopment) {
    Sentry.captureException(new Error(message), {
      extra: details,
    });
  }
};

// Handige wrapper voor API-fouten
export const captureApiError = (endpoint, response, extra = {}) => {
  const message = `❌ API Error at ${endpoint}: ${response.status} ${response.statusText}`;
  error(message, { response, ...extra });
};

// Schakel alle console.logs uit in productie (optioneel)
if (!isDevelopment) {
  console.log = () => {};
  console.warn = () => {};
}
