require("dotenv").config({
  path: `content/settings/.env`, // Aangepaste locatie voor de .env
});

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
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          "/static/*": ["Cache-Control: public, max-age=31536000, immutable"], // Cache statische bestanden
        },
        allPageHeaders: ["X-Frame-Options: SAMEORIGIN", "X-Content-Type-Options: nosniff"],
        mergeSecurityHeaders: true,
        mergeCachingHeaders: true,
        generateMatchPathRewrites: true,
      },
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
        icon: `content/images/favicon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`,
      },
    },
    `gatsby-transformer-json`,
    // Gecombineerde configuratie voor gatsby-source-filesystem
    ...[
      { name: "languages", path: `${__dirname}/src/config/languages` },
      { name: "images", path: `${__dirname}/content/images` },
      { name: "texts", path: `${__dirname}/content/texts` },
    ].map(({ name, path }) => {
      // console.log(`Laden van bron: ${name}, pad: ${path}`); // Debug
      return {
        resolve: `gatsby-source-filesystem`,
        options: { name, path },
      };
    }),
  ],
};
