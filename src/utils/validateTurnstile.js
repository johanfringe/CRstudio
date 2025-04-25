// src/utils/validateTurnstile.js :
import { log, warn, error, captureApiError } from "./logger";

export const validateTurnstile = async (token) => {
  const maskedToken = token ? token.slice(0, 6) + "... (masked)" : "undefined";
  if (!token) {
    warn("⚠️ Turnstile: Geen token ontvangen!", { token });
    return { success: false, message: "Turnstile token is missing" };
  }

  if (!process.env.TURNSTILE_SECRET) {
    error("❌ Turnstile secret ontbreekt in environment variabelen!");
    return { success: false, message: "Internal config error" };
  }

  try {
    log("📤 Turnstile validatie-request verstuurd", { token: maskedToken });
    
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET,
        response: token,
      }),
    });

    const data = await response.json();
    log("✅ Turnstile validatierespons", { token: maskedToken, data });

    if (!data.success) {
      warn("❌ Turnstile verificatie mislukt!", { token: maskedToken, cloudflareResponse: data });
      captureApiError("turnstile.siteverify", response, { token: maskedToken, cloudflareResponse: data, errorCode: "TURNSTILE_FAILED" });
      return { success: false, message: "Turnstile verification failed" };
    }
    
    log("✅ Turnstile validatie geslaagd", { token: maskedToken });
    return { success: true };
  } catch (err) {
    error("❌ Turnstile netwerkfout of andere onverwachte fout", { err, token: maskedToken });
    captureApiError("Turnstile siteverify", undefined, { err, token: maskedToken, errorCode: "TURNSTILE_NETWORK_ERROR" });
    return { success: false, message: "Turnstile validation error" };
  }
};
