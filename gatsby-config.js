// gatsby-config.js :

require("dotenv").config({ path: `content/settings/.env` }); // Aangepaste locatie voor de .env
require("dotenv").config({ path: `content/settings/.env.${process.env.NODE_ENV}` }); // Dynamisch URL afhankelijk van de omgeving

const languages = require('./src/locales/languages');
const defaultLanguage = languages.find((lang) => lang.default).code;
const robotsConfig = require('./src/config/robots-config.json');

module.exports = {
  siteMetadata: {
    title: `CRstudio`,
    description: `The most powerful tool for creating and managing catalogues raisonnés.`,
    author: `@crstudio`,
    siteUrl: `https://crstudio.online/`,
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
         localeJsonSourceName: `locales`, // Map voor JSON-bestanden, Moet overeenkomen met de "name" in gatsby-source-filesystem
         languages: languages.map(lang => lang.code), // Dynamisch genereren van de talen
         defaultLanguage, // Standaardtaal, uit languages.js
         siteUrl: process.env.SITE_URL || `https://crstudio.online`, // Dynamische site URL !! zie .env
         i18nextOptions: {
            interpolation: {
               escapeValue: false, // React voert al escaping uit
            },
            detection: {
               order: ['path', 'htmlTag', 'cookie', 'navigator'],
               caches: ['cookie'], // Optioneel: caching in cookies
               // cookieName: 'gatsby-i18next-language', // Naam van de cookie, optioneel
            },
            fallbackLng: defaultLanguage,
            backend: {
              loadPath: `${__dirname}/src/locales/{{lng}}/{{ns}}.json`, // Pad naar vertalingsbestanden
            },
         },
         pages: [
          {
            matchPath: '/:lang/:rest*',
            getLanguageFromPath: true,
          },
        ]        
      },
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        output: "/sitemap.xml",
        excludes: ['/admin/*', '/drafts/*', '/preview/*', '/private/*'],
      },
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: robotsConfig
    },
    {
      resolve: `gatsby-plugin-manifest`, // Genereert naam en icoontje in de browser
      options: {
        name: `Catalogue Raisonné`,
        short_name: `CR`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `standalone`,
        icon: `content/images/icons/favicon-512x512.png`,
      },
    },
    `gatsby-transformer-json`,
    // Gecombineerde configuratie voor gatsby-source-filesystem voor verschillende bronnen
    ...[
      { name: "locales", path: `${__dirname}/src/locales` }, // Meertalige JSON-bestanden
      { name: "utils", path: `${__dirname}/src/utils` }, // Seo
      { name: "images", path: `${__dirname}/content/images` }, // Afbeeldingen
      { name: "icons", path: `${__dirname}/content/images/icons` },
      { name: "texts", path: `${__dirname}/content/texts` },
    ].map(({ name, path }) => {

      return {
        resolve: `gatsby-source-filesystem`,
        options: { name, path },
      };
    }),
  ],
};
