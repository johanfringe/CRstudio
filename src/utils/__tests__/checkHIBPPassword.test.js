// __tests__/checkHIBPPassword.test.js:
import { checkHIBPPassword, __clearCache } from "../checkHIBPPassword";
import sha1 from "js-sha1";

jest.mock("../logger", () => ({
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  captureApiError: jest.fn(),
}));

global.fetch = jest.fn();

describe("checkHIBPPassword()", () => {
  const password = "123456";
  const hashed = sha1(password).toUpperCase();
  const prefix = hashed.slice(0, 5);
  const suffix = hashed.slice(5);

  beforeEach(() => {
    __clearCache(); // reset sessie-cache
    jest.clearAllMocks(); // reset logs/mocks
  });

  test("1️⃣ Geeft 'true' bij gelekt wachtwoord (suffix komt overeen)", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => `${suffix}:5\nABCDEF:1\nXYZ:2`,
    });

    const result = await checkHIBPPassword(password);
    expect(result).toBe(true);
  });

  test("2️⃣ Geeft 'false' bij niet-gelekt wachtwoord (suffix niet gevonden)", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => `ABCDEF:1\nZZZZZ:2`,
    });

    const result = await checkHIBPPassword(password);
    expect(result).toBe(false);
  });

  test("3️⃣ Cache wordt gebruikt bij herhaalde aanroep", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => `${suffix}:3`,
    });

    const result1 = await checkHIBPPassword(password);
    const result2 = await checkHIBPPassword(password);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  test("4️⃣ Ongeldig wachtwoord → waarschuwen + false", async () => {
    const { warn } = require("../logger");

    const result = await checkHIBPPassword(null);
    expect(result).toBe(false);
    expect(warn).toHaveBeenCalledWith("⚠️ Ongeldig wachtwoord meegegeven aan checkHIBPPassword", {
      password: null,
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  test("5️⃣ API geeft geen OK → warning, captureApiError, return false", async () => {
    const { warn, captureApiError } = require("../logger");

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      text: async () => "",
    });

    const result = await checkHIBPPassword(password);
    expect(result).toBe(false);
    expect(warn).toHaveBeenCalledWith("⚠️ HIBP API gaf geen OK-status", {
      status: 503,
      prefix,
    });
    expect(captureApiError).toHaveBeenCalledWith("HIBP", expect.any(Object), {
      prefix,
    });
  });

  test("6️⃣ Fout tijdens fetch → error logging, return false", async () => {
    const { error } = require("../logger");

    fetch.mockRejectedValueOnce(new Error("Netwerkfout"));

    const result = await checkHIBPPassword(password);
    expect(result).toBe(false);
    expect(error).toHaveBeenCalledWith(
      "❌ Fout bij ophalen van HIBP-data",
      expect.objectContaining({
        err: expect.any(Error),
        prefix,
        context: "checkHIBPPassword",
      })
    );
  });

  test("7️⃣ Complex wachtwoord met speciale tekens", async () => {
    const pw = "P@ssw0rd!123";
    const hashed = sha1(pw).toUpperCase();
    const suffix = hashed.slice(5);

    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => `${suffix}:1\nABCDEF:3`,
    });

    const result = await checkHIBPPassword(pw);
    expect(result).toBe(true);
  });

  test("8️⃣ Logging bij cache-hit", async () => {
    const { log } = require("../logger");

    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => `${suffix}:1`,
    });

    await checkHIBPPassword(password); // eerste → cache vullen
    await checkHIBPPassword(password); // tweede → cache-hit

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith("🔁 HIBP-cache gebruikt voor wachtwoord", { prefix });
  });

  test("9️⃣ Lege/ongeldige regels in response", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => `\n${suffix}:1\n   \nBADFORMAT\n`,
    });

    const result = await checkHIBPPassword(password);
    expect(result).toBe(true);
  });
});
