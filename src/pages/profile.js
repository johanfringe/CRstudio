//src/pages/profile.js:
// Moet nog volledig gemaakt worden
// ✔ Naam, voornaam, wachtwoord en subdomein invoeren en wijzigen
// ✔ Notificatie-instellingen wijzigen
// ✔ Tweestapsverificatie (2FA) activeren
// ✔ API-keys genereren (indien nodig)

import React, { useState, useEffect, useMemo } from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import Seo from "../components/Seo";
import SectionWrapper from "../components/SectionWrapper";
import { supabase } from "../lib/supabaseClient";

const Profile = () => {
  const { t } = useTranslation();
  const [statusCode, setStatusCode] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [session, setSession] = useState(null);

  // ✅ Token ophalen uit de URL
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const token = searchParams?.get("token");

  const wasVerified = useMemo(() => {
    return typeof window !== "undefined" && localStorage.getItem("verified") === "true";
  }, []);

  // ✅ Haal Supabase sessie vooraf op en bewaar in state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("🧠 Supabase sessie opgehaald:", data?.session);
      setSession(data?.session || null);
    });
  }, []);

  useEffect(() => {
    if (wasVerified) {
      console.log("🔁 Gebruiker is reeds geverifieerd via localStorage.");
      setTokenValid(true);
      return;
    }

    if (token) {
      console.log("📡 Verificatie gestart voor token:", token);
      fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.code === "EMAIL_VERIFIED") {
            console.log("✅ Token geldig, gebruiker is geverifieerd!");
            setTokenValid(true);

            // 🧠 Status bijhouden voor refresh
            localStorage.setItem("verified", "true");
            localStorage.setItem("verifiedEmail", data.email);
          } else {
            console.error("❌ Token ongeldig:", data.code);
            setStatusCode("INTERNAL_ERROR");
          }
        })
        .catch((err) => {
          console.error("❌ Fout bij e-mailverificatie:", err);
          setStatusCode("INTERNAL_ERROR");
        });
    } else {
      if (session) {
        console.log("✅ Supabase sessie gevonden, gebruiker is ingelogd.");
        setTokenValid(true);
      } else {
        console.warn("⚠️ Geen token én geen actieve Supabase sessie.");
        setStatusCode("NO_TOKEN");
      }
    }
  }, [token, wasVerified, session]);

  return (
    <>
      <Seo
        title={t("profile.seoTitle", { defaultValue: t("seo.title") })} 
        description={t("profile.seoDescription", { defaultValue: t("seo.description") })}
      />
      <SectionWrapper bgColor="bg-white">
      <main className="bg-gray-50 py-10 px-4" aria-label={t("profile.pageDescription")}>
      <div className="p-6 bg-white shadow-lg rounded-xl">
      {tokenValid ? (
        <>
          <h1 className="text-xl font-bold">{t("profile.email_verified_title")}</h1>
          <p className="text-gray-700">{t("profile.email_verified_subtitle")}</p>
          {/* Voeg hier je formulier of andere UI-componenten toe */}
        </>
      ) : (
        <p className="text-red-500">{t(`profile.verify_error.${statusCode}`)}</p>
      )}
      </div>
      </main>
      </SectionWrapper>
    </>
  );
};

export default Profile;

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
