// gatsby-node.js :

// Als je de .env-bestanden gebruikt, blijven deze regel(s) meestal nodig:
require("dotenv").config({ path: `content/settings/.env` });
require("dotenv").config({ path: `content/settings/.env.${process.env.NODE_ENV}` });