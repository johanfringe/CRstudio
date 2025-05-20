// /src/hooks/useStatusMessage.js

import { useTranslation } from "react-i18next";
import { resolveTranslationKeys } from "../utils/resolveTranslationKeys";

/**
 * Hook die automatisch heading/text/type afleidt uit een statusobject.
 * @param {object|null} status - De status zoals afgeleid via resolveUserStatus()
 * @returns {object} - { heading, text, type }
 */
export function useStatusMessage(status) {
  const { t } = useTranslation();

  if (!status) return { heading: null, text: null, type: null };

  const { headingKey, textKey } = resolveTranslationKeys(status);
  const type = status.meta?.messageType || "info";

  return {
    heading: t(headingKey),
    text: t(textKey),
    type,
  };
}
