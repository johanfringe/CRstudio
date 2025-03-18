// src/components/Seo.js :
import React from "react";
import { Helmet } from "react-helmet";
import { useI18next, useTranslation } from "gatsby-plugin-react-i18next";

const Seo = ({ title, description }) => {
  const { language, languages, originalPath } = useI18next();
  const { t } = useTranslation();

  const siteUrl = "https://crstudio.online";
  const finalTitle = title || t("seo.title");
  const finalDescription = description || t("seo.description");
  const canonicalUrl = `${siteUrl}/${language}${originalPath}`;
  const ogImage = `${siteUrl}/icons/default-og-image.jpg`;
  const ogimagealt = t("seo.ogimagealt");

  return (
    <Helmet>
      {/* Basis Metadata */}
      <html lang={language} />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta name="google" content="notranslate" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={`${language}_${language.toUpperCase()}`} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogimagealt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="CRstudio" />
      {/* Voor Instant Articles, na registratie als Facebook Developer */}
      {/* <meta property="ia:markup_url" content="https://example.com/instant-articles/markup" /> */}
      {/* <meta property="ia:markup_url_dev" content="https://example.com/dev-instant-articles/markup" /> */}
      {/* <meta property="ia:rules_url" content="https://example.com/instant-articles/rules" /> */}
      {/* <meta property="ia:rules_url_dev" content="https://example.com/dev-instant-articles/rules" /> */}

      {/* Twitter */}
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />

      {/* Multilingual Hreflang - Wat doet dit hier? */}
      {languages.map((lang) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${siteUrl}/${lang}${originalPath}`}
        />
      ))}
      
      {/* Favicon */}
      <link rel="icon" href="/icons/favicon.svg" type="image/svg+xml" />
      <link rel="icon" href="/icons/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="180x180" href="/icons/favicon-180x180.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/icons/favicon-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/icons/favicon-512x512.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
    </Helmet>
  );
};

export default Seo;