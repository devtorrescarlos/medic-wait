import { Queue } from "bullmq";
import redisClient from "./ioredis";

export const slotsRegenerationQueue = new Queue("slots-regeneration", {
  connection: redisClient,
  defaultJobOptions: {
    removeOnComplete: false,
    removeOnFail: 100,
  },
});
