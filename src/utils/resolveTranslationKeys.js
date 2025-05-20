// /src/utils/resolveTranslationKeys.js
/**
 * Resolves the correct heading/text translation keys for a given status entry.
 *
 * ✅ Verwacht:
 *  - translationKey: string (bv. 'account.status_auth_no_artist')
 *  - meta.translationVariant: string (bv. 'welcomeBack', 'registrationConfirmed')
 * ✅ `entry.originContext` wordt enkel nog gebruikt voor logging/debugging.
 *
 * @param {object} entry - Een status entry uit statusMap
 * @returns {object} - { headingKey, textKey, useObjectTranslation }
 */
export function resolveTranslationKeys(entry) {
  if (!entry || typeof entry !== "object") {
    console.warn("[CRstudio] Missing or invalid status entry in resolveTranslationKeys()");
    return {
      headingKey: "shared.status_unknown_error.heading",
      textKey: "shared.status_unknown_error.text",
      useObjectTranslation: false,
    };
  }

  const { translationKey, originContext } = entry;
  const variant = entry.meta?.translationVariant;

  if (typeof translationKey !== "string") {
    console.warn(
      "[CRstudio] Missing translationKey in status entry",
      "originContext:",
      originContext || "unknown"
    );
    return {
      headingKey: "shared.status_unknown_error.heading",
      textKey: "shared.status_unknown_error.text",
      useObjectTranslation: false,
    };
  }

  if (variant && typeof variant === "string") {
    return {
      headingKey: `${translationKey}.${variant}.heading`,
      textKey: `${translationKey}.${variant}.text`,
      useObjectTranslation: false,
    };
  }

  // ✅ Fallback naar `.default` (veilig bij vergeten variant)
  console.warn(
    `[CRstudio] Missing translationVariant for: ${translationKey}. Falling back to .default.`,
    "originContext:",
    originContext || "unknown"
  );
  return {
    headingKey: `${translationKey}.default.heading`,
    textKey: `${translationKey}.default.text`,
    useObjectTranslation: false,
  };
}
