// src/components/layout/Seo.js
import React from "react";
import { Helmet } from "react-helmet";
import { useI18next, useTranslation } from "gatsby-plugin-react-i18next";

export default function Seo(props) {
  const { language, languages, originalPath } = useI18next();
  const { t } = useTranslation();

  const siteUrl = "https://crstudio.online";
  const title = t("seo.title");
  const description = t("seo.description");
  const canonicalUrl = `${siteUrl}/${language}${originalPath}`;
  const ogImage = `${siteUrl}/default-og-image.jpg`;

  const fonts = [
    "inter-v18-latin-regular",
    // "montserrat-v29-latin-regular",
    // "open-sans-v40-latin-regular",
    // "roboto-v47-latin-regular",
  ];

  return (
    <Helmet>
      {/* Basis Metadata */}
      <html lang={language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta name="google" content="notranslate" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={`${language}_${language.toUpperCase()}`} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="CRstudio" />

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />

      {/* Preloading fonts */}
      {fonts.map((font) => (
        <link
          key={font}
          rel="preload"
          href={`/fonts/${font}.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}

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
      <link rel="icon" href="/content/images/icons/favicon.svg" type="image/svg+xml" />
      <link rel="icon" href="/content/images/icons/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="16x16" href="/content/images/icons/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/content/images/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="180x180" href="/content/images/icons/favicon-180x180.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/content/images/icons/favicon-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/content/images/icons/favicon-512x512.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/content/images/icons/apple-touch-icon.png" />

    </Helmet>
  );
}