// gatsby-browser.js :
import "./src/styles/global.css";
import * as Sentry from "@sentry/react";
import { wrapPageElement as wrap } from "./src/i18n/wrapPageElement";
import i18n from "./src/i18n/i18n";
import i18nConfig from "./src/i18n/i18nConfig";
import { log, warn, error } from "./src/utils/logger";
import { initSentry } from "./src/utils/sentryInit";

// ✅ SENTRY INITIALISATIE
if (typeof window !== "undefined") {
initSentry({ mode: "browser" });

// ✅ Testfunctie beschikbaar maken in browser
window.SENTRY_TEST = () => {
const testError = new Error("🧪 Manueel getriggerde testfout via SENTRY_TEST()");
error("🧪 Manueel testfout gegenereerd via SENTRY_TEST()", { testError });
};

// ✅ Ongecontroleerde globale errors loggen
window.onerror = (message, source, lineno, colno, err) => {
warn("🛑 Globale fout opgevangen", message, { source, lineno, colno, err });
if (typeof Sentry?.captureException === "function" && err instanceof Error) {
Sentry.captureException(err, {
extra: { source, lineno, colno },
});
}
};
}

log("✅ gatsby-browser.js werd volledig geladen");

// ✅ Gatsby Lifecycle: wrapPageElement
export const wrapPageElement = wrap;

// ✅ Helper: zet document <html lang> attribuut veilig
const setDocumentLang = (lang) => {
if (typeof document !== "undefined" && document.documentElement.lang !== lang) {
document.documentElement.lang = lang;
log("🌍 <html lang> ingesteld op", { lang });
}
};

// ✅ Snelle browser-taaldetectie vóór React hydration
export const onClientEntry = () => {
if (typeof window === "undefined") return;

try {
const supportedLangs = i18nConfig.supportedLngs;
const fallbackLng = i18nConfig.fallbackLng;

let browserLang;
try {
browserLang = (navigator.languages && navigator.languages.length
? navigator.languages[0]
: navigator.language || fallbackLng
).split("-")[0];
} catch (err) {
warn("⚠️ Browsertaaldetectie faalde", { err });
browserLang = fallbackLng;
}

const finalLang = supportedLangs.includes(browserLang) ? browserLang : fallbackLng;

try {
const storedLang = window.localStorage.getItem("i18nextLng");

if (!storedLang || !supportedLangs.includes(storedLang)) {
window.localStorage.setItem("i18nextLng", finalLang);
log("💾 Taal opgeslagen in localStorage", { finalLang });
}
} catch (err) {
warn("⚠️ localStorage niet toegankelijk bij taalopslag", { err });
}

// ✅ Zet document lang onmiddellijk
setDocumentLang(finalLang);

} catch (err) {
error("⚠️ Taalinitialisatie in onClientEntry faalde", { err });
}
};

// ✅ Taalwisseling ná React hydration
export const onInitialClientRender = () => {
if (typeof window === "undefined") return;

try {
const supportedLangs = i18nConfig.supportedLngs;
const fallbackLng = i18nConfig.fallbackLng;
const storedLang = window.localStorage.getItem("i18nextLng");
const finalLang = supportedLangs.includes(storedLang) ? storedLang : fallbackLng;

// 🌐 i18next taal wisselen ná hydration, om React hydration errors te vermijden
const applyLanguageChange = () => {
if (i18n.language !== finalLang) {
console.time("⏱️ i18n.changeLanguage");
i18n.changeLanguage(finalLang)
.then(() => {
console.timeEnd("⏱️ i18n.changeLanguage");
log("✅ i18n taal succesvol gewijzigd naar", { finalLang });
})
.catch((err) => {
error("⚠️ i18n taalwijziging faalde", { err });
});
}
};
if (typeof requestAnimationFrame !== "undefined") {
requestAnimationFrame(() => setTimeout(applyLanguageChange, 0));
} else {
setTimeout(applyLanguageChange, 0);
} 

} catch (err) {
error("⚠️ Taalinitialisatie in onInitialClientRender faalde", { err });
}
};

