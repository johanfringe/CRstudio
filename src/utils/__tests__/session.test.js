// __tests__/session.test.js :
import { waitForSession } from "../session";
import { supabase } from "../supabaseClient";
import * as logger from "../logger";

// Mock loggers
jest.mock("../logger", () => ({
  log: jest.fn(),
  warn: jest.fn(),
}));

// Mock supabase
jest.mock("../supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

describe("waitForSession", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern"); // belangrijk: moderne fake timers activeren
    jest.clearAllMocks();
  });

  it("returns session immediately if available", async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: "abc" } },
      error: null,
    });

    const sessionPromise = waitForSession(3, 100, "test-id");
    jest.runAllTimers(); // versnelt wachttijd
    const session = await sessionPromise;

    expect(session).toEqual({ user: "abc" });
    expect(logger.log).toHaveBeenCalledWith("✅ Sessie gevonden", { logId: "test-id", attempt: 1 });
  });

  it("stops and warns on error", async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: null,
      error: new Error("Network fail"),
    });

    const session = await waitForSession(3, 100, "test-id");

    expect(session).toBeNull();
    expect(logger.warn).toHaveBeenCalledWith(
      "❗ getSession() fout tijdens retry",
      expect.objectContaining({ attempt: 1 })
    );
  });

  it("retries and eventually returns null if no session or error", async () => {
    supabase.auth.getSession.mockResolvedValue({ data: {}, error: null });

    const sessionPromise = waitForSession(3, 100);

    await jest.runAllTimersAsync(); // wacht op alle timers
    const session = await sessionPromise;

    expect(session).toBeNull();
    expect(logger.warn).toHaveBeenCalledWith("❗ Geen sessie gevonden", { retries: 3 });
    expect(supabase.auth.getSession).toHaveBeenCalledTimes(3);
  });

  it("returns null immediately if retries is 0", async () => {
    const session = await waitForSession(0, 100);
    expect(session).toBeNull();
    expect(logger.warn).toHaveBeenCalledWith("❗ Geen sessie gevonden", { retries: 0 });
  });

  it("resolves if session komt pas na meerdere retries", async () => {
    supabase.auth.getSession
      .mockResolvedValueOnce({ data: {}, error: null }) // retry 1
      .mockResolvedValueOnce({ data: {}, error: null }) // retry 2
      .mockResolvedValueOnce({ data: { session: { user: "abc" } }, error: null }); // retry 3

    const sessionPromise = waitForSession(5, 100, "test-delayed");
    await jest.runAllTimersAsync();
    const session = await sessionPromise;

    expect(session).toEqual({ user: "abc" });
    expect(logger.log).toHaveBeenCalledWith("✅ Sessie gevonden", {
      logId: "test-delayed",
      attempt: 3,
    });
  });

  it("wacht correct tussen retries", async () => {
    supabase.auth.getSession.mockResolvedValue({ data: {}, error: null });
    const spy = jest.spyOn(global, "setTimeout");

    const sessionPromise = waitForSession(2, 500);
    await jest.runAllTimersAsync();
    await sessionPromise;

    expect(spy).toHaveBeenCalledWith(expect.any(Function), 500);
  });
});
