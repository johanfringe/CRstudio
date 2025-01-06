import React from "react";
import { Helmet } from "react-helmet";

const SEO = ({
  title,
  description,
  lang = "en",
  canonical,
  hreflangs,
  ogImage,
  twitterCard,
  jsonLd,
}) => {
  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {hreflangs &&
        hreflangs.map(({ href, hreflang }) => (
          <link key={hreflang} rel="alternate" href={href} hreflang={hreflang} />
        ))}
      {twitterCard && <meta name="twitter:card" content={twitterCard} />}
      {twitterCard && <meta name="twitter:title" content={title} />}
      {twitterCard && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
