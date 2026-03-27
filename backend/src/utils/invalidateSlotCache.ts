import redisClient from "../config/redis";

export const invalidateDoctorSlotsCache = async (doctorId: string): Promise<void> => {
    const pattern = `slots*:${doctorId}*`;

    const keys = await redisClient.keys(pattern);

    if (keys.length > 0) {
        await redisClient.del(keys);
    }
};