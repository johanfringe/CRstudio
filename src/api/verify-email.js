// src/api/verify-email.js
import { createClient } from "@supabase/supabase-js";

console.log("🔑 Supabase URL:", process.env.GATSBY_SUPABASE_URL);
console.log("🔑 Supabase Service Role Key:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "✔️ Loaded" : "❌ Not Loaded");

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // ✅ Verbetering 1: Method-check header
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { token } = req.body;

    if (!token) {
      console.warn("⚠️ Geen token meegegeven.");
      return res.status(400).json({ success: false, code: "TOKEN_REQUIRED" });
    }

    console.log("🔍 Start verificatieproces voor token:", token);

    // 🚀 Aanroep van RPC-functie verify_user_token
    const { data, error } = await supabase.rpc("verify_user_token", { _token: token });

    console.log("↩️ Supabase RPC response – data:", data);
    console.log("↩️ Supabase RPC response – error:", error);

    if (error) {
      console.error("❌ RPC-call mislukt:", error.message);
      return res.status(500).json({
        success: false,
        code: "RPC_FAILED",
        details: error.message,
      });
    }

    if (data === null && error === null) {
      console.error("🚨 Geen data of foutmelding uit Supabase: mogelijk silent fail in SQL function");
      return res.status(500).json({
        success: false,
        code: "NO_RESPONSE_FROM_RPC",
        details: "De functie verify_user_token gaf geen data of foutmelding terug.",
      });
    }

    if (!data || typeof data !== "object" || !data.code) {
      console.error("⚠️ Ongeldige response van verify_user_token:", data);
      return res.status(500).json({
        success: false,
        code: "INVALID_RPC_RESPONSE",
        details: data,
      });
    }

    const { success, code, email, details } = data;

    switch (code) {
      case "EMAIL_VERIFIED":
        // ✅ Meer logging
        console.log(`✅ E-mail geverifieerd: ${email} om ${new Date().toISOString()}`);
        return res.status(200).json({ success: true, code, email });

      case "TOKEN_NOT_FOUND":
      case "TOKEN_EXPIRED":
      case "TOKEN_INVALID": // fallback case
        console.warn(`⚠️ Ongeldig/verlopen token (${code})`);
        return res.status(400).json({ success: false, code });

      case "DUPLICATE_EMAIL":
        console.warn("⚠️ E-mail bestaat al:", email);
        return res.status(409).json({ success: false, code });

      case "INTERNAL_ERROR":
        console.error("🧨 Interne fout in verify_user_token:", details);
        return res.status(500).json({ success: false, code, details });

      // ✅ Extra default fallback
      default:
        console.warn("⚠️ Onbekende foutcode uit RPC:", code);
        return res.status(500).json({
          success: false,
          code: "UNKNOWN_CODE",
          details: code,
        });
    }

  } catch (err) {
    console.error("🔥 Onverwachte fout tijdens verificatie:", err);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_EXCEPTION",
      details: err.message,
    });
  }
}
