// src/pages/auth/callback.js :
import React, { useEffect } from "react";
import { graphql } from "gatsby";
import { navigate } from "gatsby";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL,
  process.env.GATSBY_SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: true
    }
  }
);

const AuthCallback = () => {
  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log("🔄 Verwerken van OAuth callback...");
      console.log("🌍 Huidige URL:", window.location.href);
  
      try {
        // 🛠 Haal de OAuth-code en state op uit de URL
        const urlParams = new URLSearchParams(window.location.search);
        console.log("🔍 URL Parameters:", [...urlParams.entries()]);
        const code = urlParams.get("code");
        const receivedState = urlParams.get("state");
  
        console.log("🛠 OAuth-code ontvangen:", code);
        console.log("🛡️ Ontvangen state:", receivedState);

        // 🔎 Extra debug om fallback te controleren
        console.log("🔍 window.location.search:", window.location.search);
        console.log("🔍 window.location.hash:", window.location.hash);

        // ⛔️ Fallbackcontrole: is Supabase toch nog in Implicit Flow?
        if (!code && window.location.hash.includes("access_token")) {
          console.error("⚠️ Supabase gebruikte Implicit Flow i.p.v. PKCE.");
          alert("OAuth login faalde: Supabase viel terug op oude flow.");
          navigate("/register");
          return;
        }
  
        // ✅ Controleer of de ontvangen state overeenkomt met de oorspronkelijke
        const storedState = sessionStorage.getItem("oauth_state");
  
        if (!code || !receivedState || receivedState !== storedState) {
          console.error("❌ OAuth state mismatch / Geen OAuth-code ontvangen.");
          alert("OAuth fout: Ontbrekende code / Ongeldige state. Probeer opnieuw.");
          navigate("/register");
          return;
        }
  
        // 🚀 Verstuur code naar Supabase voor sessie-uitwisseling
        console.log("📡 Versturen code naar Supabase...");
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  
        if (error) {
          console.error("❌ Supabase OAuth fout:", error.message);
          alert(`Supabase OAuth fout: ${error.message}`);
          return;
        }
  
        console.log("✅ OAuth login geslaagd! Sessie data:", data);
  
        // ✅ Verwijder de state na succesvolle login
        sessionStorage.removeItem("oauth_state");
  
        // ✅ Detecteer de taal uit de URL en stuur gebruiker door
        const currentLang = window.location.pathname.split("/")[1] || "en";
        console.log(`🌍 Gebruiker wordt doorgestuurd naar: /${currentLang}/profile`);
        navigate(`/${currentLang}/profile`);
      } catch (err) {
        console.error("❌ Algemene fout:", err.message);
        alert("OAuth login mislukt, probeer opnieuw.");
        navigate("/register");
      }
    };
  
    handleOAuthCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">⏳ Bezig met inloggen...</p>
    </div>
  );
};

export default AuthCallback;

export const query = graphql`
  query($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;