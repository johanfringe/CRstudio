// src/pages/profile.js :
import React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import Seo from "../components/Seo";
import SectionWrapper from "../components/SectionWrapper";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import Spinner from "../components/Spinner";
import { Input, Button } from "../components/ui";
import { supabase } from "../lib/supabaseClient";
import { preloadZxcvbn, validatePassword } from "../utils/validatePassword";
import { validateSubdomain, getSubdomainValidationSteps } from "../utils/validateSubdomain";
import { log, warn, error, captureApiError } from "../utils/logger";
import { waitForSession } from "../utils/session";
import debounce from "lodash.debounce";

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
      setCooldown(prev => {
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

  const formatTime = seconds => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
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
      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
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
  const [isVerifying, setIsVerifying] = useState(true);
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
  const [redirecting, setRedirecting] = useState(false);
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
        let provider = sessionUser?.app_metadata?.provider || "";
        let providers = sessionUser?.app_metadata?.providers || [];

        // Fallback via getUser() als providers ontbreken
        if ((!provider || providers.length === 0) && sessionUser?.id) {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          if (userError) {
            error("⚠️ Fallback getUser() mislukt", { userError });
          } else {
            provider = userData?.user?.app_metadata?.provider || "";
            providers = userData?.user?.app_metadata?.providers || [];
            log("📦 Fallback via getUser() gebruikt", { provider, providers });
          }
        }

        // 🔍 Detecteer extreme fallback-situatie: email-user zonder metadata
        if (!provider && (!providers || providers.length === 0)) {
          log("ℹ️ Lege provider: klassieke email-user zonder metadata", {
            user: sessionUser,
          });
        }

        const isEmailUser = provider === "email" || providers.includes("email") || provider === ""; // fallback voor oudere of incomplete accounts

        setSession(data?.session || null);
        setIsEmailUser(isEmailUser);

        log("🔍 Auth provider gedetecteerd", {
          provider,
          providers,
          isEmailUser,
        });
      } catch (err) {
        error("🚨 Fout bij ophalen provider", { err });
      }
    };

    fetchProvider();
  }, []);

  useEffect(() => {
    const verifyFlow = async () => {
      try {
        setStatusCode(null);

        if (wasVerified.current) {
          log("✅ Token was already verified in localStorage", { token });
          const session = await waitForSession(10, 300);
          setSession(session);
          setTokenValid(true);
          return;
        }

        if (token) {
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

            // ✅ Stel sessie expliciet in met access/refresh tokens (indien aanwezig)
            if (data.access_token && data.refresh_token) {
              const { error: tokenError } = await supabase.auth.setSession({
                access_token: data.access_token,
                refresh_token: data.refresh_token,
              });

              if (tokenError) {
                error("❗ Kon sessie niet instellen na verificatie", { tokenError });
              } else {
                log("🟢 Sessietokens succesvol ingesteld na verificatie", {
                  access_token: data.access_token,
                });
              }
            } else {
              warn("⚠️ Geen tokens ontvangen uit verify-email.js", { data });
            }

            // ⚠️ Zorg dat een sessie actief is
            const session = await waitForSession(10, 300);
            if (!session) {
              warn("❗ Geen sessie na verificatie", {});
              setStatusCode("TOKEN_NOT_FOUND");
              return;
            }

            setSession(session);
            setTokenValid(true);
            return;
          }

          captureApiError("/api/verify-email", res, {
            errorCode: data?.code || "UNKNOWN_ERROR",
            response: data,
            token,
          });
          setStatusCode(data.code || "INTERNAL_ERROR");
        } else {
          const foundSession = await waitForSession();
          if (foundSession) {
            log("🟢 Sessie gevonden zonder token", {
              session: foundSession,
              hasToken: !!token,
              verified: wasVerified.current,
            });
            setTokenValid(true);
            setSession(foundSession);
          } else {
            warn("🔴 Geen token en geen sessie gevonden", { token });
            setStatusCode("TOKEN_NOT_FOUND");
          }
        }
      } catch (err) {
        error("Fout tijdens verifyFlow", { err });
        setStatusCode("INTERNAL_ERROR");
      } finally {
        setIsVerifying(false); // ✅ klaar met controleren
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

        const { data: artist, supabaseError } = await supabase
          .from("artists")
          .select("subdomain")
          .eq("user_id", user.id)
          .maybeSingle();

        if (supabaseError) {
          error("❌ Fout bij ophalen artist tijdens redirect", { supabaseError });
          return;
        }

        if (artist?.subdomain) {
          didRedirect.current = true;
          log("🔁 Reeds bestaand artist-profiel, redirect naar subsite", {
            subdomain: artist.subdomain,
          });

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
  }, [tokenValid, session]);

  const renderErrorMessage = () => {
    switch (statusCode) {
      case "TOKEN_EXPIRED":
        return (
          <div className="text-center">
            <h1 className="mt-16 text-xl font-semibold">
              {t("profile.verify_error.TOKEN_EXPIRED")}
            </h1>
            <ResendVerificationInline />
          </div>
        );
      case "TOKEN_NOT_FOUND":
      case "USER_NOT_FOUND":
        return (
          <div className="text-center">
            <h1 className="mt-16 text-xl font-semibold">
              {t("profile.verify_error.USER_NOT_FOUND")}
            </h1>
            <Button href="/register" className="btn btn-secondary mt-4">
              {t("profile.actions.register")}
            </Button>
          </div>
        );
      case "EMAIL_DUPLICATE":
        return (
          <div className="text-center">
            <h1 className="mt-16 text-xl font-semibold">
              {t("profile.verify_error.EMAIL_DUPLICATE")}
            </h1>
            <Button href="/login" className="btn btn-secondary mt-4">
              {t("profile.actions.login")}
            </Button>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <h1 className="mt-16 text-xl font-semibold">
              {t("profile.verify_error.INTERNAL_ERROR")}
            </h1>
          </div>
        );
    }
  };

  const checkSubdomainAvailability = useCallback(
    async sub => {
      const normalized = sub.trim().toLowerCase();
      log("🌐 Controle subdomein beschikbaarheid", { normalized });

      try {
        const { error, count } = await supabase
          .from("artists")
          .select("id", { count: "exact", head: true })
          .eq("subdomain", normalized);

        if (error) {
          warn("⚠️ Subdomein-check mislukt", { error });
          setSubdomainStatus("error");
          setSubdomainError(t("profile.verify_error.SUBDOMAIN_CHECK_FAILED"));
          return;
        }

        if (count > 0) {
          setSubdomainStatus("taken");
          setSubdomainError(t("profile.verify_error.SUBDOMAIN_TAKEN"));
        } else {
          setSubdomainStatus("available");
          setSubdomainError("");
        }
      } catch (err) {
        error("❌ Onverwachte fout bij subdomain-check", { err });
        setSubdomainStatus("error");
        setSubdomainError(t("profile.verify_error.INTERNAL_ERROR"));
      }
    },
    [t]
  );

  const debouncedCheckSubdomainAvailability = useMemo(() => {
    return debounce(checkSubdomainAvailability, 400);
  }, [checkSubdomainAvailability]);

  useEffect(() => {
    return () => debouncedCheckSubdomainAvailability.cancel();
  }, [debouncedCheckSubdomainAvailability]);

  const handleSubdomainInput = val => {
    const trimmed = val.trim().toLowerCase();
    setSubdomain(trimmed);
    setValidationSteps(getSubdomainValidationSteps(trimmed));
    setShowChecklist(trimmed.length > 0);

    const errorCode = validateSubdomain(trimmed);
    if (errorCode) {
      setSubdomainStatus("invalid");
      setSubdomainError(t(errorCode));
      return;
    }

    setSubdomainStatus("checking");
    setSubdomainError("");
    debouncedCheckSubdomainAvailability(trimmed);
  };

  const nameRegex = /^[\p{L}\p{M}](?!.*[-'\s]{2})[\p{L}\p{M}\s'-]{0,38}[\p{L}\p{M}]$/u;
  const emojiRegex = /\p{Extended_Pictographic}/u;

  const cleanName = name =>
    name
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[-'\s]{2,}/g, "")
      .replace(/^[-'\s]+|[-'\s]+$/g, "");
  const validateName = name => {
    const cleaned = cleanName(name);
    return (
      cleaned.length >= 2 &&
      cleaned.length <= 40 &&
      nameRegex.test(cleaned) &&
      !emojiRegex.test(cleaned)
    );
  };

  const handleFormSubmit = async e => {
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
        captureApiError("/api/profile", response, {
          errorCode: result?.code || "UNKNOWN_ERROR",
          result,
        });
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
  // <Spinner />
  // eventueel vervangen door
  // <div className="text-center text-gray-500">{t("profile.verifying")}</div>
  // of null
  return (
    <>
      <Seo
        title={t("profile.seo_title", { defaultValue: t("seo.title") })}
        description={t("profile.seo_description", { defaultValue: t("seo.description") })}
      />
      <SectionWrapper bgColor="bg-white">
        <div className="flex min-h-screen items-start justify-center py-24">
          {redirecting && (
            <div className="text-center text-gray-500">{t("profile.redirecting_message")}</div>
          )}
          {isVerifying ? (
            <Spinner />
          ) : tokenValid ? (
            <div className="mx-auto w-full max-w-xs">
              <div className="mb-6 text-center">
                <img src="/images/CRlogo.jpg" alt={t("profile.logo_alt")} className="mx-auto h-8" />
                <h1 className="mt-16 text-xl font-semibold">{t("profile.heading")}</h1>
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
                    onChange={e => {
                      const value = e.target.value;
                      setFirstName(value);
                      setFirstNameError(
                        !validateName(value) ? t("profile.first_name_invalid") : ""
                      );
                      log("🧪 Voornaam input", { firstName: value });
                    }}
                    aria-invalid={firstNameError ? "true" : "false"}
                    aria-describedby="firstName-error"
                    className={`input ${firstNameError ? "input-error" : ""}`}
                  />
                  {firstNameError && (
                    <p id="firstName-error" className="mt-1 text-xs text-red-500">
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
                    onChange={e => {
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
                    <p id="lastName-error" className="mt-1 text-xs text-red-500">
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
                      onChange={async e => {
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
                      <p className="mt-1 text-xs text-gray-500">
                        {t("profile.checkingPassword")}...
                      </p>
                    )}
                    {passwordError && (
                      <p id="password-error" className="mt-1 text-xs text-red-500">
                        {t(passwordError)}
                      </p>
                    )}
                  </div>
                )}

                {/* Subdomein */}
                <div className="my-6 flex items-center">
                  <hr className="flex-grow border-gray-300" />
                  <span className="px-3 text-gray-700">{t("profile.subdomain_heading")}</span>
                  <hr className="flex-grow border-gray-300" />
                </div>

                <p className="intro-text">{t("profile.subdomain_intro_text")}</p>

                <div className="space-y-1">
                  <div className="relative">
                    <Input
                      type="text"
                      name="subdomain"
                      placeholder={t("profile.subdomain_placeholder")}
                      value={subdomain}
                      onChange={e => handleSubdomainInput(e.target.value)}
                      className={`input w-full pr-28 ${subdomainStatus === "invalid" ? "input-error" : ""}`}
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transform text-sm text-gray-600">
                      {t("profile.subdomain_suffix")}
                    </span>
                    {subdomainError && (
                      <p className="mt-1 text-xs text-red-500">{subdomainError}</p>
                    )}
                  </div>

                  {/* ✅/❌ lijst met live feedback */}
                  {showChecklist && (
                    <ul className="mt-2 space-y-1 text-xs text-gray-600">
                      <li className={validationSteps.validChars ? "text-gray-400" : "text-red-500"}>
                        {validationSteps.validChars ? "✔" : "✖"}{" "}
                        {t("profile.subdomain_validation.validChars")}
                      </li>
                      <li
                        className={validationSteps.correctLength ? "text-gray-400" : "text-red-500"}
                      >
                        {validationSteps.correctLength ? "✔" : "✖"}{" "}
                        {t("profile.subdomain_validation.correctLength")}
                      </li>
                      <li
                        className={
                          validationSteps.startsCorrectly ? "text-gray-400" : "text-red-500"
                        }
                      >
                        {validationSteps.startsCorrectly ? "✔" : "✖"}{" "}
                        {t("profile.subdomain_validation.startsCorrectly")}
                      </li>
                      <li
                        className={validationSteps.endsCorrectly ? "text-gray-400" : "text-red-500"}
                      >
                        {validationSteps.endsCorrectly ? "✔" : "✖"}{" "}
                        {t("profile.subdomain_validation.endsCorrectly")}
                      </li>
                      <li
                        className={
                          validationSteps.notInBlocklist ? "text-gray-400" : "text-red-500"
                        }
                      >
                        {validationSteps.notInBlocklist ? "✔" : "✖"}{" "}
                        {t("profile.subdomain_validation.notInBlocklist")}
                      </li>
                    </ul>
                  )}
                </div>

                {formSuccess && <p className="text-center text-sm text-green-600">{formSuccess}</p>}
                {errorMsg && <p className="text-center text-sm text-red-500">{errorMsg}</p>}
                <Button type="submit" disabled={loading} className="btn btn-primary w-full">
                  {loading ? t("profile.button_busy") : t("profile.button_submit")}
                </Button>
              </form>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-xs">
              <img src="/images/CRlogo.jpg" alt={t("register.logo_alt")} className="mx-auto h-8" />
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
