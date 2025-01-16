require("dotenv").config();

module.exports = {
  siteMetadata: {
    title: "CRStudio",
    description: "The ultimate tool for catalogues raisonnés.",
    siteUrl: "https://crstudio.online",
  },
  plugins: [
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locales`, // Bron voor JSON-bestanden
        languages: ["en", "fr", "nl"], // Beschikbare talen
        defaultLanguage: "en", // Standaardtaal
        siteUrl: process.env.SITE_URL || `https://crstudio.online`,
        i18nextOptions: {
          interpolation: {
            escapeValue: false, // React voert al escaping uit
          },
        },
        pages: [
          {
            matchPath: "/:lang/:rest*",
            getLanguageFromPath: true, // Detecteer taal uit URL
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `locales`,
        path: `${__dirname}/src/locales`, // Pad naar de taalbestanden
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
};
