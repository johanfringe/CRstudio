// pingRedis.js
// Houdt Redis-verbinding actief om cold starts te voorkomen bij Upstash

const { Redis } = require("@upstash/redis");

// 🔐 Beveilig gevoelige tokens in productie via .env of Netlify secrets
const redis = new Redis({
  url: "https://peaceful-feline-56159.upstash.io",
  token: "AdtfAAIjcDFmMzY4ZGFhYzdmZDI0NGMxYTdhOWYzM2Q0NmYyZWYxNnAxMA",
});

async function keepAlive() {
  try {
    const res = await redis.set("keepalive", Date.now());
    console.log("✅ Upstash Redis keepalive:", res);
    process.exit(0); // Succesvol afgesloten
  } catch (err) {
    console.error("❌ Redis keepalive mislukt:", err);
    process.exit(1); // Mislukt
  }
}

keepAlive();
