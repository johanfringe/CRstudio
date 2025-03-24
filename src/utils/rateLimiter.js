//src/utils/rateLimiter.js
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, { tls: {} });

export const rateLimit = async (key, limit = 5, expireTime = 60) => {
    const attempts = await redis.incr(key);
    if (attempts === 1) {
        await redis.expire(key, expireTime);
    }
    return attempts > limit;
};
