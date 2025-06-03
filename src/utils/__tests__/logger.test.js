// __tests__/logger.test.js :
describe("logger error zonder Sentry-module", () => {
  it("roept geen captureMessage aan als Sentry undefined is", async () => {
    jest.resetModules();
    // Simuleer dat @sentry/react undefined is
    jest.mock("@sentry/react", () => undefined);
    const { error } = await import("../logger");
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    error("fout zonder sentry", { context: true });
    expect(spy).toHaveBeenCalledWith("fout zonder sentry", { context: true });
    spy.mockRestore();
  });
});

import * as logger from "../logger";
import * as Sentry from "@sentry/react";

// Mock de Sentry-module
jest.mock("@sentry/react", () => ({
  captureMessage: jest.fn(),
}));

// Globale console-mocks
console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

describe("logger utils", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("log", () => {
    it("logt alleen in non-production omgevingen", () => {
      process.env.NODE_ENV = "development";
      logger.log("test log");
      expect(console.log).toHaveBeenCalledWith("test log");

      process.env.NODE_ENV = "production";
      logger.log("test log prod");
      expect(console.log).not.toHaveBeenCalledWith("test log prod");
    });
  });

  describe("warn", () => {
    it("waarschuwt alleen in non-production", () => {
      process.env.NODE_ENV = "development";
      logger.warn("test warn");
      expect(console.warn).toHaveBeenCalledWith("test warn");

      process.env.NODE_ENV = "production";
      logger.warn("test warn prod");
      expect(console.warn).not.toHaveBeenCalledWith("test warn prod");
    });
  });

  describe("error", () => {
    it("logt altijd naar console.error en stuurt naar Sentry indien actief", () => {
      logger.error("Er ging iets mis", { code: 500 });
      expect(console.error).toHaveBeenCalledWith("Er ging iets mis", { code: 500 });
      expect(Sentry.captureMessage).toHaveBeenCalledWith("Er ging iets mis", {
        extra: { code: 500 },
        level: "error",
      });
    });
  });

  describe("captureApiError", () => {
    it("logt als error bij no response", () => {
      logger.captureApiError("/api/test", null, { errorCode: "SOME_ERROR" });
      expect(console.error).toHaveBeenCalled();
    });

    it("logt als waarschuwing bij bekende warnCode", () => {
      process.env.NODE_ENV = "development";
      logger.captureApiError(
        "/api/test",
        { status: 400, statusText: "Bad Request" },
        { errorCode: "EMAIL_DUPLICATE" }
      );
      expect(console.warn).toHaveBeenCalled();
    });

    it("logt als success in dev bij bekende successCode", () => {
      process.env.NODE_ENV = "development";
      logger.captureApiError(
        "/api/test",
        { status: 200, statusText: "OK" },
        { errorCode: "REGISTER_OK" }
      );
      expect(console.log).toHaveBeenCalled();
    });

    it("logt als error bij onbekende code met status >= 400", () => {
      logger.captureApiError(
        "/api/test",
        { status: 500, statusText: "Server Error" },
        { errorCode: "UNEXPECTED" }
      );
      expect(console.error).toHaveBeenCalled();
    });

    it("logt als error bij forceCapture", () => {
      logger.captureApiError(
        "/api/test",
        { status: 200, statusText: "OK" },
        { forceCapture: true }
      );
      expect(console.error).toHaveBeenCalled();
    });
  });

  it("logt als error bij onbekende code met status < 400", () => {
    logger.captureApiError(
      "/api/test",
      { status: 200, statusText: "OK" },
      { errorCode: "WEIRD_UNKNOWN" }
    );
    expect(console.error).toHaveBeenCalled();
  });

  it("logt als error bij ontbrekende errorCode", () => {
    logger.captureApiError("/api/test", { status: 500, statusText: "Server Error" }, {});
    expect(console.error).toHaveBeenCalled();
  });

  it("geeft 'unknown' als zowel lang als navigator.language ontbreken", () => {
    Object.defineProperty(global, "window", {
      value: {
        document: { documentElement: {} },
        navigator: {},
      },
      configurable: true,
    });
    expect(logger.getLang()).toBe("unknown");
  });

  it("stuurt niet naar Sentry bij successCode", () => {
    process.env.NODE_ENV = "development";
    logger.captureApiError("/api/test", { status: 200 }, { errorCode: "REGISTER_OK" });
    expect(Sentry.captureMessage).not.toHaveBeenCalled();
  });

  it("stuurt altijd extra context naar Sentry", () => {
    logger.error("Er ging iets mis", { detail: "specifiek" });
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        extra: { detail: "specifiek" },
      })
    );
  });

  describe("throwTestError", () => {
    it("gooit een fout", () => {
      expect(() => logger.throwTestError()).toThrow(
        "🚨 Dit is een manuele testfout via throwTestError()"
      );
    });
  });

  describe("getLang", () => {
    it("geeft taal van document.documentElement.lang", () => {
      Object.defineProperty(global, "window", {
        value: {
          document: {
            documentElement: { lang: "nl" },
          },
          navigator: {
            language: "fr-BE",
          },
        },
        configurable: true,
      });
      expect(logger.getLang()).toBe("nl");
    });

    it("valt terug op navigator.language", () => {
      Object.defineProperty(global, "window", {
        value: {
          document: {
            documentElement: { lang: "" }, // leeg, dus fallback naar navigator
          },
          navigator: {
            language: "fr-BE",
          },
        },
        configurable: true,
      });
      expect(logger.getLang()).toBe("fr-BE"); // ✅ nu correct
    });

    it("geeft 'unknown' op server", () => {
      const originalWindow = global.window;
      delete global.window;
      expect(logger.getLang()).toBe("unknown");
      global.window = originalWindow;
    });

    it("roept geen captureMessage aan als Sentry niet actief is", () => {
      const originalSentry = Sentry.captureMessage;
      // eslint-disable-next-line no-import-assign
      delete Sentry.captureMessage;
      logger.error("foutmelding", { info: "test" });
      expect(console.error).toHaveBeenCalled();
      // eslint-disable-next-line no-import-assign
      Sentry.captureMessage = originalSentry;
    });

    it("logt geen successCode in productieomgeving", () => {
      process.env.NODE_ENV = "production";
      logger.captureApiError("/api/test", { status: 200 }, { errorCode: "REGISTER_OK" });
      expect(console.log).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe("getSubdomain", () => {
    it("haalt subdomein op van hostname", () => {
      Object.defineProperty(global, "window", {
        value: { location: { hostname: "jeanmilo.crstudio.online" } },
        configurable: true,
      });
      expect(logger.getSubdomain()).toBe("jeanmilo");
    });

    it("geeft 'main' terug als geen subdomein", () => {
      Object.defineProperty(global, "window", {
        value: { location: { hostname: "crstudio.online" } },
        configurable: true,
      });
      expect(logger.getSubdomain()).toBe("main");
    });

    it("geeft 'server' op server-side", () => {
      const originalWindow = global.window;
      delete global.window;
      expect(logger.getSubdomain()).toBe("server");
      global.window = originalWindow;
    });
  });
});
