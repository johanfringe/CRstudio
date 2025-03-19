//src/api/resendVerificationEmail.js
import { createClient } from "@supabase/supabase-js";
import Redis from "ioredis";
import crypto from "crypto";

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const redis = new Redis(process.env.REDIS_URL, { tls: {} });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    console.log("🔄 Opnieuw verzenden van verificatiemail voor:", email);

    // 🛑 **Rate limiting met Redis**
    const redisKey = `resendVerificationEmail:${email}`;
    const attempts = await redis.incr(redisKey);
    if (attempts > 3) {
      console.warn("⏳ Te veel verificatie-aanvragen voor:", email);
      return res.status(429).json({ message: "Too many verification requests. Try again later." });
    }
    await redis.expire(redisKey, 300); // 5 minuten limiet

    // 🔑 **Genereer een nieuw verificatietoken**
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // ✅ **Update de database met het nieuwe token**
    const { error } = await supabase
      .from("temp_users")
      .update({ verification_token: verificationToken })
      .eq("email", email);

    if (error) {
      console.error("❌ Database-update fout:", error.message);
      return res.status(500).json({ message: "Database error. Try again later." });
    }

    console.log("✅ Nieuw verificatietoken gegenereerd:", verificationToken);

    // 📧 **Verificatiemail opnieuw verzenden via Postmark**
    const emailResult = await sendEmail(
      email,
      "Resend: Verify your email",
      `Click the link to verify your email: ${process.env.GATSBY_SITE_URL}/complete-profile?token=${verificationToken}`,
      `<p>Click the link to verify your email (via resend):</p>
       <a href="${process.env.GATSBY_SITE_URL}/complete-profile?token=${verificationToken}">
       Verify Email</a>`
    );

    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send verification email. Try again later." });
    }

    console.log("✅ Verificatiemail opnieuw verzonden naar:", email);
    return res.status(200).json({ message: "Verification email resent!" });

  } catch (error) {
    console.error("❌ Fout bij het opnieuw verzenden van verificatiemail:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
