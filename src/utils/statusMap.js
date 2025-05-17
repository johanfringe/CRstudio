// /src/utils/statusMap.js :

import { STATUS } from './statusCodes';

// ✅ Contexten waarin een status zich kan voordoen. Wordt alleen gebruikt voor logging/debugging
export const CONTEXT = {
  REGISTER: 'register',
  PROFILE: 'profile',
  VERIFY_EMAIL: 'verify-email',
  RESOLVE_STATUS: 'resolve-status',
};

// ✅ defaultMeta : UI-gedreven booleans per status; worden overschreven via overrides
export const defaultMeta = {
  requiresLogin: false,
  reRegister: false,
  resendVerification: false,
  emailSent: false,
  promptLogin: false,
  showForm: false,
  showPasswordField: false,
  hasArtist: false,
  isTempUser: false,
  expiredToken: false,
  providerDependent: false,
  userNotFound: false,
  messageType: 'info', // 'info' | 'success' | 'warning' | 'error'
};

// ✅ Helper
function createStatusConfig({
  statusCode,
  translationKey,
  redirectTo = null,
  logEventName = null,
  originContext = null,  // CONTEXT.REGISTER, CONTEXT.PROFILE, CONTEXT.VERIFY-EMAIL, CONTEXT.RESOLVE-STATUS (alleen bij logging)
  isFallback = false,
  logToSentry = false,
  isFinal = false, // laatste stap in de flow, er wordt geen verdere redirect verwacht.
  overrides = {},
}) {
  return {
    statusCode,
    translationKey,
    redirectTo,
    logEventName,
    originContext,
    isFallback,
    logToSentry,
    isFinal,
    meta: {
      ...defaultMeta,
      ...overrides,
    },
  };
}

export const statusMap = {

// 1️⃣ Authenticated user mét artist → redirect naar subdomein accountpagina
[STATUS.AUTH_WITH_ARTIST]: createStatusConfig({
    statusCode: STATUS.AUTH_WITH_ARTIST,
    translationKey: 'status.auth_with_artist',
    redirectTo: '[subdomain].crstudio.online/account',
    logEventName: 'REDIRECT_TO_ARTIST_ACCOUNT',
    originContext: CONTEXT.RESOLVE_STATUS,
    isFinal: true,
    overrides: {
      requiresLogin: true,
      promptLogin: true,
      hasArtist: true,
      messageType: 'success',
    },
  }),
  
// 2️⃣ Authenticated user zonder artist → profiel vervolledigen
[STATUS.AUTH_NO_ARTIST]: createStatusConfig({
    statusCode: STATUS.AUTH_NO_ARTIST,
    translationKey: 'status.auth_no_artist',
    redirectTo: '/profile',
    logEventName: 'REDIRECT_TO_PROFILE_NO_ARTIST',
    originContext: CONTEXT.RESOLVE_STATUS,
    overrides: {
      requiresLogin: true,
      promptLogin: true,
      showForm: true,
      showPasswordField: true,
      providerDependent: true,
      messageType: 'info',
    },
  }),

// 3️⃣ Geverifieerde gebruiker zonder actieve sessie
[STATUS.VERIFIED_NO_SESSION]: createStatusConfig({
    statusCode: STATUS.VERIFIED_NO_SESSION,
    translationKey: 'status.verified_no_session',
    logEventName: 'VERIFIED_BUT_NO_SESSION',
    originContext: CONTEXT.RESOLVE_STATUS,
    overrides: {
      requiresLogin: true,
      promptLogin: true,
      providerDependent: true,
      messageType: 'info',
    },
  }),

// 4️⃣ Nieuwe gebruiker — e-mailverificatie onderweg of nog niet bevestigd
[STATUS.NEW_USER_PENDING]: createStatusConfig({
    statusCode: STATUS.NEW_USER_PENDING,
    translationKey: 'status.new_user_pending',
    logEventName: 'TEMP_USER_PENDING_CONFIRMATION',
    originContext: CONTEXT.REGISTER,
    overrides: {
      emailSent: true,
      isTempUser: true,
      messageType: 'info',
    },
  }),

// 5️⃣ Verificatielink verlopen, nieuwe e-mail nodig
[STATUS.NEW_USER_EXPIRED]: createStatusConfig({
    statusCode: STATUS.NEW_USER_EXPIRED,
    translationKey: 'status.new_user_expired',
    logEventName: 'RESEND_EXPIRED_USER',
    originContext: CONTEXT.VERIFY_EMAIL,
    logToSentry: true,
    overrides: {
        resendVerification: true,
        isTempUser: true,
        expiredToken: true,
        messageType: 'warning',
    },
}),

// 6️⃣ Onbestaande gebruiker (>24u oud)
[STATUS.USER_NOT_FOUND]: createStatusConfig({
    statusCode: STATUS.USER_NOT_FOUND,
    translationKey: 'status.user_not_found',
    redirectTo: '/register',
    logEventName: 'USER_NOT_FOUND_ON_VERIFICATION',
    originContext: CONTEXT.VERIFY_EMAIL,
    logToSentry: true,
    overrides: {
      userNotFound: true,
      reRegister: true,
      showForm: true,
      messageType: 'warning',
    },
  }),

// 7️⃣ Fallback bij race conditions, broken states...
[STATUS.UNKNOWN_ERROR]: createStatusConfig({
    statusCode: STATUS.UNKNOWN_ERROR,
    translationKey: 'status.unknown_error',
    logEventName: 'STATUS_FALLBACK_UNKNOWN',
    originContext: CONTEXT.RESOLVE_STATUS,
    isFallback: true,
    logToSentry: true,
    overrides: {
      messageType: 'error',
    },
  }),  
};