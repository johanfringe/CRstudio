// src/utils/validatePassword.js :
import { leakedPasswords } from "./leakedPasswords";
import { checkHIBPPassword } from "./checkHIBPPassword";
import { log, warn, error } from "./logger";

const MIN_LENGTH = 12;
const MAX_LENGTH = 64;

// Geen spaties-only, geen control characters, correcte lengte
const passwordRegex = /^(?!.*[\s]{12,})[\p{L}\p{N}\p{P}\p{S}\p{Zs}\p{M}\p{Extended_Pictographic}]{12,64}$/u;

let zxcvbnModule = null;

/**
 * Optionele preload — kan gebruikt worden bij onFocus van wachtwoordveld
 */
export const preloadZxcvbn = () => {
  if (!zxcvbnModule) {
    import("zxcvbn")
      .then((mod) => {
        zxcvbnModule = mod.default || mod;
        log("🔍 zxcvbn-module vooraf geladen.");
      })
      .catch((err) => {
        error("❌ Fout bij preload van zxcvbn", { err });
      });
  }
};

/**
 * Valideert een wachtwoord op sterkte, inhoud en veiligheid
 * @param {string} password - Het ingevoerde wachtwoord
 * @param {object} context - Optionele context { email, name, subdomain }
 * @returns {string|null} - Foutcode (bv. 'auth.passwordTooWeak') of null bij succes
 */
export async function validatePassword(password, context = {}) {
  try {
    if (!password) {
      warn("⚠️ Geen wachtwoord ingevoerd", { context });
      return "auth.passwordTooShort";
    }    

    // 1. Regex: lengte, inhoud, spaties
    log("🧪 Start regex-validatie wachtwoord", { passwordLength: password.length });
    if (!passwordRegex.test(password)) {
    log("🔍 Regex-validatie mislukt", { passwordLength: password.length });
      if (password.length < MIN_LENGTH || password.length > MAX_LENGTH) {
        return "auth.passwordTooShort";
      }
      if (/^\s{12,}$/.test(password)) {
        return "auth.passwordOnlySpaces";
      }
      return "auth.passwordInvalidChars";
    }

    const blacklistRegex = new RegExp(
      String.raw`[\u0000-\u001F\u200B\u200C\u200D\u2060\uFEFF]`,
      "u"
    );

    if (blacklistRegex.test(password)) {
      warn("⚠️ Wachtwoord bevat control/unicode-tekens", { length: password.length });
      return "auth.passwordInvalidChars";
    }

    // 2. OWASP blocklist
    if (leakedPasswords.has(password.toLowerCase())) {
      warn("⚠️ Wachtwoord zit in de lokale blocklist", { length: password.length });
      return "auth.passwordTooWeak";
    }

    // 3. Dynamische import van zxcvbn
      try {
        log("📦 Laden van zxcvbn-module gestart", { email: context.email });
        if (!zxcvbnModule) {
          const mod = await import("zxcvbn");
          zxcvbnModule = mod.default || mod;
          log("✅ zxcvbn geladen bij wachtwoordvalidatie");
        }
    
        const { score } = zxcvbnModule(password);
        log("🔐 zxcvbn-score wachtwoord", { score, email: context?.email });
            if (score < 2) {
              return "auth.passwordTooWeak";
            }
      } catch (err) {
        error("❌ Fout bij laden of uitvoeren van zxcvbn", { err });
        return "auth.passwordCheckFailed";
      }

    // 4. HIBP-check
  try {
    log("🔎 Start HIBP-check");
    const isLeaked = await checkHIBPPassword(password);
    if (isLeaked) {
        warn("⚠️ Wachtwoord gevonden in HIBP-database", { length: password.length, email: context.email });
      return "auth.passwordLeaked";
    }
  } catch (err) {
    error("❌ Fout bij HIBP-check", { error: err.message });
    return "auth.passwordCheckFailed";
  }

    // 5. Persoonlijke info check
    const lowered = password.toLowerCase();
    const blocked = [context.email, context.name, context.subdomain]
      .filter(Boolean)
      .map((x) => x.toLowerCase());

      const matched = blocked.find((term) => lowered.includes(term));
      if (matched) {
        warn("⚠️ Wachtwoord bevat persoonlijke info", { matched, context });
        return "auth.passwordIncludesPersonalInfo";
      }      

    log("✅ Wachtwoord gevalideerd — alles ok", { context });
    return null; // ✅ alles ok
  } catch (err) {
    error("❌ Fout tijdens validatePassword()", { err, context });
    return "auth.passwordValidationError";
  }
}
