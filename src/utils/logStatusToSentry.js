// /src/utils/logStatusToSentry.js :
import * as Sentry from "@sentry/browser";

/**
 * Logt statusinformatie naar Sentry wanneer dat relevant is.
 * @param {object} statusResult - Output van resolveUserStatus()
 */
export function logStatusToSentry(statusResult) {
  try {
    const {
      statusCode,
      translationKey,
      redirectTo,
      originContext,
      logEventName,
      isFallback,
      logToSentry,
      meta = {},
    } = statusResult;

    const shouldLog = logToSentry || meta.logToSentry || isFallback;
    if (!shouldLog) return;

    const variant = meta.translationVariant || "default";

    const contextInfo = {
      statusCode,
      translationKey,
      redirectTo,
      logEventName,
      originContext,
      translationVariant: variant,
      isFallback,
      meta,
    };

    // ✅ Local dev console logging
    if (process.env.NODE_ENV !== "production") {
      console.warn("[CRstudio] Status log to Sentry:", contextInfo);
    }

    // ✅ Sentry capture
    Sentry.captureMessage(`[Status] ${statusCode} (${variant})`, {
      level: isFallback ? "error" : "warning",
      tags: {
        statusCode,
        variant,
        originContext: originContext || "unknown",
        fallback: String(isFallback),
      },
      extra: contextInfo,
    });
  } catch (error) {
    console.error("[CRstudio] Failed to log status to Sentry:", error);
    Sentry.captureException(error, {
      extra: {
        location: "logStatusToSentry",
        input: statusResult,
      },
    });
  }
}
