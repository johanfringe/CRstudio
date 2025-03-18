// src/pages/login.js
import React, { useState } from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import Seo from "../components/Seo";
import SectionWrapper from "../components/SectionWrapper";
import { supabase } from "../utils/supabaseClient";

const LoginPage = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset foutmeldingen
    setLoading(true); // Zet de laadstatus aan

    if (!email || !password) {
      setError(t("login.error_required_fields"));
      setLoading(false);
      return;
    }

    try {
      // 🔹 Stap 1: Gebruiker authenticeren via Supabase
      const { data: user, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError || !user) {
        console.error("❌ Inlogfout:", loginError);
        setError(t("login.error_invalid_credentials"));
        setLoading(false);
        return;
      }

      console.log("✅ Gebruiker ingelogd:", user);

      // 🔹 Stap 2: Opzoeken van subdomein in database
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("subdomain, trial_expiry")
        .eq("id", user.user.id)
        .single();

      if (profileError) {
        console.error("❌ Databasefout bij ophalen subdomein:", profileError);
        setError(t("login.error_fetching_subdomain"));
        setLoading(false);
        return;
      }

      if (!profile?.subdomain) {
        console.warn("⚠️ Geen subdomein gevonden voor deze gebruiker.");
        setError(t("login.error_no_subdomain"));
        setLoading(false);
        return;
      }

      console.log("✅ Subdomein gevonden:", profile.subdomain);

      // 🔹 Stap 3: Check of de trial verlopen is
      const trialExpired = profile.trial_expiry && new Date(profile.trial_expiry) < new Date();
      if (trialExpired) {
        console.warn("⚠️ Trial is verlopen voor deze gebruiker.");
        setError(t("login.trial_expired"));
        setLoading(false);
        return;
      }

      // 🔹 Stap 4: Opslaan in LocalStorage en redirecten
      localStorage.setItem("userSubdomain", profile.subdomain);
      window.location.href = `https://${profile.subdomain}.crstudio.online/dashboard`;

    } catch (error) {
      console.error("❌ Onverwachte fout bij inloggen:", error);
      setError(t("login.error_generic"));
      setLoading(false);
    }
  };

  return (
    <>
      <Seo 
        title={t("login.seo_title", { defaultValue: t("seo.title") })} 
        description={t("login.seo_description", { defaultValue: t("seo.description") })}
      />
      <SectionWrapper bgColor="bg-white">
      <div className="h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-6">
            <img
              src="/images/CRlogo.jpg"
              alt={t("login.logo_alt")}
              className="h-12 mx-auto"
            />
            <h1 className="text-xl font-semibold mt-4">{t("login.heading")}</h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-center mb-4">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("login.email_placeholder")}
                className={`input ${error ? "border-red-500 focus:ring-red-300" : ""}`}
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("login.password_placeholder")}
                className={`input ${error ? "border-red-500 focus:ring-red-300" : ""}`}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <span className="ml-2 text-sm text-gray-600">{t("login.remember_me")}</span>
              </label>
              <a href="/forgot" className="text-sm text-blue-600 hover:underline">
                {t("login.forgot_password")}
              </a>
            </div>

            <button type="submit" className="w-full btn btn-primary" disabled={loading}>
              {loading ? t("login.loading") : t("login.login_button")}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm">
              {t("login.no_account")}{" "}
              <a href="/subscription-signup" className="text-blue-600 hover:underline">
                {t("login.register_link")}
              </a>
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
    </>
  );
}

export default LoginPage;

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
