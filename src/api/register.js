// src/api/register.js :
import { createClient } from "@supabase/supabase-js";
import Redis from "ioredis";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";

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

    // 2️⃣ **Cloudflare Turnstile-verificatie**
    const turnstileRes = await fetch(`https://challenges.cloudflare.com/turnstile/v0/siteverify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET, response: turnstileToken }),
    });
    const turnstileData = await turnstileRes.json();
    console.log("✅ Cloudflare Turnstile API-respons:", JSON.stringify(turnstileData, null, 2));

    if (!turnstileData.success) {
      console.warn("❌ Turnstile verificatie mislukt!", turnstileData);
      return res.status(403).json({ message: "Turnstile: Security check failed" });
    }

    console.log("✅ Turnstile verificatie geslaagd!");

    // 3️⃣ **Kickbox Disposable E-mail Check**
    let kickboxData;
    try {
      const kickboxRes = await fetch(`https://api.kickbox.com/v2/verify?email=${email}&apikey=${process.env.KICKBOX_API_KEY}`);
      console.log("📡 Kickbox API-aanroep:", kickboxRes.status, kickboxRes.statusText);

      if (!kickboxRes.ok) {
        const errorText = await kickboxRes.text();
        console.error("❌ Kickbox API-fout:", errorText);
        return res.status(500).json({ message: "Kickbox: Email validation service failed" });
      }

      kickboxData = await kickboxRes.json();
      console.log("📬 Kickbox validatieresultaat voor", email, ":", kickboxData);
    } catch (err) {
      console.error("❌ Kickbox API-fout:", err);
      return res.status(500).json({ message: "Kickbox: Email validation service failed" });
    }

    if (kickboxData.result !== "deliverable" || kickboxData.disposable) {
      console.log("❌ Kickbox: Disposable of ongeldige e-mail gedetecteerd:", email);
      return res.status(400).json({ message: "Kickbox: Invalid or disposable emails are not allowed" });
    }

    // 4️⃣ **Controleren of e-mail al bestaat in de database**
    const existingUser = await checkIfUserExists(email);

    if (existingUser) {
      console.log("⚠️ Supabase: E-mail bestaat al in temp_users:", email);
      return res.status(400).json({ message: "Supabase: Email already registered. Check your inbox!" });
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
    const emailResult = await sendEmail(
      email,
      "Verify your email",
      `Click the link to verify your email: ${process.env.GATSBY_SITE_URL}/complete-profile?token=${verificationToken}`,
      `<p>Click the link to verify your email (via register):</p>
       <a href="${process.env.GATSBY_SITE_URL}/complete-profile?token=${verificationToken}">
       Verify Email</a>`
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