import redisClient from "../config/ioredis";

export const invalidateDoctorSlotsCache = async (doctorId: string): Promise<void> => {
    const pattern = `slots*:${doctorId}*`;

    const keys: string[] = [];

    await new Promise<void>((resolve) => {
        const stream = redisClient.scanStream({ match: pattern, count: 100 });
        stream.on('data', (keysFound: string[]) => {
            keys.push(...keysFound);
        });
        stream.on('end', resolve);
    });

    if (keys.length > 0) {
        await redisClient.del(keys);
    }
};

export const invalidateAppointmentCache = async (userIds: string | string[]): Promise<void> => {
    const ids = Array.isArray(userIds) ? userIds : [userIds];

    const pattern = `appointments:all*`;

    const keys: string[] = [];

    await new Promise<void>((resolve) => {
        const stream = redisClient.scanStream({ match: pattern, count: 100 });
        stream.on('data', (keysFound: string[]) => {
            keys.push(...keysFound);
        });
        stream.on('end', resolve);
    });

    if (keys.length > 0) {
        await redisClient.del(keys);
    }

    for (const userId of ids) {
        const pattern = `appointments:${userId}*`;

        const keys: string[] = [];

        await new Promise<void>((resolve) => {
            const stream = redisClient.scanStream({ match: pattern, count: 100 });
            stream.on('data', (keysFound: string[]) => {
                keys.push(...keysFound);
            });
            stream.on('end', resolve);
        });

        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    }
}