// src/pages/profile.js :
import React, { useState, useEffect, useRef } from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import Seo from "../components/Seo";
import SectionWrapper from "../components/SectionWrapper";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { Input, Button } from "../components/ui";
import { supabase } from "../lib/supabaseClient";
import { preloadZxcvbn, validatePassword } from "../utils/validatePassword";
import { validateSubdomain, getSubdomainValidationSteps } from "../utils/validateSubdomain";
import { log, warn, error, captureApiError } from "../utils/logger";
import { waitForSession } from "../utils/session";

const COOLDOWN_SECONDS = 300;

const ResendVerificationInline = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const cooldownEnd = localStorage.getItem("resendCooldownEnd");
    if (cooldownEnd) {
      const diff = Math.floor((parseInt(cooldownEnd, 10) - Date.now()) / 1000);
      if (diff > 0) setCooldown(diff);
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("resendCooldownEnd");
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResend = async () => {
    const email = localStorage.getItem("verifiedEmail");
    if (!email) {
      setError(t("profile.resend.no_email"));
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang: i18n.language }),
      });

      const data = await res.json();

      if (!res.ok) {
        const code = data.code || "UNKNOWN_ERROR";
        warn("Resend-verificatie faalt", { code, email });
        return;
      }

      const cooldownUntil = Date.now() + COOLDOWN_SECONDS * 1000;
      localStorage.setItem("resendCooldownEnd", cooldownUntil.toString());
      setCooldown(COOLDOWN_SECONDS);
      setMessage(t("profile.resend.success"));
    } catch (err) {
      error("Resend-verificatie API faalt", { err });
      setError(t("profile.resend.failed"));
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="mt-4 text-center">
      <button
        type="button"
        onClick={handleResend}
        disabled={loading || cooldown > 0}
        className="btn btn-primary w-full"
      >
        {loading
          ? t("profile.resend.loading")
          : cooldown > 0
          ? `${t("profile.resend.cooldown")} (${formatTime(cooldown)})`
          : t("profile.resend.cta")}
      </button>
      {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

const Profile = () => {
  const { t } = useTranslation();
  const [session, setSession] = useState(null);
  const wasVerified = useRef(
    typeof window !== "undefined" && localStorage.getItem("verified") === "true"
  );
  const didRedirect = useRef(false);
  const redirectTimer = useRef(null);
  const [statusCode, setStatusCode] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [password, setPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordError, setPasswordError] = useState(null);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [subdomainError, setSubdomainError] = useState("");
  const [subdomainStatus, setSubdomainStatus] = useState(null);
  const [validationSteps, setValidationSteps] = useState({});
  const [showChecklist, setShowChecklist] = useState(false);
  const [token, setToken] = useState(null);

useEffect(() => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const tok = params.get("token");
    setToken(tok);
    log("🆔 Token uit URL gehaald", { tok });
  }
}, []);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data?.session?.user;
        let userProvider = sessionUser?.app_metadata?.provider;
  
        // Fallback via getUser()
        if (!userProvider && sessionUser?.id) {
          const { data: userData, err } = await supabase.auth.getUser();
          if (err) {
            error("Fallback getUser() mislukt", { err });
          } else {
            userProvider = userData?.user?.app_metadata?.provider;
            log("📦 Fallback via getUser() gebruikt", { userProvider });
          }
        }
  
        setSession(data?.session || null);
        setIsEmailUser(userProvider !== "google");
        log("🔍 Auth provider gedetecteerd", { userProvider });
      } catch (err) {
        error("Fout bij ophalen provider", { err });
      }
    };
  
    fetchProvider();
  }, []);  

  useEffect(() => {
    const verifyFlow = async () => {
      if (tokenValid) return;
      setStatusCode(null);
    
      if (wasVerified.current) {
        log("✅ Token was already verified in localStorage", { token });
        setTokenValid(true);
        return;
      }
    
      if (token) {
        try {
          const res = await fetch("/api/verify-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
    
          const data = await res.json();
    
          if (data.code === "EMAIL_VERIFIED") {
            localStorage.setItem("verified", "true");
            if (data.email) localStorage.setItem("verifiedEmail", data.email);
            log("📬 Email geverifieerd", { email: data.email });
            setTokenValid(true);
            return;
          }

          captureApiError("/api/verify-email", res, { response: data, token });
          setStatusCode(data.code || "INTERNAL_ERROR");
        } catch (err) {
          error("Verificatie API-call faalt", { err });
          setStatusCode("INTERNAL_ERROR");
        }
      } else {
        const foundSession = await waitForSession();
        if (foundSession) {
        log("🟢 Sessie gevonden zonder token", { session: foundSession, hasToken: !!token, verified: wasVerified.current });
          setTokenValid(true);
          setSession(foundSession);
        } else {
          warn("🔴 Geen token en geen sessie gevonden", { token });
          setStatusCode("TOKEN_NOT_FOUND");
        }
      }
    };

    verifyFlow();
  }, [token]);

  useEffect(() => {
  
    const redirectIfAlreadyComplete = async () => {
      try {
        const activeSession = session ?? (await supabase.auth.getSession()).data?.session;
        const user = activeSession?.user;
  
        if (!user || didRedirect.current) {
          return;
        }
  
        const { data: artist, error } = await supabase
          .from("artists")
          .select("subdomain")
          .eq("user_id", user.id)
          .maybeSingle();
  
        if (error) {
          error("❌ Fout bij ophalen artist tijdens redirect", { error });
          return;
        }
  
        if (artist?.subdomain) {
          didRedirect.current = true;
          log("🔁 Reeds bestaand artist-profiel, redirect naar subsite", { subdomain: artist.subdomain });
  
          setRedirecting(true);
          localStorage.setItem("subdomain", artist.subdomain);
  
          redirectTimer.current = setTimeout(() => {
            window.location.href = `https://${artist.subdomain}.crstudio.online/account`;
          }, 1000);
        } else {
          log("ℹ️ Geen subdomein aanwezig, gebruiker moet profiel vervolledigen");
        }
      } catch (err) {
        error("🛑 Onverwachte fout in redirectIfAlreadyComplete", { err });
      }
    };
  
    if (tokenValid) {
      redirectIfAlreadyComplete();
    }
  
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, [tokenValid]);

  const renderErrorMessage = () => {
    switch (statusCode) {
      case "TOKEN_EXPIRED":
        return (
          <div className="text-center">
            <h1 className="text-xl font-semibold mt-16">{t("profile.verify_error.TOKEN_EXPIRED")}</h1>
            <ResendVerificationInline />
          </div>
        );
      case "TOKEN_NOT_FOUND":
      case "USER_NOT_FOUND":
        return (
          <div className="text-center">
            <h1 className="text-xl font-semibold mt-16">{t("profile.verify_error.USER_NOT_FOUND")}</h1>
            <Button href="/register" className="btn btn-secondary mt-4">
              {t("profile.actions.register")}
            </Button>
          </div>
        );
      case "EMAIL_DUPLICATE":
        return (
          <div className="text-center">
            <h1 className="text-xl font-semibold mt-16">{t("profile.verify_error.EMAIL_DUPLICATE")}</h1>
            <Button href="/login" className="btn btn-secondary mt-4">
              {t("profile.actions.login")}
            </Button>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <h1 className="text-xl font-semibold mt-16">{t("profile.verify_error.INTERNAL_ERROR")}</h1>
          </div>
        );
    }
  };

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

  const checkSubdomainAvailability = async (sub) => {     // TODO
    log("🌐 Controle subdomein beschikbaarheid", { sub });
    setSubdomainStatus("available");
  };

  const nameRegex = /^[\p{L}\p{M}](?!.*[-'\s]{2})[\p{L}\p{M}\s'-]{0,38}[\p{L}\p{M}]$/u;
  const emojiRegex = /\p{Extended_Pictographic}/u;

  const cleanName = (name) => name.trim().replace(/\s+/g, " ").replace(/[-'\s]{2,}/g, "").replace(/^[-'\s]+|[-'\s]+$/g, "");
  const validateName = (name) => {
    const cleaned = cleanName(name);
    return cleaned.length >= 2 && cleaned.length <= 40 && nameRegex.test(cleaned) && !emojiRegex.test(cleaned);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setErrorMsg("");
    setFormSuccess("");

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

    setLoading(true);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.access_token) {
        error("Sessie ongeldig of ontbreekt", { sessionError });
        setErrorMsg(t("profile.session_error"));
        return;
      }

      const accessToken = sessionData.session.access_token;
      log("🔐 Ingelogde gebruiker", { user: sessionData.session.user });

      if (isEmailUser) {
        const { error: passwordError } = await supabase.auth.updateUser({ password });
        if (passwordError) {
          error("Wachtwoord-update mislukt", { passwordError, isEmailUser });
          setErrorMsg(t("profile.password_update_failed"));
          return;
        }
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
        const code = result?.code || "INSERT_FAILED";
        captureApiError("/api/profile", response, { result });
        setErrorMsg(t(`profile.verify_error.${code}`));
        return;
      }

      log("✅ Profiel succesvol aangemaakt", { result });
      setFormSuccess(t("profile.verify_error.PROFILE_CREATED"));
      window.location.href = `https://${subdomain}.crstudio.online/account`;
    } catch (err) {
      const safeCode = err?.message?.toUpperCase?.() || "SERVER_ERROR";
      error("Profielcreatie faalde", { safeCode, err, subdomain });
      setErrorMsg(t(`profile.verify_error.${safeCode}`));
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
        <div className="min-h-screen flex justify-center items-start py-24">
          {tokenValid ? (
            <div className="max-w-xs w-full mx-auto">
            <div className="text-center mb-6">
              <img src="/images/CRlogo.jpg" alt={t("profile.logo_alt")} className="h-8 mx-auto" />
              <h1 className="text-xl font-semibold mt-16">{t("profile.heading")}</h1>
            </div>
            <p className="intro-text">{t("profile.intro_text")}</p>
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
                      log("🧪 Voornaam input", { firstName: value });
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
                      log("🧪 Familienaam input", { lastName: value });
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
                      className={`input w-full ${passwordError ? "input-error" : ""}`}
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
  
                <p className="intro-text">
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
                      className={`input w-full pr-28 ${subdomainStatus === "invalid" ? "input-error" : ""}`}
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
  
                {formSuccess && <p className="text-green-600 text-sm text-center">{formSuccess}</p>}
                {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
                <Button type="submit" disabled={loading} className="btn btn-primary w-full">
                  {loading ? t("profile.button_busy") : t("profile.button_submit")}
                </Button>
              </form>
            </div>
          ) : (
            <div className="max-w-xs w-full mx-auto">
              <img src="/images/CRlogo.jpg" alt={t("register.logo_alt")} className="h-8 mx-auto" />
              {renderErrorMessage()}
            </div>
          )}
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
