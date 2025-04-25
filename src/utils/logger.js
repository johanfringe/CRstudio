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

  if (typeof Sentry !== "undefined" && Sentry?.captureMessage) {
    Sentry.captureMessage(message, {
      extra: details,
      level: "error",
    });
  }
};

// ✅ Specifieke wrapper voor API-fouten (valt veilig terug als response ontbreekt)
export const captureApiError = (endpoint, response, extra = {}) => {
  const status = response?.status ?? "NO_RESPONSE";
  const statusText = response?.statusText ?? "Geen response beschikbaar";
  const code = extra?.errorCode ?? "UNKNOWN_CODE";

  const logContext = { response, ...extra, status, statusText, code };

  // ✅ Bekende successcodes die géén fout of waarschuwing zijn
  const knownSuccessCodes = [
    "REGISTER_OK",
    "EMAIL_SEND",
    "EMAIL_SEND_AGAIN",
    "ALREADY_REGISTERED"
  ];

  // ⚠️ Codes die een 'milde waarschuwing' aangeven (bijv. dubbele registratie)
  const warnCodes = [
    "EMAIL_DUPLICATE",
    "TURNSTILE_FAILED",
    "EMAIL_INVALID"
  ];

  const isNoResponse = status === "NO_RESPONSE";
  const isHttpError = status >= 400;
  const isKnownSuccess = knownSuccessCodes.includes(code);
  const isWarn = warnCodes.includes(code);

  const shouldLogAsError =
    isNoResponse || isHttpError || extra.forceCapture || (!isKnownSuccess && !isWarn && status < 400);

  const message = `📡 API-respons van ${endpoint}: ${status} ${statusText}`;

  if (shouldLogAsError) {
    error(`❌ ${message}`, logContext);
  } else if (isWarn) {
    warn(`⚠️ ${message} (waarschuwing)`, logContext);
  } else if (process.env.NODE_ENV !== "production") {
    log(`✅ ${message}`, logContext);
  }
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
