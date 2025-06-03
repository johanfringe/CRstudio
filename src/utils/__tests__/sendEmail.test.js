// __tests__/sendEmail.test.js :
import { sendEmail } from "../sendEmail";
import fetch from "node-fetch";
import { TextEncoder, TextDecoder } from "util";

// ✅ Fix voor node-fetch/whatwg-url dependency in testomgeving
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock("node-fetch", () => jest.fn());

// Mock logger-functies om side-effects te voorkomen
jest.mock("../logger", () => ({
  log: jest.fn(),
  error: jest.fn(),
  captureApiError: jest.fn(),
}));

const { Response } = jest.requireActual("node-fetch");

describe("sendEmail", () => {
  const to = "test@example.com";
  const subject = "Testonderwerp";
  const textBody = "Hallo wereld";
  const htmlBody = "<p>Hallo HTML</p>";

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.POSTMARK_API_KEY = "dummy-postmark-token";
  });

  it("verstuurt succesvol een e-mail", async () => {
    fetch.mockResolvedValue(new Response(null, { status: 200 }));

    const result = await sendEmail(to, subject, textBody, htmlBody);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.postmarkapp.com/email",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "X-Postmark-Server-Token": "dummy-postmark-token",
        }),
        body: JSON.stringify({
          From: "info@crstudio.online",
          To: to,
          Subject: subject,
          TextBody: textBody,
          HtmlBody: htmlBody,
        }),
      })
    );

    expect(result).toEqual({ success: true });

    const { log } = require("../logger");
    expect(log).toHaveBeenCalledWith("📩 Verzenden van e-mail naar", { to, subject });
    expect(log).toHaveBeenCalledWith("✅ E-mail succesvol verzonden", { to, subject });
  });

  it("verstuurt e-mail zonder htmlBody indien niet opgegeven", async () => {
    fetch.mockResolvedValue(new Response(null, { status: 200 }));

    const result = await sendEmail(to, subject, textBody);

    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.HtmlBody).toBe("");

    expect(result).toEqual({ success: true });
  });

  it("geeft een fout terug bij HTTP-fout (niet-ok response)", async () => {
    process.env.POSTMARK_API_KEY = "dummy-postmark-token";
    const mockResponse = {
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue("Internal Server Error"),
    };
    fetch.mockResolvedValue(mockResponse);

    const result = await sendEmail(to, subject, textBody, htmlBody);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Internal Server Error");

    const { captureApiError } = require("../logger");
    expect(captureApiError).toHaveBeenCalledWith(
      "/email (Postmark)",
      expect.any(Object),
      expect.objectContaining({
        to,
        subject,
        errorCode: "EMAIL_SEND_FAILED",
      })
    );
  });

  it("geeft een fout terug bij fetch-exception", async () => {
    fetch.mockRejectedValue(new Error("Netwerkprobleem"));

    const result = await sendEmail(to, subject, textBody, htmlBody);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Netwerkprobleem");

    const { error } = require("../logger");
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining("Fout bij verzenden"),
      expect.objectContaining({ to, subject, err: expect.any(Error) })
    );
  });

  it("geeft een fout terug als POSTMARK_API_KEY ontbreekt", async () => {
    delete process.env.POSTMARK_API_KEY;

    const result = await sendEmail(to, subject, textBody, htmlBody);

    expect(result.success).toBe(false);
    expect(result.error).toBe("API sleutel ontbreekt");
  });
});
