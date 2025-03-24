// src/api/verify-email.js :
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

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
      return res.status(400).json({ success: false, code: "TOKEN_REQUIRED" });
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
      return res.status(400).json({ success: false, code: "TOKEN_INVALID" });
    }

    console.log("🔎 Token ontvangen voor verificatie:", token);
    console.log("📅 created_at (Supabase):", user.created_at);
    console.log("📅 created_at getTime:", new Date(user.created_at).getTime());
    console.log("📅 Date.now():", Date.now());
    console.log("⏳ Verschil in minuten:", (Date.now() - new Date(user.created_at).getTime()) / 60000);

    // 2️⃣ **Token verlopen? Controleer of 30 minuten verstreken zijn**
    const tokenCreatedAt = new Date(user.created_at).getTime();
    const now = Date.now();
    const diffMinutes = (now - tokenCreatedAt) / 60000;

    console.log("🕒 Token timestamp (UTC):", new Date(tokenCreatedAt).toISOString());
    console.log("🕒 Now (UTC):", new Date(now).toISOString());
    console.log("🕓 Verschil in minuten:", diffMinutes);

    if (diffMinutes > 30) {
      console.warn("❌ Verificatielink verlopen voor e-mail:", user.email);
      return res.status(400).json({ success: false, code: "TOKEN_EXPIRED" });
    }
    // 3️⃣ **Voeg gebruiker toe aan `users`-tabel**
    const { error: insertError } = await supabase
      .from("users")
      .insert([{
        id: crypto.randomUUID(),
        email: user.email,
        confirmed_at: new Date().toISOString(),
      }]);

    if (insertError) {
      console.error("❌ Fout bij toevoegen aan 'users':", JSON.stringify(insertError, null, 2));
      return res.status(500).json({ success: false, code: "INSERT_FAILED", details: insertError.message });
    }

    console.log("✅ Gebruiker toegevoegd aan users:", user.email);

    // 4️⃣ **Verwijder tijdelijke gebruiker uit `temp_users`**
    console.log("🧹 Verwijder gebruiker uit temp_users:", user.email);

    const { data: deleted, error: deleteError } = await supabase
      .from("temp_users")
      .delete()
      .eq("email", user.email)
      .select(); // toont de verwijderde rij (debug)

    if (deleteError) {
      console.error("❌ Gebruiker niet verwijderen uit temp_users:", deleteError.message);
    } else {
      console.log("🗑️ Gebruiker succesvol verwijderd uit temp_users:", deleted);
    }

    return res.status(200).json({
      success: true,
      code: "EMAIL_VERIFIED",
      email: user.email
    });

  } catch (error) {
    console.error("❌ Fout in verificatieproces:", error);
    return res.status(500).json({ success: false, code: "INTERNAL_ERROR" });
  }
}