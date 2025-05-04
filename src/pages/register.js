// /src/pages/register.js :
import React, { useState, useEffect } from "react";
import { Link, graphql, navigate } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { useI18next } from "gatsby-plugin-react-i18next";
import { validateEmail } from "../utils/emailValidator";
import { supabase } from "../lib/supabaseClient";
import { Button, Input } from "../components/ui";
import Seo from "../components/Seo";
import SectionWrapper from "../components/SectionWrapper";
import { log, warn, error, captureApiError } from "../utils/logger";
import { waitForSession } from "../utils/session";

const Register = () => {
  const { t } = useTranslation();
  const { language } = useI18next();

  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);

  // Laad Cloudflare Turnstile correct
    useEffect(() => {
      const renderTurnstile = () => {
        window.turnstile.render("#turnstile-container", {
          sitekey: process.env.GATSBY_TURNSTILE_SITE_KEY,
          callback: (token) => {
            log("✅ Turnstile Token ontvangen", { token });
            setTurnstileToken(token);
          },
        });
      };
      
      const loadTurnstileScript = () => {
        if (!window.turnstile) {
          const script = document.createElement("script");
          script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
          script.async = true;
          script.onload = () => {
            log("✅ Turnstile script geladen!", { loaded: true });
            renderTurnstile();
          };
          document.body.appendChild(script);
        } else {
          renderTurnstile();
        }
      };
  
      loadTurnstileScript();
    }, []);

    // 🌍 Social Login handler
  const handleSocialLogin = async (provider) => {
      try {
        log("🔗 Start social login met provider", { provider });
        setLoading(true);
        setErrorMsg("");
  
        const redirectTo = `${window.location.origin}/${language}/profile`;
        log("🔁 Instellen redirectTo voor fallback", { redirectTo });
  
        const { data, error: loginError } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            popup: true,
            pkce: true,
            redirectTo,
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        });
  
        log("📦 OAuth data", { data });
  
        if (loginError) {
        error("❌ Social login fout", { loginError });
        setErrorMsg(t("register.social_login_failed"));
        return;
      }

    // ⏳ Wacht kort tot de sessie effectief beschikbaar is
    const session = await waitForSession();
      if (session) {
        log("✅ Supabase sessie succesvol", { session });
        log("➡️ Navigeren naar profielpagina", { language });
        navigate(`/${language}/profile`);
      }
    } catch (err) {
      error("❌ Onverwachte fout bij social login", { err });
    } finally {
      setLoading(false);
    }
  };

  // 📩 Formulier submit handler voor e-mailregistratie
  const handleResendVerification = async (email) => {
    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang: language }),
      });
      const result = await res.json();
      if (result.code === "EMAIL_SEND_AGAIN") {
        setErrorMsg(t("register.verify_error.EMAIL_SEND_AGAIN"));
      } else {
        setErrorMsg(t("register.verify_error.EMAIL_SEND_FAILED_AGAIN"));
      }
    } catch (err) {
      error("❌ Fout bij opnieuw verzenden verificatiemail", { err });
      setErrorMsg(t("register.verify_error.INTERNAL_EXCEPTION"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validateEmail(email)) {
      warn("⚠️ Ongeldig e-mailadres bij registratie", { email });
      setErrorMsg(t("register.email_invalid"));
      return;
    }

    if (!turnstileToken) {
      warn("⚠️ Geen Turnstile-token beschikbaar bij submit", { email });
      setErrorMsg(t("register.check"));
      return;
    }

    setLoading(true);

    try {
      log("📡 Versturen van registratieverzoek voor e-mail", { email });
      log("📬 Verzenden fetch /api/register", { email, turnstileToken, lang: language });
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken, lang: language }),
      });

      const data = await response.json();
      const errorCode = data.code || "UNKNOWN_ERROR";
      captureApiError("/api/register", response, { errorCode, data, email });

      // 👇 Auth.user flow
      if (errorCode === "EMAIL_DUPLICATE") {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          const userId = sessionData?.session?.user?.id;
        
          if (userId) {
            const { data: artist, error: artistError } = await supabase
              .from("artists")
              .select("subdomain")
              .eq("user_id", userId)
              .maybeSingle();
        
            if (artistError) {
              warn("⚠️ Fout bij ophalen artist-record", { artistError });
            }
        
            if (artist?.subdomain) {
              setErrorMsg(
                <>
                  {t("register.account_exists_subdomain")}
                  <a href={`https://${artist.subdomain}.crstudio.online/account`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">
                    {t("register.go_to_site")}
                  </a>
                </>
              );
              return;
            } else {
              setErrorMsg(
                <>
                  {t("register.account_exists_no_subdomain")}
                  <Link to={`/${language}/profile`} className="text-blue-600 underline ml-1">
                    {t("register.complete_profile")}
                  </Link>
                </>
              );
              return;
            }
          } else {
            setErrorMsg(
              <>
                {t("register.duplicate_needs_verification")}
                <Button
                  variant="link"
                  className="text-blue-600 underline ml-1"
                  onClick={() => handleResendVerification(email)}
                >
                  {t("register.resend_verification")}
                </Button>
              </>
            );
            return;
          }
        } catch (err) {
          error("❌ Fout bij controleren op bestaande gebruiker/subdomein", { err });
          setErrorMsg(t("register.profile_check_failed"));
          return;
        }
      }

      // Success, of fallback bij andere fouten
      if (errorCode === "EMAIL_SEND") {
        log("✅ Registratie succesvol", { data });
        setErrorMsg(t("register.verify_error.EMAIL_SEND"));
        return;
      }

        // 📩 Nieuwe e-mail verzonden bij herregistratie (>30min)
      if (errorCode === "EMAIL_SEND_AGAIN") {
        log("✅ Nieuwe verificatie e-mail verzonden bij herregistratie", { email });
        setErrorMsg(t("register.verify_error.EMAIL_SEND_AGAIN"));
        return;
      }

      // ❌ Andere fouten
      setErrorMsg(
        t(`register.verify_error.${errorCode}`, {
          defaultValue: t("register.UNKNOWN_ERROR"),
        })
      );
      
    } catch (err) {
          error("❌ Registratiefout", { err, email });
      setErrorMsg(err.message);
    } finally {
      setLoading(false);

      // 🔁 Reset Turnstile na submit (zowel bij fout als succes)
      if (window.turnstile) {
              log("🔁 Turnstile wordt opnieuw gerenderd", { reset: true });
        window.turnstile.reset("#turnstile-container");
        setTurnstileToken(null);
      }
    }
  };

  return (
    <>
      <Seo
        title={t("register.seo_title", { defaultValue: t("seo.title") })}
        description={t("register.seo_description", { defaultValue: t("seo.description") })}
      />
      <SectionWrapper bgColor="bg-white">
        <div className="min-h-screen flex justify-center items-start py-24" aria-label={t("register.page_description")}>
          <div className="max-w-xs w-full mx-auto">
            <div className="text-center mb-6">
              <img src="/images/CRlogo.jpg" alt={t("register.logo_alt")} className="h-8 mx-auto" />
              <h1 className="text-xl font-semibold mt-16">{t("register.heading")}</h1>
            </div>
            <p className="intro-text">{t("register.intro_text")}</p>

            {/* 🟢 Social Login Sectie */}
            <div className="flex flex-col space-y-3">
              <Button
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center w-full border border-black rounded-lg py-2 text-sm hover:bg-gray-50"
              >
                <img src="/icons/google.svg" alt="Google Logo" className="h-5 w-5 mr-2" />
                {t("register.google_placeholder")}
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
                className={`input w-full ${errorMsg ? "input-error" : ""}`}
                aria-invalid={errorMsg ? "true" : "false"}
                aria-describedby={errorMsg ? "email-error" : undefined}
              />
              {errorMsg && (
                <p id="email-error" className="text-red-500 text-xs mt-1">
                  {errorMsg}
                </p>
              )}
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
