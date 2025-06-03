// __tests__/turnstile.test.js :
/**
 * @jest-environment jsdom
 */

import { loadTurnstile } from "../turnstile";

const mockLog = jest.fn();
const mockError = jest.fn();

jest.mock("../logger", () => ({
  log: (...args) => mockLog(...args),
  error: (...args) => mockError(...args),
}));

describe("loadTurnstile", () => {
  let originalEnv;
  let appendChildSpy;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv, GATSBY_TURNSTILE_SITE_KEY: "test-key" };

    document.body.innerHTML = ""; // reset DOM
    appendChildSpy = jest.spyOn(document.body, "appendChild");

    global.window.turnstile = {
      render: jest.fn(),
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  test("logt een error als siteKey ontbreekt", () => {
    delete process.env.GATSBY_TURNSTILE_SITE_KEY;

    loadTurnstile(jest.fn());

    expect(mockError).toHaveBeenCalledWith(
      "🚨 ERROR: Turnstile site key is undefined! Check .env file.",
      expect.objectContaining({ envKey: "GATSBY_TURNSTILE_SITE_KEY" })
    );
  });

  test("voegt script toe aan document.body met juiste attributen", () => {
    loadTurnstile(jest.fn());

    expect(appendChildSpy).toHaveBeenCalledTimes(1);
    const script = appendChildSpy.mock.calls[0][0];

    expect(script.src).toMatch("https://challenges.cloudflare.com/turnstile/v0/api.js");
    expect(script.async).toBe(true);
    expect(script.defer).toBe(true);
  });

  test("roept window.turnstile.render aan bij onload", () => {
    const callback = jest.fn();

    loadTurnstile(callback);

    const script = appendChildSpy.mock.calls[0][0];
    script.onload(); // Simuleer laden

    expect(global.window.turnstile.render).toHaveBeenCalledWith("#turnstile-container", {
      sitekey: "test-key",
      callback,
    });

    expect(mockLog).toHaveBeenCalledWith("✅ Turnstile script geladen en gerenderd");
  });

  test("vangt fouten op tijdens render()", () => {
    const callback = jest.fn();
    global.window.turnstile.render.mockImplementation(() => {
      throw new Error("Renderfout");
    });

    loadTurnstile(callback);

    const script = appendChildSpy.mock.calls[0][0];
    script.onload();

    expect(mockError).toHaveBeenCalledWith(
      "❌ Fout bij uitvoeren van turnstile.render()",
      expect.objectContaining({ err: expect.any(Error) })
    );
  });

  test("vangt fouten op bij script.onerror", () => {
    loadTurnstile(jest.fn());

    const script = appendChildSpy.mock.calls[0][0];
    script.onerror?.({ type: "error" });

    expect(mockError).toHaveBeenCalledWith(
      "❌ Fout bij het laden van Turnstile-script vanaf CDN",
      expect.objectContaining({ event: "error", context: "script.onerror" })
    );
  });
});
