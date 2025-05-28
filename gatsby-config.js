// gatsby-config.js :
require("dotenv-flow").config({
  path: `${__dirname}/content/settings`,
  silent: false, // Zorgt ervoor dat fouten worden gelogd als variabelen niet worden geladen
});

// console.log("✅ .env-bestanden geladen uit:", `${__dirname}/content/settings`);
// console.log("🔑 Supabase URL:", process.env.GATSBY_SUPABASE_URL);
console.log(
  "🔑 Supabase Service Role Key:",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "✔️ Loaded" : "❌ Not Loaded"
);
// console.log("🔑 Turnstile Secret Key:", process.env.TURNSTILE_SECRET ? "✔️ Loaded" : "❌ Not Loaded");
// console.log("🔑 Turnstile Site Key:", process.env.GATSBY_TURNSTILE_SITE_KEY);
// console.log("🔑 Kickbox API Key:", process.env.KICKBOX_API_KEY);
// console.log("🔑 Redis URL:", process.env.REDIS_URL);
// console.log("🔑 Postmark API Key:", process.env.POSTMARK_API_KEY);
// console.log("🔍 Verbinding maken met Redis...");

const i18nConfig = require("./src/i18n/i18nConfig");
const robotsConfig = require("./src/config/robots-config.json");

module.exports = {
  siteMetadata: {
    title: `CRstudio`,
    description: `The most powerful tool for creating and managing catalogues raisonnés.`,
    author: `@crstudio`,
    siteUrl: `https://crstudio.online/`,
  },
  plugins: [
    // Gecombineerde configuratie voor gatsby-source-filesystem voor verschillende bronnen
    ...[
      { name: "locales", path: `${__dirname}/src/locales` }, // Meertalige JSON-bestanden
      { name: "utils", path: `${__dirname}/src/utils` }, // Seo
      { name: "images", path: `${__dirname}/content/images` }, // Afbeeldingen
      { name: "texts", path: `${__dirname}/content/texts` },
    ].map(({ name, path }) => {
      return {
        resolve: `gatsby-source-filesystem`,
        options: { name, path },
      };
    }),

    `gatsby-transformer-json`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-image`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-react-helmet`,

    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: "locales",
        languages: i18nConfig.supportedLngs,
        fallbackLanguage: i18nConfig.fallbackLng,
        defaultLanguage: "",
        siteUrl: process.env.SITE_URL || `https://crstudio.online`,
        i18nextOptions: {
          fallbackLng: i18nConfig.fallbackLng,
          supportedLngs: i18nConfig.supportedLngs,
          interpolation: i18nConfig.interpolation,
          detection: i18nConfig.detection,
        },
        redirect: true,
      },
    },

    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        output: "/sitemap.xml",
        excludes: ["/admin/*", "/drafts/*", "/preview/*", "/private/*"],
      },
    },

    {
      resolve: "gatsby-plugin-robots-txt",
      options: robotsConfig,
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
        icon: `static/icons/favicon-512x512.png`,
      },
    },
  ].filter(Boolean), // ✅ Voorkomt dat Gatsby een `false` plugin laadt en voorkomt fouten
};
