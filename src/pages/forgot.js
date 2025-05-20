// src/pages/forgot.js
import { useState } from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import Seo from "../components/Seo";
import SectionWrapper from "../components/SectionWrapper";

const ForgotPage = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async e => {
    e.preventDefault();
    if (!email) {
      setError(t("forgot.error_required_fields"));
      return;
    }

    try {
      setError("");
      setSuccess("");

      // Simuleer een API-call voor wachtwoordherstel
      const response = await fetch("/api/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": "veiligheids-token-hier", // Zorg dat CSRF beveiliging correct wordt geïmplementeerd
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(t("forgot.success_message"));
      } else {
        throw new Error(result.message || "Onbekende fout");
      }
    } catch (err) {
      setError(t("forgot.error_server"));
      console.error("Fout bij wachtwoordherstel", { err });
    }
  };

  return (
    <>
      <Seo
        title={t("forgot.seo_title", { defaultValue: t("seo.title") })}
        description={t("forgot.seo_description", { defaultValue: t("seo.description") })}
      />
      <SectionWrapper bgColor="bg-white">
        <div className="flex h-screen items-center justify-center">
          <div className="w-full max-w-md">
            {/* Logo en Titel */}
            <div className="mb-6 text-center">
              <img src="/images/CRlogo.jpg" alt={t("forgot.logo_alt")} className="mx-auto h-12" />
              <h1 className="mb-4 mt-4 text-xl font-semibold">{t("forgot.heading")}</h1>
              <p className="text-sm text-gray-600">{t("forgot.sub_heading")}</p>
            </div>

            {/* Foutmelding */}
            {error && <div className="text-red-600">{error}</div>}

            {/* Succesbericht */}
            {success && <div className="text-green-600">{success}</div>}

            {/* Wachtwoordreset formulier */}
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t("forgot.email_placeholder")}
                  className={`input ${error ? "border-red-500 focus:ring-red-300" : ""}`}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                {t("forgot.submit_button")}
              </button>
            </form>

            {/* Link naar login */}
            <div className="mt-6 text-center">
              <p className="text-sm">
                {t("forgot.to_login")}{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  {t("forgot.to_login_link")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
};

export default ForgotPage;

export const query = graphql`
  query ($language: String!) {
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
