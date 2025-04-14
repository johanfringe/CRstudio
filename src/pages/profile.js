// src/pages/profile.js :
import React, { useState, useEffect, useMemo } from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";

import Seo from "../components/Seo";
import SectionWrapper from "../components/SectionWrapper";
import { Input, Button } from "../components/ui";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

import { supabase } from "../lib/supabaseClient";
import { preloadZxcvbn, validatePassword } from "../utils/validatePassword";
import { validateSubdomain, getSubdomainValidationSteps } from "@/utils/validateSubdomain";

const Profile = () => {
  const { t } = useTranslation();

  // 🌐 Token & sessie
  const [session, setSession] = useState(null);
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const token = searchParams?.get("token");
  const wasVerified = useMemo(() => typeof window !== "undefined" && localStorage.getItem("verified") === "true", []);

  // ✅ Status & validatie
  const [statusCode, setStatusCode] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);

  // 👤 Profielvelden
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [password, setPassword] = useState("");

  // ⚠️ Validatie & fouten
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordError, setPasswordError] = useState(null);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔍 Afgeleide provider
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [subdomainError, setSubdomainError] = useState("");
  const [subdomainStatus, setSubdomainStatus] = useState(null);
  const [validationSteps, setValidationSteps] = useState({});
  const [showChecklist, setShowChecklist] = useState(false);

  // 🧠 Haal sessie op
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const sessionUser = data?.session?.user;
      let userProvider = sessionUser?.app_metadata?.provider;

      // 🔁 Fallback indien provider ontbreekt in sessie
      if (!userProvider && sessionUser?.id) {
        const { data: userData } = await supabase.auth.getUser();
        userProvider = userData?.user?.app_metadata?.provider;
      }

      console.log("🔍 Gedetecteerde provider:", userProvider);
      setSession(data?.session || null);
      setIsEmailUser(userProvider !== "google");
    });
  }, []);

  // 🧪 Verifieer token of sessie
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

  // 🧼 Validatie helpers
  useEffect(() => {
    const trimmed = subdomain.trim();

    if (trimmed.length === 0) {
      setSubdomainStatus(null);
      setSubdomainError("");
      return;
    }

    const validationError = validateSubdomain(trimmed);

    if (validationError) {
      setSubdomainStatus("invalid");
      setSubdomainError(t(validationError));
      return;
    }

    setSubdomainStatus("checking");
    setSubdomainError("");
    checkSubdomainAvailability(trimmed);
  }, [subdomain, t]);

  const checkSubdomainAvailability = async (sub) => {
    console.log("🔍 Controleer beschikbaarheid voor:", sub);
    setSubdomainStatus("available");
  };

  const nameRegex = /^[\p{L}\p{M}](?!.*[-'\s]{2})[\p{L}\p{M}\s'-]{0,38}[\p{L}\p{M}]$/u;
  const emojiRegex = /\p{Extended_Pictographic}/u;

  const cleanName = (name) =>
    name
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[-'\s]{2,}/g, "")
      .replace(/^[-'\s]+|[-'\s]+$/g, "");

  const validateName = (name) => {
    const cleaned = cleanName(name);
    return (
      cleaned.length >= 2 &&
      cleaned.length <= 40 &&
      nameRegex.test(cleaned) &&
      !emojiRegex.test(cleaned)
    );
  };

  // 📤 Form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setFormError("");

    const cleanedFirstName = cleanName(firstName);
    const cleanedLastName = cleanName(lastName);

    if (!validateName(firstName)) {
      setFirstNameError(t("profile.first_name_invalid"));
      return;
    }

    if (!validateName(lastName)) {
      setLastNameError(t("profile.last_name_invalid"));
      return;
    }

    setFirstName(cleanedFirstName);
    setLastName(cleanedLastName);
    setLoading(true);

    console.log("✍️ Verzenden profielgegevens:", {
      firstName: cleanedFirstName,
      lastName: cleanedLastName,
      password,
      subdomain,
    });

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData?.session?.access_token) {
        console.error("❌ Geen geldige sessie gevonden:", sessionError);
        setFormError(t("profile.session_error"));
        setLoading(false);
        return;
      }

      const accessToken = sessionData.session.access_token;

      if (isEmailUser) {
        const { error: passwordError } = await supabase.auth.updateUser({ password });
        if (passwordError) {
          console.error("❌ Wachtwoord instellen mislukt:", passwordError.message);
          setFormError(t("profile.password_update_failed"));
          setLoading(false);
          return;
        }
        console.log("✅ Wachtwoord succesvol opgeslagen in auth.users");
      }

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          firstName: cleanedFirstName,
          lastName: cleanedLastName,
          subdomain: subdomain.toLowerCase().trim(),
          language: session?.user?.user_metadata?.lang || "en",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Onbekende fout bij profielaanmaak.");
      }

      console.log("✅ Artist aangemaakt:", result);
      window.location.href = `https://${subdomain}.crstudio.online/account`;
    } catch (err) {
      console.error("❌ Profielcreatie mislukt:", err.message);
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title={t("profile.seo_title", { defaultValue: t("seo.title") })}
        description={t("profile.seo_description", { defaultValue: t("seo.description") })}
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
              <h1 className="text-xl font-semibold mt-16">
                {t("profile.heading")}
              </h1>
            </div>
  
            <p className="text-sm text-center text-gray-600 mb-6">
              {t("profile.intro_text")}
            </p>
  
            {tokenValid ? (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Voornaam */}
                <div className="relative">
                  <Input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder={t("profile.first_name_placeholder")}
                    value={firstName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFirstName(value);
                      setFirstNameError(!validateName(value) ? t("profile.first_name_invalid") : "");
                      console.log("🧪 Voornaam input:", value);
                    }}
                    aria-invalid={firstNameError ? "true" : "false"}
                    aria-describedby="firstName-error"
                    className={`input ${firstNameError ? "input-error" : ""}`}
                  />
                  {firstNameError && (
                    <p id="firstName-error" className="text-red-500 text-xs mt-1">
                      {firstNameError}
                    </p>
                  )}
                </div>
  
                {/* Familienaam */}
                <div className="relative">
                  <Input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder={t("profile.last_name_placeholder")}
                    value={lastName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setLastName(value);
                      setLastNameError(!validateName(value) ? t("profile.last_name_invalid") : "");
                      console.log("🧪 Familienaam input:", value);
                    }}
                    aria-invalid={lastNameError ? "true" : "false"}
                    aria-describedby="lastName-error"
                    className={`input ${lastNameError ? "input-error" : ""}`}
                  />
                  {lastNameError && (
                    <p id="lastName-error" className="text-red-500 text-xs mt-1">
                      {lastNameError}
                    </p>
                  )}
                </div>
  
                {/* Wachtwoord, Alleen voor e-mailgebruikers */}
                {isEmailUser && (
                  <div className="relative">
                    <Input
                      type="password"
                      name="password"
                      placeholder={t("profile.password_placeholder")}
                      value={password}
                      onFocus={preloadZxcvbn}
                      onChange={async (e) => {
                        const value = e.target.value;
                        setPassword(value);
                        setCheckingPassword(true);
  
                        const zxcvbnLib = await import("zxcvbn");
                        const { score } = zxcvbnLib.default(value);
                        setPasswordScore(score);
  
                        const error = await validatePassword(value, {
                          email: session?.user?.email,
                          name: firstName + lastName,
                          subdomain,
                        });
                        setPasswordError(error);
                        setCheckingPassword(false);
                      }}
                      className={`input w-full ${passwordError ? "border-red-500" : ""}`}
                      aria-invalid={passwordError ? "true" : "false"}
                      aria-describedby="password-error"
                    />
                    {password && (
                      <div className="mt-1">
                        <PasswordStrengthMeter score={passwordScore} />
                      </div>
                    )}
                    {checkingPassword && (
                      <p className="text-xs text-gray-500 mt-1">
                        {t("profile.checkingPassword")}...
                      </p>
                    )}
                    {passwordError && (
                      <p id="password-error" className="text-red-500 text-xs mt-1">
                        {t(passwordError)}
                      </p>
                    )}
                  </div>
                )}
  
                {/* Subdomein */}
                <div className="my-6 flex items-center">
                  <hr className="flex-grow border-gray-300" />
                  <span className="px-3 text-gray-700">
                    {t("profile.subdomain_heading")}
                  </span>
                  <hr className="flex-grow border-gray-300" />
                </div>
  
                <p className="text-sm text-center text-gray-600 mb-6">
                  {t("profile.subdomain_intro_text")}
                </p>
  
                <div className="space-y-1">
                  <div className="relative">
                    <Input
                      type="text"
                      name="subdomain"
                      placeholder={t("profile.subdomain_placeholder")}
                      value={subdomain}
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase(); // ⬅️ Forceer lowercase
                        setSubdomain(val);
                        setValidationSteps(getSubdomainValidationSteps(val));
  
                        // 👉 Checklist tonen zodra gebruiker typt
                        setShowChecklist(val.length > 0);
  
                        const error = validateSubdomain(val);
                        if (error) {
                          setSubdomainStatus("invalid");
                          setSubdomainError(t(error));
                        } else {
                          setSubdomainError("");
                          setSubdomainStatus(null);
                          checkSubdomainAvailability(val);
                        }
                      }}
                      className={`input w-full pr-28 ${subdomainStatus === "invalid" ? "border-red-500" : ""}`}
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm pointer-events-none">
                      /crstudio.online
                    </span>
                  </div>
  
                  {/* ✅/❌ lijst met live feedback */}
                  {showChecklist && (
                    <ul className="text-xs text-gray-600 mt-2 space-y-1">
                      <li className={validationSteps.validChars ? "text-gray-400" : "text-red-500"}>
                        {validationSteps.validChars ? "✔" : "✖"} {t("profile.subdomain_validation.validChars")}
                      </li>
                      <li className={validationSteps.correctLength ? "text-gray-400" : "text-red-500"}>
                        {validationSteps.correctLength ? "✔" : "✖"} {t("profile.subdomain_validation.correctLength")}
                      </li>
                      <li className={validationSteps.startsCorrectly ? "text-gray-400" : "text-red-500"}>
                        {validationSteps.startsCorrectly ? "✔" : "✖"} {t("profile.subdomain_validation.startsCorrectly")}
                      </li>
                      <li className={validationSteps.endsCorrectly ? "text-gray-400" : "text-red-500"}>
                        {validationSteps.endsCorrectly ? "✔" : "✖"} {t("profile.subdomain_validation.endsCorrectly")}
                      </li>
                      <li className={validationSteps.notInBlocklist ? "text-gray-400" : "text-red-500"}>
                        {validationSteps.notInBlocklist ? "✔" : "✖"} {t("profile.subdomain_validation.notInBlocklist")}
                      </li>
                    </ul>
                  )}
                </div>
  
                {formError && (
                  <p className="text-red-500 text-sm">{formError}</p>
                )}
                <Button type="submit" disabled={loading} className="btn btn-primary w-full">
                  {loading ? t("profile.button_busy") : t("profile.button_submit")}
                </Button>
              </form>
            ) : statusCode ? (
              <p className="text-red-500 text-center">
                {t(`profile.verify_error.${statusCode}`)}
              </p>
            ) : null}
          </div>
        </div>
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
  