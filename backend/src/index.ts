import app from "./server";
import { attachWebSocketServer } from "./config/websocket";
import { createServer } from "node:http";
import { connectRedis } from "./config/ioredis";

const port = process.env.PORT || 4000;

connectRedis();

const httpServer = createServer(app);

attachWebSocketServer(httpServer);

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});