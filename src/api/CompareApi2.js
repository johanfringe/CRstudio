// src/pages/profile.js
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

const Profile = () => {
  const { t } = useTranslation();
  const [session, setSession] = useState(null);
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

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data?.session?.user;
        let userProvider = sessionUser?.app_metadata?.provider;

        if (!userProvider && sessionUser?.id) {
          const { data: userData, err } = await supabase.auth.getUser();
          if (err) {
            error("Fallback getUser() mislukt", { err });
          } else {
            userProvider = userData?.user?.app_metadata?.provider;
            log("📦 Fallback via getUser() gebruikt", { userProvider });
          }
        }

        const isEmail = userProvider
          ?.split(",")
          .map((p) => p.trim().toLowerCase())
          .includes("email");

        setSession(data?.session || null);
        setIsEmailUser(isEmail);
        log("🔍 Auth provider gedetecteerd", { userProvider, isEmail });
      } catch (err) {
        error("Fout bij ophalen provider", { err });
      }
    };

    fetchProvider();
  }, []);

  // De rest van je originele profielcode volgt hier zonder wijzigingen...
  return <div>...</div>;
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
