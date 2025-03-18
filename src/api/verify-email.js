// src/api/verify-email.js :
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    console.log("🔍 Verificatie gestart met token:", token);

    // 1️⃣ **Token ophalen en checken op geldigheid**
    const { data: user, error } = await supabase
      .from("temp_users")
      .select("*")
      .eq("verification_token", token)
      .single();

    if (!user || error) {
      console.warn("❌ Ongeldig of verlopen token!");
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    // 2️⃣ **Token verlopen? Controleer of 30 minuten verstreken zijn**
    const tokenCreatedAt = new Date(user.created_at);
    const now = new Date();
    if ((now - tokenCreatedAt) / (1000 * 60) > 30) {
      console.warn("❌ Verificatielink verlopen voor e-mail:", user.email);
      return res.status(400).json({ message: "Verification link expired. Please request a new one." });
    }

    // 3️⃣ **Gebruiker als geverifieerd markeren**
    const { error: updateError } = await supabase
      .from("users")
      .update({ is_verified: true })
      .eq("email", user.email);

    if (updateError) {
      console.error("❌ Fout bij updaten van verificatiestatus:", updateError.message);
      return res.status(500).json({ message: "Could not update verification status" });
    }

    console.log("✅ E-mail geverifieerd:", user.email);

    // 4️⃣ **Verwijder tijdelijke gebruiker uit `temp_users`**
    await supabase.from("temp_users").delete().eq("email", user.email);

    return res.status(200).json({ message: "Email successfully verified!" });
  } catch (error) {
    console.error("❌ Fout in verificatieproces:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
