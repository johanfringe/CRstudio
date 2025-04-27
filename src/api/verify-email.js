// src/api/verify-email.js :
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { log, warn, error, captureApiError } from "../utils/logger";

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    warn("❌ Ongeldige HTTP-methode bij verify-email", { method: req.method });
    return res.status(405).json({ code: "METHOD_NOT_ALLOWED" });
  }

  const { token } = req.body;

  if (!token) {
    warn("⚠️ Geen token ontvangen in body");
    return res.status(400).json({ code: "TOKEN_REQUIRED" });
  }

  try {
    const { data, error: rpcError } = await supabase.rpc("verify_user_token", { _token: token });

    if (rpcError) {
      error("❌ Supabase RPC 'verify_user_token' faalt", { rpcError });
      return res.status(500).json({ code: "RPC_FAILED", details: rpcError.message });
    }

    if (!data || typeof data !== "object" || !data.code) {
      error("⚠️ Ongeldig antwoord van RPC-functie", { data });
      return res.status(500).json({ code: "RPC_RESPONSE_INVALID", details: data });
    }

    const { code, email, details } = data;
    log("🔍 Verificatie status ontvangen", { code, email });

    switch (code) {
      case "EMAIL_VERIFIED": {
        const randomPassword = crypto.randomBytes(12).toString("base64");
        log("📧 Email geverifieerd, gebruiker wordt aangemaakt", { email });

        const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          password: randomPassword,
          email_confirm: true,
        });

        if (createError) {
          const isDuplicate = createError.message?.toLowerCase().includes("duplicate");
          if (isDuplicate) {
            warn("⚠️ E-mailadres bestaat al in auth.users", { email });
            return res.status(409).json({ code: "EMAIL_DUPLICATE" });
          }
          error("❌ createUser() faalde", { createError });
          return res.status(500).json({ code: "USER_CREATION_FAILED", details: createError.message });
        }

        log("✅ Gebruiker succesvol aangemaakt", {
          id: createdUser?.user?.id,
          email,
        });        
        return res.status(200).json({ code: "EMAIL_VERIFIED", email });
      }

      case "TOKEN_NOT_FOUND":
      case "TOKEN_EXPIRED":
      case "TOKEN_INVALID":
        warn("⚠️ Ongeldige of verlopen token", { code, token });
         return res.status(400).json({ code });

      case "INVALID_USER_RECORD":
        error("‼️ Ongeldig gebruikersrecord : email ontbreekt", { token });
        return res.status(400).json({ code });
      
         case "EMAIL_DUPLICATE":
        warn("⚠️ Email bestaat al in auth.users", { email });
        return res.status(409).json({ code });

      case "INTERNAL_ERROR":
        error("❌ Interne fout in verify_user_token functie", { details });
        return res.status(500).json({ code, details });

      default:
        error("❓ Onbekende code vanuit verify_user_token", { code });
        captureApiError("verify_user_token", null, { unexpectedCode: code });
        return res.status(500).json({ code });
    }
  } catch (err) {
    error("🔥 Onverwachte fout in verify-email handler", { err });
    return res.status(500).json({ code: "INTERNAL_EXCEPTION", details: err.message });
  }
}
