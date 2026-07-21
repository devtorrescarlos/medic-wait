import { slotsRegenerationQueue } from "../config/bullmq";

const run = async () => {
  const job = await slotsRegenerationQueue.add("manual-test", {});
  console.log(`Job disparado con ID: ${job.id}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
