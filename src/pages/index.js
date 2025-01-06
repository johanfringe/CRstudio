import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageProvider";
import Layout from "../components/Layout";

const languages = [
  { code: "da", label: "Dansk" },
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "hu", label: "Magyar" },
  { code: "nl", label: "Nederlands" },
  { code: "pl", label: "Polski" },
  { code: "pt", label: "Português" },
  { code: "ro", label: "Română" },
  { code: "ru", label: "Русский" },
  { code: "sv", label: "Svenska" },
  { code: "tr", label: "Türkçe" },
  { code: "uk", label: "Українська" },
  { code: "cs", label: "Čeština" },
  { code: "el", label: "Ελληνικά" },
  { code: "ar", label: "العربية" },
  { code: "bn", label: "বাংলা" },
  { code: "hi", label: "हिंदी" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "ur", label: "اُردُو" },
];

const IndexPage = () => {
  const { language, switchLanguage } = useContext(LanguageContext);

  if (!language) {
    return (
      <main style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f8ff" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", // Responsieve kolommen
            gap: "20px", // Ruimte tussen knoppen
            width: "80%", // Beperk de breedte van de grid-container
            maxWidth: "900px", // Maximaal 6 kolommen (150px x 6 = 900px)
            justifyContent: "center",
          }}
        >
          {languages.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => switchLanguage(code)}
              style={{
                backgroundColor: "#1D4ED8",
                color: "white",
                padding: "15px 15px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </main>
    );
  }

  return (
    <Layout>
      <section className="text-center py-16 bg-gray-50">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Welcome to CRstudio
          </h1>
          <p className="text-lg text-gray-600">
            The selected language is:{" "}
            <span className="font-medium text-blue-600">{language}</span>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default IndexPage;
