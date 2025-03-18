// src/api/auth/sociallogin.js :
import { createClient } from "@supabase/supabase-js";

const siteUrl = process.env.SITE_URL || "http://localhost:8000";

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL,
  process.env.GATSBY_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { provider, state } = req.body;

    if (!provider || !["google", "apple"].includes(provider)) {
      return res.status(400).json({ message: "Invalid provider" });
    }

    console.log(`🔗 OAuth gestart met ${provider}`);
    console.log(`🛡️ Ontvangen state: ${state}`);

    // ✅ OAuth Flow starten met correcte redirect inclusief ontvangen state
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${siteUrl}/auth/callback?state=${state}`, // ✅ Correcte redirectTo
        state, // ✅ Voeg state toe
      }
    });

    if (error) {
      console.error("❌ OAuth fout:", error.message);
      return res.status(500).json({ message: "OAuth login failed" });
    }

    console.log("✅ OAuth succesvol gestart:", data);
    return res.status(200).json({ url: data.url });

  } catch (error) {
    console.error("❌ Algemene fout bij OAuth login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
