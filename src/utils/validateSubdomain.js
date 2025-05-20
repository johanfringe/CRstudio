// src/utils/validateSubdomain.js :

// src/utils/validateSubdomain.js

import { subdomainBlocklist } from "./subdomainBlocklist";
import { log, warn, error } from "./logger";

export const MIN_LENGTH = 5;
export const MAX_LENGTH = 63;

// ✅ Regex regels
export const subdomainRegex = /^(?!.*--)[a-z0-9](?:[a-z0-9-]{3,61}[a-z0-9])?$/;
export const allowedCharsRegex = /^[a-z0-9-]+$/;

/**
 * ✅ Geef per validatiestap een boolean terug (UX purposes)
 */
export function getSubdomainValidationSteps(input = "") {
  // 🔐 Enkel echte strings verwerken — anders vervangen door lege string
  const raw = typeof input === "string" ? input.trim() : "";
  const sub = raw.toLowerCase();

  const steps = {
    notEmpty: raw.length > 0,
    validChars: allowedCharsRegex.test(raw),
    correctLength: sub.length >= MIN_LENGTH && sub.length <= MAX_LENGTH,
    startsCorrectly: /^[a-z0-9]/.test(sub),
    endsCorrectly: /[a-z0-9]$/.test(sub),
    matchesStructure: subdomainRegex.test(sub),
    notInBlocklist: !subdomainBlocklist.has(sub),
  };

  log("🔍 Subdomain validatiestappen", { input, steps });
  return steps;
}

/**
 * ✅ Retourneert foutcode string of null
 */
export function validateSubdomain(input = "") {
  // 🔐 Enkel echte strings verwerken — anders vervangen door lege string
  const raw = typeof input === "string" ? input.trim() : "";
  const sub = raw.toLowerCase();

  log("🔧 Ontvangen input voor subdomeinvalidatie", { rawInput: input });
  log("🔍 Subdomein validatie gestart", { sub });

  // 📏 Lengte check
  if (sub.length < MIN_LENGTH || sub.length > MAX_LENGTH) {
    warn("📏 Subdomein heeft ongeldige lengte", { sub, length: sub.length });
    return "auth.subdomainInvalidLength";
  }

  // 🔤 Ongeldige karakters
  if (!allowedCharsRegex.test(sub)) {
    warn("⚠️ Ongeldige tekens in subdomein", { sub });
    return "auth.subdomainInvalidFormat";
  }

  // 📐 Ongeldige structuur volgens regex
  if (!subdomainRegex.test(sub)) {
    warn("⚠️ Ongeldige structuur in subdomein", { sub });
    return "auth.subdomainInvalidStructure";
  }

  // 🚫 Blocklist
  if (subdomainBlocklist.has(sub)) {
    error("❌ Subdomein staat op de blocklist", { sub });
    return "auth.subdomainBlocklist";
  }

  // ✅ Alles is geldig
  log("✅ Subdomein is geldig", { sub });
  return null;
}
