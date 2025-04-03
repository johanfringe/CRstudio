// src/utils/checkHIBPPassword.js :
import sha1 from "js-sha1";

// Optioneel cache-resultaat binnen sessie
const hibpCache = new Map();

/**
 * Controleer of een wachtwoord gelekt is via HaveIBeenPwned API (k-anonimiteit)
 * @param {string} password
 * @returns {Promise<boolean>} true = gelekt, false = veilig
 */
export async function checkHIBPPassword(password) {
  if (!password || typeof password !== "string") return false;

  if (hibpCache.has(password)) {
    return hibpCache.get(password);
  }

  const hashed = sha1(password).toUpperCase();
  const prefix = hashed.slice(0, 5);
  const suffix = hashed.slice(5);

  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);

    if (!res.ok) {
      console.warn("HIBP API error", res.status);
      return false; // fail open
    }

    const lines = (await res.text()).split("\n");
    const isLeaked = lines.some((line) => {
      const [hashSuffix] = line.trim().split(":");
      return hashSuffix === suffix;
    });

    hibpCache.set(password, isLeaked);
    return isLeaked;

  } catch (err) {
    console.error("Fout bij HIBP-check:", err);
    return false; // fail open
  }
}
