// src/utils/turnstile.js :
import { log, error } from "./logger";

/**
 * 🔐 Laadt Cloudflare Turnstile CAPTCHA en rendert hem in het element met ID 'turnstile-container'
 * @param {function} callback - Wordt aangeroepen wanneer Turnstile een succesvolle validatie uitvoert
 */

export const loadTurnstile = callback => {
  if (typeof window === "undefined") return;

  const siteKey = process.env.GATSBY_TURNSTILE_SITE_KEY;

  log("🔍 Turnstile Site Key from env", { siteKey });

  if (!siteKey) {
    error("🚨 ERROR: Turnstile site key is undefined! Check .env file.", {
      envKey: "GATSBY_TURNSTILE_SITE_KEY",
      context: "loadTurnstile",
    });
    return;
  }

  const script = document.createElement("script");
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
  script.async = true;
  script.defer = true;

  script.onload = () => {
    log("✅ Turnstile script geladen en render gestart", {
      container: "#turnstile-container",
      siteKey,
    });
    try {
      window.turnstile.render("#turnstile-container", {
        sitekey: siteKey,
        callback,
      });
      log("✅ Turnstile script geladen en gerenderd");
    } catch (err) {
      error("❌ Fout bij uitvoeren van turnstile.render()", { err });
    }
  };

  script.onerror = e => {
    error("❌ Fout bij het laden van Turnstile-script vanaf CDN", {
      src: script.src,
      event: e?.type ?? "unknown",
      context: "script.onerror",
    });
  };

  log("📥 Turnstile script element wordt toegevoegd aan document.body", { src: script.src });
  document.body.appendChild(script);
};
