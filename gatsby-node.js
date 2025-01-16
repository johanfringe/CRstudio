// Als je de .env-bestanden gebruikt, blijven deze regel(s) meestal nodig:
require("dotenv").config({ path: `content/settings/.env` });
require("dotenv").config({ path: `content/settings/.env.${process.env.NODE_ENV}` });

// VOORBEELD: als je geen andere logica nodig hebt, kan gatsby-node.js verder leeg blijven.
// Wil je andere Gatsby Node-API's gebruiken, voeg ze hier toe (bijv. createPages, onCreateWebpackConfig, etc.).

// Voorbeeld van iets anders (optioneel):
// exports.onCreateWebpackConfig = ({ actions }) => {
//   actions.setWebpackConfig({
//     // ...
//   });
// };
