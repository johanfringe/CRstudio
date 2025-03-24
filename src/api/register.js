// src/api/register.js :
import { createClient } from "@supabase/supabase-js";
import Redis from "ioredis";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";
import { validateTurnstile } from "../utils/validateTurnstile.js";

//console.log("🔑 Supabase URL:", process.env.GATSBY_SUPABASE_URL);
//console.log("🔑 Supabase Service Role Key:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "✔️ Loaded" : "❌ Not Loaded");
//console.log("🔑 TURNSTILE_SECRET:", process.env.TURNSTILE_SECRET ? "✔️ Loaded" : "❌ Not Loaded");
//console.log("🔑 GATSBY_TURNSTILE_SITE_KEY:", process.env.GATSBY_TURNSTILE_SITE_KEY);
//console.log("🔑 Kickbox API Key:", process.env.KICKBOX_API_KEY);
//console.log("🔑 Redis URL:", process.env.REDIS_URL);
//console.log("🔍 Verbinding maken met Redis...");

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
console.log("🔎 Supabase connectie status:", supabase);

let redis;
try {
  redis = new Redis(process.env.REDIS_URL, { tls: {} });
  console.log("✅ Redis verbonden!");
} catch (err) {
  console.error("❌ Redis-verbinding mislukt:", err);
}

redis.on("connect", () => console.log("✅ Verbonden met Redis!"));
redis.on("error", (err) => console.error("❌ Redis-verbinding mislukt:", err));

const checkIfUserExists = async (email) => {
  try {
    console.log(`🔍 Supabase: Controle op bestaand e-mailaccount voor ${email}`);

    const { data, error } = await supabase
      .from("temp_users")
      .select("id") // Haal alleen ID op voor minimale data-overdracht
      .eq("email", email)
      .maybeSingle(); // 🔧 Voorkomt 406-fouten als er geen gebruiker is

    if (error) {
      console.error("❌ Supabase Query Error:", error.message);
      throw new Error("Database query failed");
    }

    console.log(`🔎 Supabase: E-mail ${email} ${data ? "bestaat al" : "bestaat niet"}`);
    return !!data;
  } catch (error) {
    console.error("❌ Supabase API-fout:", error.message);
    throw error; // Gooit de fout door zodat de caller deze correct kan verwerken,
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Redis: Method Not Allowed" });
  }

  try {
    const { email, turnstileToken } = req.body;
    console.log(`📩 Ontvangen e-mail voor verificatie: ${email}`);
    if (!email || !turnstileToken) {
      console.warn("⚠️ Turnstile: Ontbrekende velden:", { email, turnstileToken });
      return res.status(400).json({ message: "Turnstile: Missing fields" });
    }
    console.log("📩 Turnstile: Ontvangen aanvraag:", req.body);

    if (!email || !turnstileToken) {
      console.warn("⚠️ Turnstile: Ontbrekende velden:", { email, turnstileToken });
      return res.status(400).json({ message: "Turnstile: Missing fields" });
    }

    console.log("📩 Turnstile: Registratie gestart voor e-mail:", email);

    // 1️⃣ **Rate Limiting met exponentiële backoff**
    const redisKey = `register:${req.headers["x-forwarded-for"] || req.ip}`;
    const attempts = await redis.incr(redisKey);
    console.log(`🔄 Redis: Poging #${attempts} voor IP: ${redisKey}`);

    if (attempts > 5) {
      const waitTime = Math.pow(2, attempts - 5) * 10;
      console.log(`⏳ Redis: Te veel pogingen! Gebruiker geblokkeerd voor ${waitTime} seconden.`);
      return res.status(429).json({ message: `Redis: Too many attempts. Try again in ${waitTime} seconds.` });
    }

    await redis.expire(redisKey, 60);

    console.log(`🔄 Redis: Poging #${attempts} voor IP:`, redisKey);

    // 2️⃣ **Cloudflare Turnstile-verificatie - Gebruik de helperfunctie**
    const turnstileResult = await validateTurnstile(turnstileToken);
    if (!turnstileResult.success) {
        return res.status(403).json({ message: turnstileResult.message });
    }

    console.log("✅ Turnstile verificatie geslaagd!");
    
    console.log(`🚀 Kickbox wordt aangeroepen voor: ${email}`);
    // 3️⃣ **Kickbox Disposable E-mail Check**
    let kickboxData;
    try {
      const kickboxRes = await fetch(`https://api.kickbox.com/v2/verify?email=${email}&apikey=${process.env.KICKBOX_API_KEY}`);
      console.log("📡 Kickbox API-aanroep:", kickboxRes.status, kickboxRes.statusText);

      if (!kickboxRes.ok) {
        const errorText = await kickboxRes.text();
        console.error("❌ Kickbox API-fout:", errorText);
        throw new Error(`🚨 Kickbox request failed! Status: ${kickboxRes.status} - ${kickboxRes.statusText} - Error: ${errorText}`);
      }

      kickboxData = await kickboxRes.json();
      console.log("📬 Kickbox validatieresultaat voor", email, ":", JSON.stringify(kickboxData, null, 2));
      console.log("🔎 Kickbox result:", kickboxData.result);
      console.log("🔎 Kickbox reason:", kickboxData.reason);
      console.log("🔎 Kickbox disposable:", kickboxData.disposable);
      console.log("🔎 Kickbox accept_all:", kickboxData.accept_all);
      console.log("🔎 Kickbox free:", kickboxData.free);
      console.log("🔎 Kickbox sendex score:", kickboxData.sendex);

    } catch (err) {
      console.error("❌ Kickbox API-fout:", err);
      return res.status(500).json({ message: "Kickbox: Email validation service failed" });
    }
    console.log(`✅ Kickbox API-aanroep voltooid voor: ${email}`);

    if (kickboxData.result === "undeliverable" || kickboxData.disposable) {
      console.log("❌ Kickbox: Ongeldig of disposable e-mail gedetecteerd:", email);
      return res.status(400).json({ message: "Kickbox: Invalid or disposable emails are not allowed" });
    }
    
    if (kickboxData.result === "risky" && kickboxData.reason === "low_deliverability") {
      console.warn("⚠️ Kickbox waarschuwing: E-mail heeft lage afleverkans, maar wordt geaccepteerd:", email);
    }
    

    // 4️⃣ **Controleren of e-mail al bestaat in de database**
    const existingUser = await checkIfUserExists(email);

    if (existingUser) {
      console.log("⚠️ Supabase: E-mail bestaat al in temp_users:", email);
      return res.status(400).json({ message: "Supabase: Email already registered." });
    }

    // 5️⃣ **Unieke verificatietoken genereren**
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 6️⃣ **E-mail opslaan in `temp_users`**
    console.log("📥 Supabase: E-mail wordt opgeslagen in temp_users:", email);
    const { data, error } = await supabase.from("temp_users").insert([
      { email, verification_token: verificationToken, created_at: new Date().toISOString() }
    ]);

    console.log("📥 Supabase insert response:", { data, error });

    if (error) {
      console.error("❌ Supabase Insert Fout:", error.message);
      return res.status(500).json({ message: "Supabase: Database error: Could not insert user." });
    }

    console.log("✅ Supabase: E-mail succesvol opgeslagen in `temp_users`:", email);

    // 📧 **Nieuwe verificatiemail wordt direct verstuurd**
    console.log("📧 Versturen van verificatiemail...");
    let lang = "en"; // fallback
    try {
      const ref = req.headers.referer || "";
      const parts = new URL(ref).pathname.split("/").filter(Boolean); // ['nl', 'register']
      if (parts[0] && parts[0].length === 2) {
        lang = parts[0];
      }
      console.log("🌐 Afgeleide taalcode uit URL:", lang);
    } catch (err) {
      console.warn("⚠️ Fout bij afleiden van taal uit referer:", err.message);
    }

    const profileUrl = `${process.env.SITE_URL}/${lang}/profile?token=${verificationToken}`;
    console.log("📧 Verificatielink gegenereerd:", profileUrl);

    const emailResult = await sendEmail(
      email,
      "Verify your email",
      `Click the link to verify your email: ${profileUrl}`,
      `<p>Click the link to verify your email:</p>
      <a href="${profileUrl}">Verify Email</a>`
    );

    if (!emailResult.success) {
      console.error("❌ Fout bij verzenden verificatiemail:", emailResult.error);
      return res.status(500).json({ message: "Could not send verification email. Try again later." });
    }

    console.log("✅ Verificatiemail verzonden naar:", email);
    return res.status(200).json({ message: "Check your email for verification!" });

  } catch (error) {
    console.error("❌ Supabase: Fout bij registratie:", error);
    return res.status(500).json({ message: "Supabase: Internal server error" });
  }
}