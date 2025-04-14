// src/utils/validatePassword.js :
import { leakedPasswords } from "./leakedPasswords";
import { checkHIBPPassword } from "./checkHIBPPassword";

const MIN_LENGTH = 12;
const MAX_LENGTH = 64;

const passwordRegex = /^(?!.*[\s]{12,})[\p{L}\p{N}\p{P}\p{S}\p{Zs}\p{M}\p{Extended_Pictographic}]{12,64}$/u;

let zxcvbnModule = null;

/**
 * Optionele preload — kan gebruikt worden bij onFocus van wachtwoordveld
 */
export const preloadZxcvbn = () => {
  if (!zxcvbnModule) {
    import("zxcvbn").then((mod) => {
      zxcvbnModule = mod.default || mod;
    });
  }
};

/**
 * Valideert een wachtwoord — retourneert een foutcode string of null
 */
export async function validatePassword(password, context = {}) {
  if (!password) return "auth.passwordTooShort";

  // 1. Regex: lengte, inhoud, spaties
  if (!passwordRegex.test(password)) {
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
    return "auth.passwordInvalidChars";
  }

  // 2. OWASP blocklist
  if (leakedPasswords.has(password.toLowerCase())) {
    return "auth.passwordTooWeak";
  }

  // 3. Dynamische import van zxcvbn
  if (!zxcvbnModule) {
    const mod = await import("zxcvbn");
    zxcvbnModule = mod.default || mod;
  }

  const { score } = zxcvbnModule(password);
  if (score < 2) {
    return "auth.passwordTooWeak";
  }

  // 4. HIBP-check
  const isLeaked = await checkHIBPPassword(password);
  if (isLeaked) {
    return "auth.passwordLeaked";
  }

  // 5. Persoonlijke info check
  const lowered = password.toLowerCase();
  const blocked = [context.email, context.name, context.subdomain]
    .filter(Boolean)
    .map((x) => x.toLowerCase());

  if (blocked.some((term) => lowered.includes(term))) {
    return "auth.passwordIncludesPersonalInfo";
  }

  return null; // ✅ alles ok
}
