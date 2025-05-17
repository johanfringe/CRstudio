// /src/utils/statusCodes.js :

export const STATUS = {
    // ✅ Voltooide registratie: artist bestaat. Redirect naar [subdomain]/account
    AUTH_WITH_ARTIST: 'STATUS_AUTH_WITH_ARTIST',
  
    // ✅ Geregistreerd (Google of e-mail), ingelogd, maar geen artist. Redirect naar profile
    AUTH_NO_ARTIST: 'STATUS_AUTH_NO_ARTIST',
  
    // 🟡 Supabase user bestaat (geverifieerd), maar geen actieve sessie. Opnieuw aanmelden
    VERIFIED_NO_SESSION: 'STATUS_VERIFIED_NO_SESSION',
  
    // 🟠 Tijdelijke gebruiker, wacht nog op e-mailverificatie
    NEW_USER_PENDING: 'STATUS_NEW_USER_PENDING',
  
    // 🔴 Verificatie-token is verlopen, maar user bestaat nog. Herversturen e-mail
    NEW_USER_EXPIRED: 'STATUS_NEW_USER_EXPIRED',
  
    // 🔴 E-mailadres onbekend of user >24u verwijderd. Redirect naar register en herregisteren
    USER_NOT_FOUND: 'STATUS_USER_NOT_FOUND',
  
    // ⚫️ Onbekende toestand, fallback bij race condition, fetch-fouten of fout
    UNKNOWN_ERROR: 'STATUS_UNKNOWN_ERROR',
  };
  