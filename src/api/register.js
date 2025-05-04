// src/api/register.js :
import { createClient } from "@supabase/supabase-js";
import Redis from "ioredis";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";
import { validateTurnstile } from "../utils/validateTurnstile";
import { emailTemplate } from "../utils/emailTemplate";
import { log, warn, error } from "../utils/logger";

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

let redis;
try {
  redis = new Redis(process.env.REDIS_URL, { tls: {} });
  log("✅ Verbonden met Redis");
} catch (err) {
  error("❌ Redis-verbinding mislukt", { err });
}

redis?.on("error", (err) => error("❌ Redis fout", { err }));

const checkIfTempUserExists = async (email) => {
  const { data, error } = await supabase
    .from("temp_users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) throw new Error("DB_CHECK_FAILED");
  return !!data;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    warn("❌ Ongeldige HTTP-methode", { method: req.method });
    return res.status(405).json({ code: "METHOD_NOT_ALLOWED" });
  }

  const { email, turnstileToken, lang } = req.body;
  if (!email || !turnstileToken) {
    warn("⚠️ Ontbrekende velden bij registratie", { email, turnstileToken });
    return res.status(400).json({ code: "MISSING_FIELDS" });
  }

  const ip = req.headers["x-forwarded-for"] || req.ip;
  const redisKey = `register:${ip}`;
  const attempts = await redis.incr(redisKey);
  if (attempts > 5) {
    const waitTime = Math.pow(2, attempts - 5) * 10;
    warn("⏳ Te veel registratiepogingen", { ip, attempts, waitTime });
    return res.status(429).json({ code: "RATE_LIMIT", details: waitTime });
  }
  await redis.expire(redisKey, 60);

  const turnstileResult = await validateTurnstile(turnstileToken);
  if (!turnstileResult.success) {
    warn("🛑 Turnstile validatie mislukt", { email, result: turnstileResult });
    return res.status(403).json({ code: "TURNSTILE_FAILED" });
  }

  const kickboxRes = await fetch(
    `https://api.kickbox.com/v2/verify?email=${email}&apikey=${process.env.KICKBOX_API_KEY}`
  );
  if (!kickboxRes.ok) {
    const errorText = await kickboxRes.text();
    error("❌ Kickbox API gaf geen OK terug", { email, errorText });
    return res.status(500).json({ code: "KICKBOX_FAILED", details: errorText });
  }

  const kickboxData = await kickboxRes.json();
  if (kickboxData.result === "undeliverable" || kickboxData.disposable) {
    warn("📪 Ongeldig of tijdelijk e-mailadres gedetecteerd", { email, kickboxData });
    return res.status(400).json({ code: "EMAIL_INVALID" });
  }

  const { data: existsInAuthUsers, error: existsError } = await supabase.rpc("user_email_exists", { _email: email });
  if (existsError) {
    error("❌ user_email_exists RPC mislukt", { email, existsError });
    return res.status(500).json({ code: "AUTH_CHECK_FAILED" });
  }
  if (existsInAuthUsers === true) {
    warn("⚠️ Email bestaat al in auth.users", { email });
    return res.status(409).json({ code: "EMAIL_DUPLICATE" });
  }

  const existingTempUser = await checkIfTempUserExists(email);
  if (existingTempUser) {
    warn("⚠️ Email bestaat al in temp_users", { email });

    const { data: tempUser, error: fetchError } = await supabase
      .from("temp_users")
      .select("verification_token, created_at")
      .eq("email", email)
      .maybeSingle();

    if (fetchError || !tempUser) {
      warn("⚠️ Kan temp_user record niet ophalen", { email, fetchError });
      return res.status(409).json({ code: "TEMP_USER_LOOKUP_FAILED" });
    }

    const tokenAge = Date.now() - new Date(tempUser.created_at).getTime();
    const tokenValid = tokenAge < 1000 * 60 * 30;

    let verificationToken = tempUser.verification_token;

    if (!tokenValid) {
      verificationToken = crypto.randomBytes(32).toString("hex");
      const { error: updateError } = await supabase
        .from("temp_users")
        .update({
          verification_token: verificationToken,
          created_at: new Date().toISOString(),
        })
        .eq("email", email);

      if (updateError) {
        error("❌ Token update mislukt bij herregistratie", { email, updateError });
        return res.status(500).json({ code: "TOKEN_UPDATE_FAILED" });
      }

      log("🔁 Nieuw token gegenereerd bij herregistratie", { email, verificationToken });
    }

    let language = lang && lang.length === 2 ? lang : "en";
    let t;
    try {
      t = (await import(`../locales/${language}/translationemails.js`)).default;
    } catch {
      t = (await import(`../locales/en/translationemails.js`)).default;
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

    const emailResult = await sendEmail(
      email,
      t.verify_email.subject,
      `${t.verify_email.intro}\n${profileUrl}`,
      html
    );

    if (!emailResult.success) {
      error("❌ Email verzenden bij herregistratie faalde", { email });
      return res.status(500).json({ code: "EMAIL_SEND_FAILED_AGAIN" });
    }

    return res.status(200).json({ code: "EMAIL_SEND_AGAIN" });
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const { error: insertError } = await supabase.from("temp_users").insert([
    {
      email,
      verification_token: verificationToken,
      created_at: new Date().toISOString(),
    },
  ]);

  if (insertError) {
    error("❌ Insert in temp_users mislukt", { email, insertError });
    return res.status(500).json({ code: "INSERT_FAILED" });
  }

  log("✅ Gebruiker toegevoegd aan temp_users", { email, verificationToken });

  let language = lang && lang.length === 2 ? lang : "en";
  let t;
  try {
    t = (await import(`../locales/${language}/translationemails.js`)).default;
  } catch (err) {
    warn("🌍 Fallback naar Engelse e-mailvertaling", { requestedLang: lang, err });
    t = (await import(`../locales/en/translationemails.js`)).default;
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

  const emailResult = await sendEmail(
    email,
    t.verify_email.subject,
    `${t.verify_email.intro}\n${profileUrl}`,
    html
  );

  if (!emailResult.success) {
    error("❌ Verificatie-email kon niet verzonden worden", { email, emailResult });
    return res.status(500).json({ code: "EMAIL_SEND_FAILED" });
  }

  log("✅ Verificatie-email succesvol verzonden", { email });
  return res.status(200).json({ code: "EMAIL_SEND" });
}
