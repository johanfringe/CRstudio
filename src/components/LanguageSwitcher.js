// src/components/LanguageSwitcher.js :
import { useState, useRef, useEffect } from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import languages from "../locales/languages";

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useI18next();
  const [isOpen, setIsOpen] = useState(false);
  const langMenuRef = useRef(null);

  // ✅ GlobeIcon
  const GlobeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  );

  // ✅ Sluit dropdown als je buiten klikt
  useEffect(() => {
    const handleClickOutside = event => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Taal wijzigen en opslaan
  const handleChangeLanguage = lang => {
    console.log("🌍 Probeer taal te wisselen naar", { lang });

    if (!languages.some(l => l.code === lang)) {
      console.warn("⚠️ Ongeldige taal", { lang });
      return;
    }

    changeLanguage(lang);
    console.log("✅ i18next heeft de taal gewijzigd naar", { lang });

    try {
      window.localStorage.setItem("i18nextLng", lang);
      console.log("💾 LocalStorage bijgewerkt", {
        lang: window.localStorage.getItem("i18nextLng"),
      });
    } catch (err) {
      console.warn("⚠️ Fout bij opslaan in localStorage", { err });
    }
  };

  return (
    <div className="relative" ref={langMenuRef}>
      {/* ✅ De knop is nu het enige interactieve element dat de dropdown opent */}
      <button
        className="flex w-full items-center justify-center text-sm text-gray-800 hover:text-black focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <GlobeIcon className="" />
        {language}
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-28 rounded-md bg-white shadow-lg"
          role="menu"
          aria-label="Language selection"
        >
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleChangeLanguage(lang.code)}
              className={`block w-full px-4 py-1 text-left text-sm ${
                language === lang.code ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`}
              role="menuitem"
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
