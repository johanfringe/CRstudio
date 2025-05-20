// __tests__/validatePassword.test.js :

import { validatePassword } from "../validatePassword";

// 🔧 Mock lokale blocklist
jest.mock("../leakedPasswords", () => ({
  leakedPasswords: new Set(["123456789012", "password123"]),
}));

// 🔧 Mock HIBP-check
jest.mock("../checkHIBPPassword", () => ({
  checkHIBPPassword: jest.fn(async pw => pw === "leakedPassword"),
}));

// 🔧 Mock logger
jest.mock("../logger", () => ({
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

// 🔧 Mock zxcvbn
jest.mock("zxcvbn", () =>
  jest.fn(pw => ({
    score: [
      "strongpassword!",
      "leakedPassword",
      "subdomainsecret",
      "test@example.com-password",
      "test@EXAMPLE.com-password",
      "john_the_great",
      "hibpfailtest",
      "test-password",
      "john@crstudio.be",
      "john-doe-1984",
      "johndoe1984x",
    ].includes(pw)
      ? 3
      : 1,
  }))
);

describe("validatePassword()", () => {
  const strong = "strongpassword!"; // score 3 (OK)
  const weak = "abc123abc123"; // score 1 (fout)

  test("❌ Geen input", async () => {
    const result = await validatePassword("");
    expect(result).toBe("auth.passwordTooShort");
  });

  test("❌ Alleen spaties", async () => {
    const result = await validatePassword(" ".repeat(12));
    expect(result).toBe("auth.passwordOnlySpaces");
  });

  test("❌ Te kort", async () => {
    const result = await validatePassword("short");
    expect(result).toBe("auth.passwordTooShort");
  });

  test("❌ Te lang", async () => {
    const result = await validatePassword("a".repeat(65));
    expect(result).toBe("auth.passwordTooShort");
  });

  test("❌ Control characters", async () => {
    const result = await validatePassword("abc123ABC123" + String.fromCharCode(0x200b));
    expect(result).toBe("auth.passwordInvalidChars");
  });

  test("❌ Blocklist-match (case-insensitive)", async () => {
    const result = await validatePassword("PASSWORD1234");
    expect(result).toBe("auth.passwordTooWeak");
  });

  test("❌ Te zwak volgens zxcvbn", async () => {
    const result = await validatePassword(weak);
    expect(result).toBe("auth.passwordTooWeak");
  });

  test("❌ Leaked in HIBP", async () => {
    const result = await validatePassword("leakedPassword");
    expect(result).toBe("auth.passwordLeaked");
  });

  test("❌ Bevat persoonlijke info (subdomain)", async () => {
    const result = await validatePassword("subdomainsecret", {
      subdomain: "subdomain",
    });
    expect(result).toBe("auth.passwordIncludesPersonalInfo");
  });

  test("✅ Sterk wachtwoord — volledig geslaagd", async () => {
    const result = await validatePassword(strong, {
      email: "test@example.com",
      name: "John",
      subdomain: "crstudio",
    });
    expect(result).toBeNull();
  });

  test("🧪 Crasht niet bij rare inputs", async () => {
    const edgeCases = [null, undefined, 12345, {}, [], true];
    for (const input of edgeCases) {
      const result = await validatePassword(input);
      expect([
        "auth.passwordTooShort",
        "auth.passwordInvalidChars",
        "auth.passwordOnlySpaces",
        "auth.passwordValidationError",
      ]).toContain(result);
    }
  });

  test("❌ Bevat persoonlijke info (email)", async () => {
    const result = await validatePassword("test@example.com-password", {
      email: "test@example.com",
    });
    expect(result).toBe("auth.passwordIncludesPersonalInfo");
  });

  test("❌ Bevat persoonlijke info (name)", async () => {
    const result = await validatePassword("john_the_great", {
      name: "john",
    });
    expect(result).toBe("auth.passwordIncludesPersonalInfo");
  });

  test("❌ HIBP-check crasht", async () => {
    const { checkHIBPPassword } = require("../checkHIBPPassword");
    checkHIBPPassword.mockImplementationOnce(() => {
      throw new Error("Simulated HIBP failure");
    });
    const result = await validatePassword("hibpfailtest");
    expect(result).toBe("auth.passwordCheckFailed");
  });

  test("❌ zxcvbn laadt niet", async () => {
    jest.resetModules(); // reset cache
    jest.doMock("zxcvbn", () => {
      throw new Error("Simulated zxcvbn load failure");
    });

    const { validatePassword: freshValidate } = require("../validatePassword");
    const result = await freshValidate("zxcvbnfailtest");
    expect(result).toBe("auth.passwordCheckFailed");

    // herstel originele mock voor andere tests
    jest.dontMock("zxcvbn");
    jest.mock("zxcvbn", () =>
      jest.fn(pw => ({
        score: ["strongpassword!", "leakedPassword", "subdomainsecret"].includes(pw) ? 3 : 1,
      }))
    );
  });

  test("🔁 Zelfde wachtwoord met verschillende cases", async () => {
    const result1 = await validatePassword("Password123!");
    const result2 = await validatePassword("password123!");
    expect(result1).toBe(result2); // Beide zouden bv. tooWeak moeten geven
  });

  test("🌐 Ondersteunt Unicode-symbolen binnen limieten", async () => {
    const result = await validatePassword("🔥Passw0rd🔥🔥🔥");
    expect([null, "auth.passwordTooWeak", "auth.passwordInvalidChars"]).toContain(result);
  });

  test("🧪 Password bevat e-mailadres case-insensitief", async () => {
    const result = await validatePassword("test@EXAMPLE.com-password", {
      email: "test@example.com",
    });
    expect(result).toBe("auth.passwordIncludesPersonalInfo");
  });

  test('🧠 Herkent unicode-spaties als "alleen spaties"', async () => {
    const result = await validatePassword("\u00A0".repeat(12)); // non-breaking space
    expect(result).toBe("auth.passwordOnlySpaces");
  });

  test("📏 Acceptatie van exact MIN en MAX lengte", async () => {
    const minPassword = "a".repeat(12);
    const maxPassword = "a".repeat(64);
    const minResult = await validatePassword(minPassword);
    const maxResult = await validatePassword(maxPassword);
    expect(["auth.passwordTooWeak", null]).toContain(minResult);
    expect(["auth.passwordTooWeak", null]).toContain(maxResult);
  });

  test("🧬 Wachtwoord bevat alleen gebruikersdeel e-mailadres", async () => {
    const result = await validatePassword("test-password", {
      email: "test@example.com",
    });
    expect(result).toBe("auth.passwordIncludesPersonalInfo");
  });

  test("✅ Domain van e-mail in wachtwoord is géén probleem", async () => {
    const result = await validatePassword("example.com-is-cool", {
      email: "test@example.com",
    });
    expect(["auth.passwordTooWeak", null]).toContain(result); // géén personal info fout
  });

  test("❌ Bevat meerdere persoonlijke elementen tegelijk", async () => {
    const result = await validatePassword("john@crstudio.be", {
      name: "john",
      subdomain: "crstudio",
      email: "john@crstudio.be",
    });
    expect(result).toBe("auth.passwordIncludesPersonalInfo");
  });

  test("❌ zxcvbn crasht intern bij evaluatie", async () => {
    jest.resetModules();
    jest.doMock("zxcvbn", () => () => {
      throw new Error("Crash in zxcvbn");
    });

    const { validatePassword: freshValidate } = require("../validatePassword");
    const result = await freshValidate("zxcvbncrashpw");
    expect(result).toBe("auth.passwordCheckFailed");

    // herstel mock
    jest.dontMock("zxcvbn");
    jest.mock("zxcvbn", () =>
      jest.fn(pw => ({
        score: ["strongpassword!"].includes(pw) ? 3 : 1,
      }))
    );
  });

  test("❌ Bevat gepunctueerde naam als substring", async () => {
    const result = await validatePassword("johndoe1984x", {
      name: "john.doe",
    });
    expect(result).toBe("auth.passwordIncludesPersonalInfo");
  });
});
