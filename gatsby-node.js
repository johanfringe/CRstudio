// gatsby-node.js :
require("dotenv-flow").config({
  path: `${__dirname}/content/settings`,
});
const path = require("path");

// ✅ Debugging: Log alleen in development of debug-mode
if (process.env.NODE_ENV === "development") {
  //console.log("✅ .env-bestanden geladen uit:", `${__dirname}/content/settings`);
  //console.log("✅ Actieve omgeving:", process.env.NODE_ENV);
}

// ✅ Controleer kritieke variabelen
if (!process.env.SENTRY_DSN && process.env.NODE_ENV === "production") {
  console.warn("⚠️ WAARSCHUWING: SENTRY_DSN ontbreekt in productie!");
}

// ✅ Webpack alias configuratie
exports.onCreateWebpackConfig = ({ actions }) => {
  const path = require("path");

  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"), // ✅ Zorgt ervoor dat @ verwijst naar /src
      },
    },
  });
};

// ✅ Gatsby's standaard API-exports
exports.onPreInit = () => {
  //console.log("✅ Gatsby Node.js script geladen");
};
