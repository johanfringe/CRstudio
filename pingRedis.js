// pingRedis.js
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://peaceful-feline-56159.upstash.io",
  token: "AdtfAAIjcDFmMzY4ZGFhYzdmZDI0NGMxYTdhOWYzM2Q0NmYyZWYxNnAxMA",
});

async function keepAlive() {
  const res = await redis.set("keepalive", Date.now());
  console.log("Upstash Redis aangeroepen:", res);
}

keepAlive();
