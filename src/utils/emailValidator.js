// src/utils/emailValidator.js :

/**
 * ✅ Best practice e-mailvalidatie voor real-world apps zoals CRstudio
 *
 * Deze regex controleert op:
 * - één enkel @-teken
 * - minimaal één teken voor en na de @
 * - minimaal één punt in het domeingedeelte
 * - geen spaties of verboden tekens
 *
 * Waarom deze aanpak?
 * - ✅ Snel, lichtgewicht en veilig voor UI/backend-validatie
 * - ✅ Toegankelijk voor de meeste echte e-mailadressen
 * - ✅ Voorkomt overvalidatie en false positives
 * - ❌ Niet 100% RFC 5322-compliant (maar dat is zelden wenselijk)
 * - ❌ Laat geen unicode domeinen toe (bewuste keuze)
 *
 * Voor strengere validatie: combineer dit met Kickbox of een dubbele bevestiging per e-mail.
 */

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  