// __tests__/emailValidator.test.js :
import { validateEmail } from "../emailValidator";

describe("validateEmail()", () => {
  test("✅ Geldige e-mailadressen", () => {
    const validEmails = [
      "john@example.com",
      "user.name+tag+sorting@example.com",
      "user_name@example.co.uk",
      "user-name@sub.example.org",
      "test@example.travel",
      "jöhn@exämple.com", // unicode allowed
      "用户@例子.广告", // unicode domain + content allowed
      "a".repeat(64) + "@b.com", // lange local-part
    ];
    validEmails.forEach(email => {
      expect(validateEmail(email)).toBe(true);
    });
  });

  test("❌ Ongeldige e-mailadressen (volgens regex)", () => {
    const invalidEmails = [
      "", // leeg
      "plainaddress", // geen @
      "@missinguser.com", // begint met @
      "user@ domain.com", // spatie in domein
      "user@domain .com", // spatie na dot
      "user@@domain.com", // dubbele @
      "user@.com", // dot direct na @
      "user@domain", // geen punt in domein
    ];
    invalidEmails.forEach(email => {
      const result = validateEmail(email);
      if (result) console.warn("⚠️ Wordt foutief geaccepteerd door regex:", email);
      expect(result).toBe(false);
    });
  });

  test("🧪 Grote lengte maar geldig", () => {
    const local = "a".repeat(64);
    const domain = "b".repeat(63) + ".com";
    const longEmail = `${local}@${domain}`;
    expect(validateEmail(longEmail)).toBe(true);
  });
});
