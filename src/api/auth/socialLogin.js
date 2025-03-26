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
    const { provider, state, lang } = req.body;

    if (!provider || !["google", "apple"].includes(provider)) {
      return res.status(400).json({ message: "Invalid provider" });
    }

    const safeLang = lang?.length === 2 ? lang : "en";

    console.log(`🔗 OAuth gestart met ${provider}`);
    console.log(`🛡️ Ontvangen state: ${state}`);
    console.log(`🌐 Doelredirect met taal: ${safeLang}`);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${siteUrl}/${safeLang}/auth/callback?state=${state}`,
        state,
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
