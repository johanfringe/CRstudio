// src/utils/validateSubdomain.js :
import { subdomainBlocklist } from "./subdomainBlocklist";
import { log, warn, error } from "./logger";

export const MIN_LENGTH = 5;
export const MAX_LENGTH = 63;

export const subdomainRegex = /^[a-z0-9](?:[a-z0-9-]{3,61}[a-z0-9])?$/;
export const allowedCharsRegex = /^[a-z0-9-]+$/;

/**
 * Geef per validatiestap een boolean terug (UX purposes)
 */
export function getSubdomainValidationSteps(input = "") {
  const raw = input.trim();
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
 * Retourneert foutcode string of null
 */
export function validateSubdomain(input = "") {
  log("🔧 Ontvangen input voor subdomeinvalidatie", { rawInput: input });
  const sub = input.trim().toLowerCase();
  log("🔍 Subdomein validatie gestart", { sub });

  if (sub.length < MIN_LENGTH || sub.length > MAX_LENGTH) {
    warn("📏 Subdomein heeft ongeldige lengte", { sub, length: sub.length });
    return "auth.subdomainInvalidLength";
  }

  if (!allowedCharsRegex.test(sub)) {
    warn("⚠️ Ongeldige tekens in subdomein", { sub });
    return "auth.subdomainInvalidFormat";
  }

  if (!subdomainRegex.test(sub)) {
    log("📐 Regex validatie gefaald", { regex: subdomainRegex.toString(), value: sub });
    warn("⚠️ Ongeldige structuur in subdomein", { sub });
    return "auth.subdomainInvalidStructure";
  }

  if (subdomainBlocklist.has(sub)) {
    error("❌ Subdomein staat op de blocklist", { sub });
    return "auth.subdomainBlocklist";
  }

  log("✅ Subdomein is geldig", { sub });
  return null;
}
