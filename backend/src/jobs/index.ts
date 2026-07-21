import { Worker } from "bullmq";
import redisClient from "../config/ioredis";
import { slotsRegenerationQueue } from "../config/bullmq";
import { processSlotRegeneration } from "./slotRegeneration.job";

const CRON_EXPRESSION =
  process.env.SLOT_REGENERATION_CRON || "0 0 * * 0";

export const startSlotRegenerationWorker = () => {
  const worker = new Worker(
    "slots-regeneration",
    processSlotRegeneration,
    { connection: redisClient },
  );

  worker.on("completed", (job) => {
    console.log(
      `[SlotRegeneration] Job ${job.id} completed:`,
      job.returnvalue,
    );
  });

  worker.on("failed", (job, err) => {
    console.error(
      `[SlotRegeneration] Job ${job?.id} failed:`,
      err.message,
    );
  });
};

export const registerSlotRegenerationCron = async () => {
  const existingJobs = await slotsRegenerationQueue.getRepeatableJobs();
  for (const job of existingJobs) {
    await slotsRegenerationQueue.removeRepeatableByKey(job.key);
  }

  await slotsRegenerationQueue.add(
    "weekly-regeneration",
    {},
    { repeat: { pattern: CRON_EXPRESSION } },
  );

  console.log(
    `[SlotRegeneration] Cron registered: ${CRON_EXPRESSION}`,
  );
};
