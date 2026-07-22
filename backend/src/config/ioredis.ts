import IORedis from "ioredis";

const redisClient = new IORedis(
  process.env.REDIS_URL || "redis://localhost:6379",
  {
    maxRetriesPerRequest: null,
    enableOfflineQueue: true,
    retryStrategy(times) {
      const delay = Math.min(times * 200, 5000);
      return delay;
    },
    keepAlive: 30000,
  },
);

redisClient.on("error", (err) => console.error("IORedis Error:", err));
redisClient.on("connect", () => console.log("IORedis: Connected successfully"));

export const connectRedis = async () => {
  if (redisClient.status !== "ready") {
    await new Promise<void>((resolve) => {
      redisClient.once("ready", resolve);
    });
  }
};

export default redisClient;
