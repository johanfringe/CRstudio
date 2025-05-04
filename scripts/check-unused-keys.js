// scripts/check-unused-keys.js
// Gebruik met: node scripts/check-unused-keys.js

const fs = require("fs");
const glob = require("glob");

// 📁 Aanpasbaar pad naar vertaling
const TRANSLATION_PATH = "./src/locales/nl/translation.json";

// 🔧 Flatten alle geneste keys
const flattenKeys = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([key, val]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    return typeof val === "object" && val !== null
      ? flattenKeys(val, fullKey)
      : [fullKey];
  });

// 🔍 Zoek keys in JS-content: t("...") of "faq.q1"
const findUsedKeys = (content) => {
  const matches = [];

  // t("...") / t('...') / t(`...`)
  const tMatches = [...content.matchAll(/t\(["'`]([^"'`]+)["'`]\)/g)];
  tMatches.forEach((m) => matches.push(m[1]));

  // ook "faq.q1", 'profile.verify_error.EMAIL_DUPLICATE'
  const stringMatches = [...content.matchAll(/["'`]([a-z0-9_-]+\.[a-z0-9_.-]+)["'`]/gi)];
  stringMatches.forEach((m) => matches.push(m[1]));

  return matches;
};

// ✅ Dynamische key helpers
const addDynamicKeyRange = (prefix, start, end, suffixes = ["title", "text"]) => {
  for (let i = start; i <= end; i++) {
    suffixes.forEach((suffix) => {
      usedKeys.add(`${prefix}.${i}.${suffix}`);
    });
  }
};

const addDynamicErrorCodes = (prefix, codes) => {
  codes.forEach((code) => usedKeys.add(`${prefix}.${code}`));
};

const addDynamicFaqKeys = () => {
  for (let i = 1; i <= 15; i++) {
    usedKeys.add(`faq.q${i}`);
    usedKeys.add(`faq.a${i}`);
  }
};

// 🚀 Main run
const runCheck = () => {
  const translation = JSON.parse(fs.readFileSync(TRANSLATION_PATH, "utf8"));
  const allKeys = flattenKeys(translation);
  usedKeys = new Set();

  const files = glob.sync("src/**/*.{js,jsx}");

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    findUsedKeys(content).forEach((key) => usedKeys.add(key));
  }

  // 🔁 Voeg dynamisch gegenereerde keys toe
  addDynamicKeyRange("terms.points", 1, 14);
  addDynamicKeyRange("privacy.points", 1, 12);
  addDynamicFaqKeys();
  addDynamicErrorCodes("profile.verify_error", [
    "EMAIL_DUPLICATE",
    "EMAIL_INVALID",
    "EMAIL_SEND_AGAIN",
    "EMAIL_SEND_FAILED_AGAIN",
    "EMAIL_VERIFIED",
    "FETCH_FAILED",
    "INTERNAL_ERROR",
    "INTERNAL_EXCEPTION",
    "INVALID_SESSION",
    "INSERT_FAILED",
    "METHOD_NOT_ALLOWED",
    "PROFILE_CREATED",
    "RATE_LIMIT",
    "REDIS_UNAVAILABLE",
    "RPC_FAILED",
    "RPC_RESPONSE_INVALID",
    "SERVER_ERROR",
    "SUBDOMAIN_CHECK_FAILED",
    "SUBDOMAIN_TAKEN",
    "TOKEN_EXPIRED",
    "TOKEN_INVALID",
    "TOKEN_MISSING",
    "TOKEN_NOT_FOUND",
    "TOKEN_REQUIRED",
    "TOKEN_UPDATE_FAILED",
    "UNKNOWN_ERROR",
    "USER_CREATION_FAILED",
    "USER_NOT_FOUND"
  ]);

  addDynamicErrorCodes("register.verify_error", [
    "ALREADY_REGISTERED",
    "AUTH_CHECK_FAILED",
    "EMAIL_DUPLICATE",
    "EMAIL_INVALID",
    "EMAIL_SEND",
    "EMAIL_SEND_AGAIN",
    "EMAIL_SEND_FAILED",
    "EMAIL_SEND_FAILED_AGAIN",
    "INSERT_FAILED",
    "INTERNAL_EXCEPTION",
    "KICKBOX_FAILED",
    "METHOD_NOT_ALLOWED",
    "MISSING_FIELDS",
    "RATE_LIMIT",
    "TURNSTILE_FAILED",
    "UNKNOWN_ERROR"
  ]);

  // 🔍 Vergelijk
  const unusedKeys = allKeys.filter((key) => !usedKeys.has(key));

  if (unusedKeys.length > 0) {
    console.log(`🟡 Ongebruikte vertaalkeys gevonden (${unusedKeys.length}):\n`);
    unusedKeys.forEach((k) => console.log("  -", k));
    console.log("\n💡 Tip: verwijder manueel of bewaar voor toekomstige features.");
    process.exit(1);
  } else {
    console.log("✅ Alle vertaalkeys worden gebruikt! 🎉");
    process.exit(0);
  }
};

let usedKeys = new Set();
runCheck();
