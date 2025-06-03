// /src/utils/supabaseServerClient.js :
import { createServerClient } from "@supabase/auth-helpers-remix";

/**
 * @param {Request} req - Native Fetch API Request (Gatsby Function SSR)
 * @param {Response} res - Response object, mag Headers bevatten
 * @returns {SupabaseClient}
 */
export function supabaseServerClient(req, res) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("[supabaseServerClient] ❌ Supabase env vars ontbreken.");
    throw new Error("Supabase environment variables not defined");
  }

  const cookieHeader = req.headers.get("cookie") || "";

  if (!cookieHeader) {
    console.warn("[supabaseServerClient] ⚠️ Geen cookie-header gedetecteerd");
  }
  const sbAccessTokenPresent = /sb-access-token=/.test(cookieHeader);

  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[supabaseServerClient] Cookies ontvangen: ${
        sbAccessTokenPresent ? "✅ sb-access-token aanwezig" : "⚠️ Geen sb-access-token gevonden"
      }`
    );
  }

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    request: req,
    response: res,
    cookies: {
      get(name) {
        const match = cookieHeader.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
        return match ? decodeURIComponent(match[2]) : undefined;
      },
      set(name, value, options) {
        const cookie = `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; ${
          options?.maxAge ? `Max-Age=${options.maxAge};` : ""
        }`;
        res.headers.append("Set-Cookie", cookie);
      },
      remove(name) {
        const cookie = `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
        res.headers.append("Set-Cookie", cookie);
      },
    },
  });
}
