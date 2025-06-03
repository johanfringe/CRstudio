// __tests__/sentryInit.test.js :
import * as Sentry from "@sentry/react";
import * as SentryBrowser from "@sentry/browser";
import * as SentryReplay from "@sentry/replay";
import { initSentry } from "../sentryInit";
import { log, warn, error } from "../logger";

jest.mock("@sentry/react", () => ({ init: jest.fn() }));
jest.mock("@sentry/browser", () => ({ BrowserTracing: jest.fn() }));
jest.mock("@sentry/replay", () => ({ Replay: jest.fn() }));
jest.mock("../logger", () => ({
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe("initSentry", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
    process.env.GATSBY_SENTRY_DSN = "https://fake_dsn@sentry.io/123";
    process.env.NODE_ENV = "production";
    global.window = {}; // Simuleer browser-omgeving
  });

  afterEach(() => {
    process.env = OLD_ENV;
    delete global.window;
  });

  it("initialiseert Sentry in browser mode", () => {
    initSentry({ mode: "browser" });
    expect(Sentry.init).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(expect.stringContaining("browser-mode"));
  });

  it("voegt BrowserTracing en Replay integraties toe in browser mode", () => {
    const fakeTracing = {};
    const fakeReplay = {};
    SentryBrowser.BrowserTracing.mockImplementation(() => fakeTracing);
    SentryReplay.Replay.mockImplementation(() => fakeReplay);

    initSentry({ mode: "browser" });

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        integrations: [fakeTracing, fakeReplay],
      })
    );
  });

  it("initialiseert Sentry in ssr mode", () => {
    initSentry({ mode: "ssr" });
    expect(Sentry.init).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(expect.stringContaining("SSR-mode"));
  });

  it("initialiseert Sentry in build mode", () => {
    initSentry({ mode: "build" });
    expect(Sentry.init).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(expect.stringContaining("build-mode"));
  });

  it("logt exacte waarschuwing bij onbekende mode", () => {
    initSentry({ mode: "bliep" });
    expect(warn).toHaveBeenCalledWith("⚠️ Onbekende Sentry init mode: bliep");
  });

  it("logt waarschuwing bij ontbrekende DSN", () => {
    delete process.env.GATSBY_SENTRY_DSN;
    delete process.env.SENTRY_DSN;
    initSentry({ mode: "ssr" });
    expect(warn).toHaveBeenCalledWith("⚠️ Geen DSN gevonden. Sentry wordt niet geïnitialiseerd.");
    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it("logt waarschuwing bij browser mode zonder window", () => {
    delete global.window;
    initSentry({ mode: "browser" });
    expect(warn).toHaveBeenCalledWith(
      "🚫 initSentry(): 'browser' mode maar window is undefined. Init geannuleerd."
    );
    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it("logt fout als Sentry.init() een error gooit", () => {
    Sentry.init.mockImplementation(() => {
      throw new Error("boom");
    });
    initSentry({ mode: "ssr" });
    expect(error).toHaveBeenCalledWith(
      "❌ Fout tijdens initialisatie van Sentry",
      expect.objectContaining({ err: expect.any(Error), mode: "ssr" })
    );
  });

  it("gebruikt SENTRY_DSN als GATSBY_SENTRY_DSN ontbreekt", () => {
    delete process.env.GATSBY_SENTRY_DSN;
    process.env.SENTRY_DSN = "https://fallback_dsn@sentry.io/456";
    initSentry({ mode: "ssr" });
    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: "https://fallback_dsn@sentry.io/456",
      })
    );
  });

  it("gebruikt dev-config in browser mode als NODE_ENV=development", () => {
    process.env.NODE_ENV = "development";
    initSentry({ mode: "browser" });
    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        tracesSampleRate: 0.0,
        replaysSessionSampleRate: 0.0,
        replaysOnErrorSampleRate: 0.0,
      })
    );
  });

  it("gebruikt SENTRY_RELEASE env var indien aanwezig", () => {
    process.env.SENTRY_RELEASE = "v123";
    initSentry({ mode: "build" });
    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        release: "v123",
      })
    );
  });

  it("zet debug op true in development", () => {
    process.env.NODE_ENV = "development";
    initSentry({ mode: "build" });
    expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({ debug: true }));
  });
});
