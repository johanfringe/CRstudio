// src/utils/logger.js
import * as Sentry from "@sentry/react";

// ✅ Alleen zichtbaar in development
export const log = (...args) => {
  if (process.env.NODE_ENV !== "production") console.log(...args);
};

export const warn = (...args) => {
  if (process.env.NODE_ENV !== "production") console.warn(...args);
};

// ✅ Altijd zichtbaar, logt naar console én Sentry indien actief
export const error = (message, details = {}) => {
  console.error(message, details);
  if (typeof Sentry?.captureException === "function") {
    Sentry.captureException(new Error(message), {
      extra: {
        ...details,
        lang: getLang(),
        subdomain: getSubdomain(),
      },
    });
  }
};

// ✅ Specifieke wrapper voor API-fouten
export const captureApiError = (endpoint, response, extra = {}) => {
  const message = `❌ API-fout bij ${endpoint}: ${response.status} ${response.statusText}`;
  error(message, { response, ...extra });
};

// ✅ Manuele testfout voor Sentry-test
export const throwTestError = () => {
  throw new Error("🚨 Dit is een manuele testfout via throwTestError()");
};

// Helpers om taal en subdomein te capteren
function getLang() {
  if (typeof window === "undefined") return "unknown";
  return document?.documentElement?.lang || navigator.language || "unknown";
}

function getSubdomain() {
  if (typeof window === "undefined") return "server";
  const host = window.location.hostname;
  const parts = host.split(".");
  return parts.length > 2 ? parts[0] : "main"; // bv. jeanmilo.crstudio.online -> "jeanmilo"
}
