// /src/utils/resolveUserStatus.js :
import { STATUS } from "./statusCodes";
import { CONTEXT, statusMap } from "./statusMap";

// ✅ Centrale helper: haalt config uit statusMap + injecteert variant
export function resolveStatusEntry(statusCode, translationVariant = "default") {
  const entry = statusMap[statusCode];

  if (!entry) {
    console.warn("[CRstudio] Onbekende statusCode in resolveStatusEntry:", statusCode);
    return statusMap[STATUS.UNKNOWN_ERROR];
  }

  return {
    ...entry,
    meta: {
      ...entry.meta,
      translationVariant,
    },
  };
}

// ✅ Centrale statusdetector voor registratie/verificatie/profiel
export function resolveUserStatus({ user, session, artist, token, originPage }) {
  // 1️⃣ AUTH_WITH_ARTIST → gebruiker volledig ingelogd en gekoppeld
  if (user && session && artist) {
    const variant = "default";
    return resolveStatusEntry(STATUS.AUTH_WITH_ARTIST, variant);
  }

  // 2️⃣ AUTH_NO_ARTIST → ingelogd maar geen profiel
  if (user && session && !artist) {
    const isTemp = token?.isTempUser && !token?.isExpired;
    const isRegisterPage = originPage === CONTEXT.REGISTER || originPage === CONTEXT.VERIFY_EMAIL;
    const isNewByDate =
      user.created_at && Date.now() - new Date(user.created_at).getTime() < 10 * 60 * 1000;
    const isFromRegister = isTemp || isRegisterPage || isNewByDate;
    const variant = isFromRegister ? "registerConfirmed" : "welcomeBack";
    return resolveStatusEntry(STATUS.AUTH_NO_ARTIST, variant);
  }

  // 3️⃣ VERIFIED_NO_SESSION → geverifieerde gebruiker zonder sessie
  if (user && !session) {
    const variant = user.provider === "google" ? "login_Google" : "login_Email";
    return resolveStatusEntry(STATUS.VERIFIED_NO_SESSION, variant);
  }

  // 4️⃣ NEW_USER_PENDING → tijdelijke gebruiker <30min, wacht nog op bevestiging
  if (token?.isTempUser && !token?.isExpired) {
    // 🔧 Configuratie
    const NEW_USER_PENDING_THRESHOLD_MS = 5 * 60 * 1000; // 5 minuten
    const CLOCK_DRIFT_MARGIN_MS = 60 * 1000; // 1 minuut marge bij client/server klokverschil

    // ⏱ Timestamp uit token (of eventueel uit user fallback)
    const createdAtString = token.createdAt || user?.created_at || null;
    const createdAtMs = createdAtString ? new Date(createdAtString).getTime() : null;
    const nowMs = Date.now();

    // 🛡️ Fallback naar 'verifying' bij ongeldige timestamp
    if (!createdAtMs || isNaN(createdAtMs)) {
      console.warn(
        "[CRstudio] NEW_USER_PENDING: ontbrekende of ongeldige createdAt:",
        createdAtString
      );
      return resolveStatusEntry(STATUS.NEW_USER_PENDING, "verifying");
    }

    // 🔍 Sanity check: token ouder dan 24u = vreemd
    const diff = nowMs - createdAtMs;
    if (diff < 0 || diff > 24 * 60 * 60 * 1000) {
      console.warn("[CRstudio] NEW_USER_PENDING: createdAt lijkt abnormaal:", diff, "ms");
    } else if (process.env.NODE_ENV === "development") {
      console.debug("[CRstudio] NEW_USER_PENDING: leeftijd token (ms):", diff);
    }

    // 🧠 Clock drift correctie in voordeel van gebruiker
    const adjustedAge = nowMs + CLOCK_DRIFT_MARGIN_MS - createdAtMs;
    const variant = adjustedAge < NEW_USER_PENDING_THRESHOLD_MS ? "email_send" : "verifying";

    return resolveStatusEntry(STATUS.NEW_USER_PENDING, variant);
  }

  // 5️⃣ NEW_USER_EXPIRED → tijdelijke gebruiker, link verlopen
  if (token?.isTempUser && token?.isExpired) {
    const variant = originPage === "register" ? "registerFlow" : "profileFlow";
    return resolveStatusEntry(STATUS.NEW_USER_EXPIRED, variant);
  }

  // 6️⃣ USER_NOT_FOUND → token verwijst naar niet-bestaande gebruiker
  if (token?.notFound) {
    const variant = "default";
    return resolveStatusEntry(STATUS.USER_NOT_FOUND, variant);
  }

  // 7️⃣ UNKNOWN_ERROR → fallback bij race conditions of broken states
  const variant = "default";
  return resolveStatusEntry(STATUS.UNKNOWN_ERROR, variant);
}
