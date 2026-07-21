import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { slotsRegenerationQueue } from "./bullmq";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(slotsRegenerationQueue, {
      displayName: "Slots Regeneration",
    }),
  ],
  serverAdapter,
});

export default serverAdapter;
