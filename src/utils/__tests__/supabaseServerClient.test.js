// __tests__/supabaseServerClient.test.js
import { supabaseServerClient } from "../supabaseServerClient";

// ✅ Gedeeltelijke mock voor cookie-manipulatie, alleen nodig voor set/remove tests
jest.mock("@supabase/auth-helpers-remix", () => ({
  createServerClient: jest.fn((_url, _key, opts) => ({
    cookies: opts.cookies, // eigen implementatie behouden voor tests
  })),
}));

describe("supabaseServerClient", () => {
  const envBackup = { ...process.env };

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://project.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
  });

  afterEach(() => {
    process.env = { ...envBackup };
    jest.clearAllMocks();
  });

  const createMockReqRes = (cookie = "") => {
    const headers = new Headers();
    if (cookie) headers.set("cookie", cookie);
    const res = {
      headers: new Headers(),
    };
    res.headers.append = jest.fn(); // monkey patch append
    return {
      req: { headers },
      res,
    };
  };

  it("throws if env vars are missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(() => {
      supabaseServerClient(new Request("https://example.com"), new Response());
    }).toThrow("Supabase environment variables not defined");
  });

  it("warns if no cookie header is present", () => {
    console.warn = jest.fn();
    const req = new Request("https://example.com");
    const res = new Response();

    supabaseServerClient(req, res);

    expect(console.warn).toHaveBeenCalledWith(
      "[supabaseServerClient] ⚠️ Geen cookie-header gedetecteerd"
    );
  });

  it("logs access token status when not in production", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const req = new Request("https://example.com", {
      headers: { cookie: "sb-access-token=abc.def.ghi" },
    });
    const res = new Response();

    process.env.NODE_ENV = "development";
    supabaseServerClient(req, res);

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("✅ sb-access-token aanwezig"));
  });

  it("extracts and decodes cookies correctly", () => {
    const cookie = "sb-access-token=abc%20def; another=xyz";
    const { req, res } = createMockReqRes(cookie);

    const client = supabaseServerClient(req, res);
    const decoded = client.cookies.get("sb-access-token");
    expect(decoded).toBe("abc def");
  });

  it("sets and removes cookies using res.headers.append", () => {
    const { req, res } = createMockReqRes();
    const client = supabaseServerClient(req, res);

    client.cookies.set("test-cookie", "value", { maxAge: 3600 });
    client.cookies.remove("test-cookie");

    expect(res.headers.append).toHaveBeenCalledWith(
      "Set-Cookie",
      expect.stringContaining("test-cookie=value")
    );
    expect(res.headers.append).toHaveBeenCalledWith(
      "Set-Cookie",
      expect.stringContaining("test-cookie=;")
    );
  });
});
