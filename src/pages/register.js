// /src/pages/register.js :
import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { validateEmail } from "@/utils/emailValidator";
import { Button, Input } from "@/components/ui";
import Seo from "../components/Seo";
import SectionWrapper from "../components/SectionWrapper";

const Register = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);

  // Laad Cloudflare Turnstile correct
  useEffect(() => {
    const loadTurnstileScript = () => {
      if (!window.turnstile) {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.onload = () => {
          console.log("✅ Turnstile script geladen!");
          window.turnstile.render("#turnstile-container", {
            sitekey: process.env.GATSBY_TURNSTILE_SITE_KEY,
            callback: (token) => {
              console.log("✅ Turnstile Token ontvangen:", token);
              setTurnstileToken(token);
            },
          });
        };
        document.body.appendChild(script);
      } else {
        window.turnstile.render("#turnstile-container", {
          sitekey: process.env.GATSBY_TURNSTILE_SITE_KEY,
          callback: (token) => {
            console.log("✅ Turnstile Token ontvangen:", token);
            setTurnstileToken(token);
          },
        });
      }
    };

    loadTurnstileScript();
  }, []);

  // 🌍 Social Login handler
const handleSocialLogin = async (provider) => {
  try {
    console.log(`🔗 OAuth login starten met ${provider}`);

    // 🔐 **State genereren en opslaan in sessionStorage**
    const state = Math.random().toString(36).substring(2);
    sessionStorage.setItem("oauth_state", state);
    console.log(`🛡️ State opgeslagen: ${state}`);

    // ✅ Stuur de state mee naar de backend
    const response = await fetch("/api/auth/socialLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, state }), // Stuur state mee naar de server
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    console.log(`✅ OAuth redirect naar ${data.url}`);
    window.location.href = data.url; // Start de login flow
  } catch (err) {
    console.error("❌ Social login fout:", err.message);
    setError(err.message);
  }
};

  // 📩 Formulier submit handler voor e-mailregistratie
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError(t("register.invalid_mail"));
      return;
    }

    if (!turnstileToken) {
      setError(t("register.check"));
      return;
    }

    setLoading(true);
    try {
      console.log("📡 Versturen van registratieverzoek voor e-mail:", email);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      console.log("✅ Registratie succesvol:", data);

      alert(t("register.succes"));
    } catch (err) {
      console.error("❌ Registratiefout:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    <Seo 
        title={t("register.seo_title", { defaultValue: t("seo.title") })} 
        description={t("register.seo_description", { defaultValue: t("seo.description") })}
      />
    <SectionWrapper bgColor="bg-white">
    <div className="min-h-screen flex mt-20 justify-center">
    <div className="max-w-xs w-full mx-auto">
      <div className="text-center mb-6">
            <img
              src="/images/CRlogo.jpg"
              alt={t("register.logo_alt")}
              className="h-8 mx-auto"
            />
            <h1 className="text-xl font-semibold mt-16">{t("register.heading")}</h1>
      </div>
      {/* <h2 className="text-2xl font-bold mb-4 text-center">{t("register.subheading")}</h2> */}

      {/* 🟢 Social Login Sectie */}
      <div className="flex flex-col space-y-3">
        <Button
          onClick={() => handleSocialLogin("google")}
          className="flex items-center justify-center w-full border border-black input"
        >
          <img src="/icons/google.svg" alt="Google Logo" className="h-5 w-5 mr-2" />{t("register.google_placeholder")}
        </Button>
      </div>

      <div className="my-6 flex items-center">
        <hr className="flex-grow border-gray-300" />
        <span className="px-3 text-gray-700">{t("register.or")}</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* 📩 E-mail registratieformulier */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          id="email"
          name="email"
          placeholder={t("register.email_placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
          className="input w-full"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div id="turnstile-container" className="w-full flex justify-center mt-2"></div>

        <Button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? t("register.button_busy") : t("register.button_register")}
        </Button>
      </form>
    </div>
    </div>
    </SectionWrapper>
  </>
  );
};

export default Register;

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
