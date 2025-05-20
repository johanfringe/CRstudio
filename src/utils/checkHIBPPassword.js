// src/utils/checkHIBPPassword.js :
import sha1 from "js-sha1";
import { log, warn, error, captureApiError } from "./logger";

// Optioneel cache-resultaat binnen sessie
const hibpCache = new Map();

/**
 * Controleer of een wachtwoord gelekt is via HaveIBeenPwned API (k-anonimiteit)
 * @param {string} password
 * @returns {Promise<boolean>} true = gelekt, false = veilig
 */
export async function checkHIBPPassword(password) {
  if (!password || typeof password !== "string") {
    warn("⚠️ Ongeldig wachtwoord meegegeven aan checkHIBPPassword", { password });
    return false;
  }

  // Controleer cache
  if (hibpCache.has(password)) {
    log("🔁 HIBP-cache gebruikt voor wachtwoord", { prefix });
    return hibpCache.get(password);
  }

  const hashed = sha1(password).toUpperCase();
  const prefix = hashed.slice(0, 5);
  const suffix = hashed.slice(5);
  log("🔐 Wachtwoord gehashed", { prefix, suffixPreview: suffix.slice(0, 5) }); // nooit volledige hash

  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);

    if (!res.ok) {
      warn("⚠️ HIBP API gaf geen OK-status", { status: res.status, prefix });
      captureApiError("HIBP", res, { prefix });
      return false; // fail open
    }

    const lines = (await res.text()).split("\n");
    log("📄 HIBP response bevat", { lines: lines.length });

    const isLeaked = lines.some(line => {
      const [hashSuffix] = line.trim().split(":");
      return hashSuffix === suffix;
    });

    hibpCache.set(password, isLeaked);
    log("🔍 HIBP resultaat verwerkt", { prefix, isLeaked });
    return isLeaked;
  } catch (err) {
    error("❌ Fout bij ophalen van HIBP-data", { err, prefix, context: "checkHIBPPassword" });
    return false; // fail open
  }
}
