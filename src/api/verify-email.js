// src/api/verify-email.js :
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

console.log("🔑 Supabase URL:", process.env.GATSBY_SUPABASE_URL);
console.log("🔑 Supabase Service Role Key:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "✔️ Loaded" : "❌ Not Loaded");

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, code: "METHOD_NOT_ALLOWED" });
  }

  const { token } = req.body;

  if (!token) {
    console.warn("⚠️ Geen token meegegeven.");
    return res.status(400).json({ success: false, code: "TOKEN_REQUIRED" });
  }

  console.log("🔍 Start verificatieproces voor token:", token);

  try {
    const { data, error } = await supabase.rpc("verify_user_token", { _token: token });

    console.log("↩️ Supabase RPC response – data:", data);
    console.log("↩️ Supabase RPC response – error:", error);

    if (error) {
      console.error("❌ RPC-call mislukt:", error.message);
      return res.status(500).json({ success: false, code: "RPC_FAILED", details: error.message });
    }

    if (!data || typeof data !== "object" || !data.code) {
      console.error("⚠️ Ongeldige response van verify_user_token:", data);
      return res.status(500).json({ success: false, code: "INVALID_RPC_RESPONSE", details: data });
    }

    const { code, email, details } = data;

    switch (code) {
      case "EMAIL_VERIFIED":
        console.log(`✅ E-mail geverifieerd: ${email}`);
        const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          password: crypto.randomBytes(12).toString("base64"),
          email_confirm: true,
        });

        if (createError) {
          const isDuplicate = createError.message?.toLowerCase().includes("duplicate");
          if (isDuplicate) {
            return res.status(409).json({ success: false, code: "DUPLICATE_EMAIL" });
          }

          return res.status(500).json({
            success: false,
            code: "CREATE_USER_FAILED",
            details: createError.message,
          });
        }

        console.log("✅ Supabase user aangemaakt:", createdUser);
        return res.status(200).json({ success: true, code, email });

      case "TOKEN_NOT_FOUND":
      case "TOKEN_EXPIRED":
      case "TOKEN_INVALID":
        return res.status(400).json({ success: false, code });

      case "DUPLICATE_EMAIL":
        return res.status(409).json({ success: false, code });

      case "INTERNAL_ERROR":
        return res.status(500).json({ success: false, code, details });

      default:
        return res.status(500).json({
          success: false,
          code: "UNKNOWN_CODE",
          details: code,
        });
    }
  } catch (err) {
    console.error("🔥 Onverwachte fout:", err);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_EXCEPTION",
      details: err.message,
    });
  }
}