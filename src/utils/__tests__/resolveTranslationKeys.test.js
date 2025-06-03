// __tests__/resolveTranslationKeys.test.js :
import { resolveTranslationKeys } from "../resolveTranslationKeys";

describe("resolveTranslationKeys()", () => {
  beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterAll(() => {
    console.warn.mockRestore();
  });

  test("1️⃣ Correcte keys bij geldige translationVariant", () => {
    const entry = {
      translationKey: "status.auth_no_artist",
      meta: { translationVariant: "registerConfirmed" },
    };

    const result = resolveTranslationKeys(entry);
    expect(result.headingKey).toBe("status.auth_no_artist.registerConfirmed.heading");
    expect(result.textKey).toBe("status.auth_no_artist.registerConfirmed.text");
    expect(result.useObjectTranslation).toBe(false);
  });

  test("2️⃣ Fallback naar .default bij ontbrekende variant", () => {
    const entry = {
      translationKey: "status.auth_with_artist",
      meta: {}, // geen translationVariant
    };

    const result = resolveTranslationKeys(entry);
    expect(result.headingKey).toBe("status.auth_with_artist.default.heading");
    expect(result.textKey).toBe("status.auth_with_artist.default.text");
  });

  test("3️⃣ Fallback bij ontbrekende translationKey", () => {
    const entry = {
      meta: { translationVariant: "welcomeBack" },
    };

    const result = resolveTranslationKeys(entry);
    expect(result.headingKey).toBe("shared.status_unknown_error.heading");
    expect(result.textKey).toBe("shared.status_unknown_error.text");
  });

  test("4️⃣ Fallback bij volledig ongeldig entry (null)", () => {
    const result = resolveTranslationKeys(null);
    expect(result.headingKey).toBe("shared.status_unknown_error.heading");
    expect(result.textKey).toBe("shared.status_unknown_error.text");
  });

  test("5️⃣ Correcte afleiding: user_not_found.default", () => {
    const entry = {
      translationKey: "status.user_not_found",
      meta: { translationVariant: "default" },
    };

    const result = resolveTranslationKeys(entry);
    expect(result.headingKey).toBe("status.user_not_found.default.heading");
    expect(result.textKey).toBe("status.user_not_found.default.text");
  });

  test("6️⃣ Correcte afleiding: new_user_expired.registerFlow", () => {
    const entry = {
      translationKey: "status.new_user_expired",
      meta: { translationVariant: "registerFlow" },
    };

    const result = resolveTranslationKeys(entry);
    expect(result.headingKey).toBe("status.new_user_expired.registerFlow.heading");
    expect(result.textKey).toBe("status.new_user_expired.registerFlow.text");
  });

  test("7️⃣ Ongeldig type translationVariant: number → fallback", () => {
    const entry = {
      translationKey: "status.auth_no_artist",
      meta: { translationVariant: 123 },
    };

    const result = resolveTranslationKeys(entry);
    expect(result.headingKey).toBe("status.auth_no_artist.default.heading");
    expect(result.textKey).toBe("status.auth_no_artist.default.text");
  });

  test("8️⃣ Ongeldig type translationVariant: array → fallback", () => {
    const entry = {
      translationKey: "status.auth_no_artist",
      meta: { translationVariant: ["registerConfirmed"] },
    };

    const result = resolveTranslationKeys(entry);
    expect(result.headingKey).toBe("status.auth_no_artist.default.heading");
    expect(result.textKey).toBe("status.auth_no_artist.default.text");
  });

  test("9️⃣ Ongeldig type translationVariant: object → fallback", () => {
    const entry = {
      translationKey: "status.auth_no_artist",
      meta: { translationVariant: { foo: "bar" } },
    };

    const result = resolveTranslationKeys(entry);
    expect(result.headingKey).toBe("status.auth_no_artist.default.heading");
    expect(result.textKey).toBe("status.auth_no_artist.default.text");
  });

  test("🔟 Lege meta → fallback naar .default", () => {
    const entry = {
      translationKey: "status.verified_no_session",
      meta: null,
    };

    const result = resolveTranslationKeys(entry);
    expect(result.headingKey).toBe("status.verified_no_session.default.heading");
    expect(result.textKey).toBe("status.verified_no_session.default.text");
  });

  test("1️⃣1️⃣ Undefined meta → fallback naar .default", () => {
    const entry = {
      translationKey: "status.verified_no_session",
      // meta undefined
    };

    const result = resolveTranslationKeys(entry);
    expect(result.headingKey).toBe("status.verified_no_session.default.heading");
    expect(result.textKey).toBe("status.verified_no_session.default.text");
  });

  test("1️⃣2️⃣ Meta zonder translationVariant → fallback naar .default", () => {
    const entry = {
      translationKey: "status.verified_no_session",
      meta: {},
    };

    const result = resolveTranslationKeys(entry);
    expect(result.headingKey).toBe("status.verified_no_session.default.heading");
    expect(result.textKey).toBe("status.verified_no_session.default.text");
  });

  test("1️⃣3️⃣ Meta als boolean (true) → fallback naar .default", () => {
    const entry = {
      translationKey: "status.auth_no_artist",
      meta: true,
    };

    const result = resolveTranslationKeys(entry);
    expect(result.headingKey).toBe("status.auth_no_artist.default.heading");
    expect(result.textKey).toBe("status.auth_no_artist.default.text");
  });

  test("1️⃣4️⃣ Meta als number → fallback naar .default", () => {
    const entry = {
      translationKey: "status.auth_no_artist",
      meta: 42,
    };

    const result = resolveTranslationKeys(entry);
    expect(result.headingKey).toBe("status.auth_no_artist.default.heading");
    expect(result.textKey).toBe("status.auth_no_artist.default.text");
  });

  test("1️⃣5️⃣ Console.warn wordt aangeroepen bij fallback", () => {
    const entry = {
      translationKey: "status.auth_no_artist",
      meta: {},
    };

    resolveTranslationKeys(entry);
    expect(console.warn).toHaveBeenCalled();
  });
});
