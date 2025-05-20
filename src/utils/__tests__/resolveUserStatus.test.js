// __tests__/resolveUserStatus.test.js :

import { resolveUserStatus } from "../src/utils/resolveUserStatus";
import { STATUS } from "../src/utils/statusCodes";

// Huidige tijd als referentie
const NOW = Date.now();
const MIN = 60 * 1000;
const ISO = msAgo => new Date(NOW - msAgo).toISOString();

describe("resolveUserStatus()", () => {
  test("1️⃣ AUTH_WITH_ARTIST — volledig ingelogd", () => {
    const result = resolveUserStatus({
      user: { id: "u1" },
      session: { id: "s1" },
      artist: { id: "a1" },
      token: null,
      originPage: "resolve-status",
    });
    expect(result.statusCode).toBe(STATUS.AUTH_WITH_ARTIST);
    expect(result.meta.translationVariant).toBe("default");
  });

  test("2️⃣ AUTH_NO_ARTIST — registerConfirmed", () => {
    const result = resolveUserStatus({
      user: { id: "u2", created_at: ISO(5 * MIN) },
      session: { id: "s2" },
      artist: null,
      token: { isTempUser: true, isExpired: false },
      originPage: "register",
    });
    expect(result.statusCode).toBe(STATUS.AUTH_NO_ARTIST);
    expect(result.meta.translationVariant).toBe("registerConfirmed");
  });

  test("2️⃣ AUTH_NO_ARTIST — welcomeBack (oud account)", () => {
    const result = resolveUserStatus({
      user: { id: "u3", created_at: ISO(20 * MIN) },
      session: { id: "s3" },
      artist: null,
      token: null,
      originPage: "profile",
    });
    expect(result.statusCode).toBe(STATUS.AUTH_NO_ARTIST);
    expect(result.meta.translationVariant).toBe("welcomeBack");
  });

  test("2️⃣ AUTH_NO_ARTIST — fallback zonder created_at", () => {
    const result = resolveUserStatus({
      user: { id: "u9" }, // geen created_at
      session: { id: "s9" },
      artist: null,
      token: null,
      originPage: "profile",
    });
    expect(result.statusCode).toBe(STATUS.AUTH_NO_ARTIST);
    expect(result.meta.translationVariant).toBe("welcomeBack");
  });

  test("3️⃣ VERIFIED_NO_SESSION — login_Email", () => {
    const result = resolveUserStatus({
      user: { id: "u4", provider: "email" },
      session: null,
      artist: null,
      token: null,
      originPage: "verify-email",
    });
    expect(result.statusCode).toBe(STATUS.VERIFIED_NO_SESSION);
    expect(result.meta.translationVariant).toBe("login_Email");
  });

  test("3️⃣ VERIFIED_NO_SESSION — login_Google", () => {
    const result = resolveUserStatus({
      user: { id: "u5", provider: "google" },
      session: null,
      artist: null,
      token: null,
      originPage: "verify-email",
    });
    expect(result.statusCode).toBe(STATUS.VERIFIED_NO_SESSION);
    expect(result.meta.translationVariant).toBe("login_Google");
  });

  test("3️⃣ VERIFIED_NO_SESSION — fallback bij ontbrekende provider", () => {
    const result = resolveUserStatus({
      user: { id: "u5" },
      session: null,
      artist: null,
      token: null,
      originPage: "verify-email",
    });
    expect(result.statusCode).toBe(STATUS.VERIFIED_NO_SESSION);
    expect(result.meta.translationVariant).toBe("login_Email"); // fallback
  });

  test("4️⃣ NEW_USER_PENDING — email_send (jong token)", () => {
    const result = resolveUserStatus({
      user: null,
      session: null,
      artist: null,
      token: {
        isTempUser: true,
        isExpired: false,
        createdAt: ISO(3 * MIN),
      },
      originPage: "register",
    });
    expect(result.statusCode).toBe(STATUS.NEW_USER_PENDING);
    expect(result.meta.translationVariant).toBe("email_send");
  });

  test("4️⃣ NEW_USER_PENDING — verifying (oud token)", () => {
    const result = resolveUserStatus({
      user: null,
      session: null,
      artist: null,
      token: {
        isTempUser: true,
        isExpired: false,
        createdAt: ISO(10 * MIN),
      },
      originPage: "register",
    });
    expect(result.statusCode).toBe(STATUS.NEW_USER_PENDING);
    expect(result.meta.translationVariant).toBe("verifying");
  });

  test("4️⃣ NEW_USER_PENDING — fallback bij ontbrekende createdAt", () => {
    const result = resolveUserStatus({
      user: null,
      session: null,
      artist: null,
      token: {
        isTempUser: true,
        isExpired: false,
        createdAt: null,
      },
      originPage: "register",
    });
    expect(result.statusCode).toBe(STATUS.NEW_USER_PENDING);
    expect(result.meta.translationVariant).toBe("verifying");
  });

  test("4️⃣ NEW_USER_PENDING — future timestamp (negatief diff)", () => {
    const result = resolveUserStatus({
      user: null,
      session: null,
      artist: null,
      token: {
        isTempUser: true,
        isExpired: false,
        createdAt: new Date(Date.now() + 10 * MIN).toISOString(),
      },
      originPage: "register",
    });
    expect(result.statusCode).toBe(STATUS.NEW_USER_PENDING);
    // Mag fallback zijn zolang timestamp negatief is
    expect(result.meta.translationVariant).toBe("email_send");
  });

  test("5️⃣ NEW_USER_EXPIRED — registerFlow", () => {
    const result = resolveUserStatus({
      user: null,
      session: null,
      artist: null,
      token: {
        isTempUser: true,
        isExpired: true,
      },
      originPage: "register",
    });
    expect(result.statusCode).toBe(STATUS.NEW_USER_EXPIRED);
    expect(result.meta.translationVariant).toBe("registerFlow");
  });

  test("5️⃣ NEW_USER_EXPIRED — profileFlow", () => {
    const result = resolveUserStatus({
      user: null,
      session: null,
      artist: null,
      token: {
        isTempUser: true,
        isExpired: true,
      },
      originPage: "profile",
    });
    expect(result.statusCode).toBe(STATUS.NEW_USER_EXPIRED);
    expect(result.meta.translationVariant).toBe("profileFlow");
  });

  test("6️⃣ USER_NOT_FOUND", () => {
    const result = resolveUserStatus({
      user: null,
      session: null,
      artist: null,
      token: {
        notFound: true,
      },
      originPage: "verify-email",
    });
    expect(result.statusCode).toBe(STATUS.USER_NOT_FOUND);
    expect(result.meta.translationVariant).toBe("default");
  });

  test("7️⃣ UNKNOWN_ERROR — fallback zonder input", () => {
    const result = resolveUserStatus({
      user: null,
      session: null,
      artist: null,
      token: null,
      originPage: null,
    });
    expect(result.statusCode).toBe(STATUS.UNKNOWN_ERROR);
    expect(result.meta.translationVariant).toBe("default");
  });
});
