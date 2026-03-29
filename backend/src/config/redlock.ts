import redisClient from "./ioredis";
import Redlock from "redlock";


// I'M USING REDIS V4, REDLOCK WORKS BETTER USING IOSREDIS SO I'LL UPDATE IT AS SOON AS POSSIBLE
export const redlock = new Redlock([redisClient as any], {
    driftFactor: 0.01,
    retryCount: 10,
    retryDelay: 200,
    retryJitter: 200
})