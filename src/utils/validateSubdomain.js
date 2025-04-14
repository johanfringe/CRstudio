// src/utils/validateSubdomain.js :
import { subdomainBlocklist } from "@/utils/subdomainBlocklist";

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

  return {
    notEmpty: raw.length > 0,
    validChars: /^[a-z0-9-]+$/.test(raw), // 🔄 gebruik raw, niet sub
    correctLength: sub.length >= MIN_LENGTH && sub.length <= MAX_LENGTH,
    startsCorrectly: /^[a-z0-9]/.test(sub),
    endsCorrectly: /[a-z0-9]$/.test(sub),
    matchesStructure: subdomainRegex.test(sub),
    notInBlocklist: !subdomainBlocklist.has(sub),
  };
}
/**
 * Retourneert foutcode string of null
 */
export function validateSubdomain(input = "") {
  const sub = input.trim().toLowerCase();

  if (sub.length < MIN_LENGTH || sub.length > MAX_LENGTH) {
    return "auth.subdomainInvalidLength";
  }

  if (!allowedCharsRegex.test(sub)) {
    return "auth.subdomainInvalidFormat";
  }

  if (!subdomainRegex.test(sub)) {
    return "auth.subdomainInvalidStructure";
  }

  if (subdomainBlocklist.has(sub)) {
    return "auth.subdomainBlocklist";
  }

  return null;
}
