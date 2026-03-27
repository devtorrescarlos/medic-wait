import app from "./server";
import { connectRedis } from "./config/redis";

const port = process.env.PORT || 4000;

connectRedis();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});