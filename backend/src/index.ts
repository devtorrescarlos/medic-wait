import app, { connectDB } from "./server";
import { attachWebSocketServer } from "./config/websocket";
import { createServer } from "node:http";
import { connectRedis } from "./config/ioredis";
import {
  startSlotRegenerationWorker,
  registerSlotRegenerationCron,
} from "./jobs";

const port = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();
  await connectRedis();

  startSlotRegenerationWorker();
  await registerSlotRegenerationCron();

  const httpServer = createServer(app);
  attachWebSocketServer(httpServer);

  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
startServer();
