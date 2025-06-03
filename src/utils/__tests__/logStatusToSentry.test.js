// src/utils/logStatusToSentry.test.js :
jest.mock("@sentry/browser", () => ({
  captureMessage: jest.fn(),
  captureException: jest.fn(),
}));

import * as Sentry from "@sentry/browser";
import { logStatusToSentry } from "../logStatusToSentry";

describe("logStatusToSentry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("doet niets als logToSentry false is", () => {
    logStatusToSentry({ logToSentry: false });
    expect(Sentry.captureMessage).not.toHaveBeenCalled();
  });

  it("logt naar Sentry bij expliciete logToSentry: true", () => {
    const input = {
      statusCode: 401,
      translationKey: "auth.session.expired",
      logToSentry: true,
      originContext: "login",
      meta: {},
    };
    logStatusToSentry(input);
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      "[Status] 401 (default)",
      expect.objectContaining({
        level: "warning",
        tags: expect.objectContaining({ statusCode: 401 }),
        extra: expect.objectContaining({ translationKey: "auth.session.expired" }),
      })
    );
  });

  it("logt met fallback=true als error", () => {
    const input = {
      statusCode: 403,
      isFallback: true,
      originContext: "register",
      meta: {},
    };
    logStatusToSentry(input);
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      "[Status] 403 (default)",
      expect.objectContaining({ level: "error" })
    );
  });

  it("gebruikt translationVariant uit meta indien beschikbaar", () => {
    const input = {
      statusCode: 404,
      logToSentry: true,
      originContext: "profile",
      meta: {
        translationVariant: "fr",
      },
    };
    logStatusToSentry(input);
    expect(Sentry.captureMessage).toHaveBeenCalledWith("[Status] 404 (fr)", expect.any(Object));
  });

  it("vangt errors op en logt naar captureException", () => {
    const brokenInput = {
      logToSentry: true,
      meta: null, // `meta = {}` destructurering faalt
    };
    logStatusToSentry(brokenInput);
    expect(Sentry.captureException).toHaveBeenCalled();
  });

  it("logt naar console in niet-productieomgeving", () => {
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    process.env.NODE_ENV = "development"; // mock omgeving

    logStatusToSentry({
      statusCode: 400,
      logToSentry: true,
      meta: {},
    });

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("[CRstudio] Status log to Sentry:"),
      expect.objectContaining({ statusCode: 400 })
    );

    spy.mockRestore();
  });

  it("vangt fout op en logt met captureException", () => {
    logStatusToSentry(null); // forceer een fout
    expect(Sentry.captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        extra: expect.objectContaining({
          location: "logStatusToSentry",
          input: null,
        }),
      })
    );
  });

  it("gebruikt 'default' variant als translationVariant ontbreekt", () => {
    logStatusToSentry({
      statusCode: 418,
      logToSentry: true,
      meta: {},
    });

    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      "[Status] 418 (default)",
      expect.any(Object)
    );
  });

  it("gebruikt 'unknown' als originContext ontbreekt", () => {
    logStatusToSentry({
      statusCode: 402,
      logToSentry: true,
      meta: {},
    });

    const callArgs = Sentry.captureMessage.mock.calls[0][1];
    expect(callArgs.tags.originContext).toBe("unknown");
  });

  it("logt naar Sentry als meta.logToSentry: true", () => {
    logStatusToSentry({
      statusCode: 200,
      meta: {
        logToSentry: true,
      },
    });

    expect(Sentry.captureMessage).toHaveBeenCalled();
  });
});
