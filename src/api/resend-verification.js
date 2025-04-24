// src/api/resend-verification.js :
import { createClient } from "@supabase/supabase-js";
import Redis from "ioredis";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";
import { emailTemplate } from "../utils/emailTemplate";
import { log, warn, error } from "../utils/logger";

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ Redis connectie + foutafhandeling
let redis;
try {
  redis = new Redis(process.env.REDIS_URL, { tls: {} });
} catch (err) {
  error("❌ Redis-verbinding init mislukt", { err });
}
redis?.on("error", (err) => {
  error("❌ Redis-verbinding fout", { err });
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    warn("⛔ Verkeerde HTTP methode", { method: req.method });
    return res.status(405).json({ code: "METHOD_NOT_ALLOWED" });
  }

  const { email, lang } = req.body;

  if (!email || !email.includes("@")) {
    warn("❌ Ongeldig of ontbrekend e-mailadres in body", { body: req.body });
    return res.status(400).json({ code: "EMAIL_INVALID" });
  }

  if (!redis) {
    error("🔌 Redis is niet beschikbaar bij resend-verification", { context: "resend-verification", ip: req.ip, });
    return res.status(503).json({ code: "REDIS_UNAVAILABLE" });
  }

  try {
    const redisKey = `resend:${req.headers["x-forwarded-for"] || req.ip}:${email}`;
    const didSet = await redis.set(redisKey, 1, "PX", 300000, "NX");

    if (!didSet) {
      warn("⚠️ Rate limit actief", { redisKey });
      return res.status(429).json({ code: "RATE_LIMIT" });
    }

    const { data: tempUser, error: fetchError } = await supabase
      .from("temp_users")
      .select("verification_token, created_at")
      .eq("email", email)
      .maybeSingle();

    if (fetchError) {
      error("❌ Database fout bij ophalen temp_user", { fetchError });
      return res.status(500).json({ code: "FETCH_FAILED" });
    }

    if (!tempUser) {
      warn("🔍 Geen temp_user gevonden", { email });
      return res.status(404).json({ code: "USER_NOT_FOUND" });
    }

    const tokenAge = Date.now() - new Date(tempUser.created_at).getTime();
    const tokenValid = tokenAge < 1000 * 60 * 30; // 30 minuten

    let verificationToken = tempUser.verification_token;

    if (!tokenValid) {
      verificationToken = crypto.randomBytes(32).toString("hex");

      const { error: updateError } = await supabase
        .from("temp_users")
        .update({ verification_token: verificationToken, created_at: new Date().toISOString() })
        .eq("email", email);

      if (updateError) {
        error("❌ Token update mislukt", { email, updateError });
        return res.status(500).json({ code: "TOKEN_UPDATE_FAILED" });
      }

      log("🔁 Nieuw token gegenereerd", { email, verificationToken });
    }

    // ✅ Vertaling ophalen
    const language = lang && lang.length === 2 ? lang : "en";
    let t;

    try {
      t = (await import(`../locales/${language}/translationemails.js`)).default;
    } catch (err) {
        warn("🌍 Fallback naar Engelse e-mailvertaling", { requestedLang: lang, fallback: "en", err });
      t = (await import("../locales/en/translationemails.js")).default;
    }

    const profileUrl = `${process.env.SITE_URL}/${language}/profile?token=${verificationToken}`;

    const html = emailTemplate({
      logoSrc: `${process.env.SITE_URL}/images/CRlogo.jpg`,
      logoAlt: t.verify_email.logo_alt,
      title: t.verify_email.title,
      intro: t.verify_email.intro,
      ctaUrl: profileUrl,
      ctaLabel: t.verify_email.cta,
      footer: t.verify_email.footer,
    });

    try {
      const emailResult = await sendEmail(
        email,
        t.verify_email.subject,
        `${t.verify_email.intro}\n${profileUrl}`,
        html
      );

      if (!emailResult.success) throw new Error("E-mail verzenden mislukt");

      log("✅ Verificatie-e-mail opnieuw verzonden", { email });
      return res.status(200).json({ code: "EMAIL_SEND_AGAIN" });
    } catch (err) {
      warn("⚠️ Eerste poging e-mailverzending faalde, probeer opnieuw", { email, err });

      try {
        const retry = await sendEmail(
          email,
          t.verify_email.subject,
          `${t.verify_email.intro}\n${profileUrl}`,
          html
        );

        if (!retry.success) throw new Error("Tweede poging e-mailverzending gefaald");

        log("✅ Verificatie-e-mail verzonden bij tweede poging", { email });
        return res.status(200).json({ code: "EMAIL_SEND_AGAIN" });
      } catch (err) {
        error("❌ Tweede poging e-mailverzending faalde", { email, err });
        return res.status(500).json({ code: "EMAIL_SEND_FAILED_AGAIN" });
      }
    }
  } catch (err) {
    error("❌ Onverwachte fout tijdens resend-verification", { err });
    return res.status(500).json({ code: "INTERNAL_EXCEPTION", details: err.message });
  }
}
