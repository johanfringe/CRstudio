// src/utils/turnstile.js :
export const loadTurnstile = (callback) => {
  if (typeof window === "undefined") return;

  const siteKey = process.env.GATSBY_TURNSTILE_SITE_KEY;
  
  console.log("🔍 Turnstile Site Key from env:", siteKey);

  if (!siteKey) {
    console.error("🚨 ERROR: Turnstile site key is undefined! Check .env file.");
    return;
  }

  const script = document.createElement("script");
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
  script.async = true;
  script.defer = true;
  script.onload = () => {
    window.turnstile.render("#turnstile-container", {
      sitekey: siteKey,
      callback,
    });
  };

  document.body.appendChild(script);
};
