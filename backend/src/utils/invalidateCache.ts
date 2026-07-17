import redisClient from "../config/ioredis";

async function deleteKeysByPattern(pattern: string): Promise<void> {
  const keys: string[] = [];

  await new Promise<void>((resolve, reject) => {
    const stream = redisClient.scanStream({ match: pattern, count: 100 });
    stream.on("data", (found: string[]) => {
      keys.push(...found);
    });
    stream.on("end", resolve);
    stream.on("error", reject);
  });

  if (keys.length > 0) {
    await redisClient.del(keys);
  }
}

export const invalidateDoctorSlotsCache = async (
  doctorId: string,
): Promise<void> => {
  await deleteKeysByPattern(`slots:${doctorId}:*`);
};

export const invalidateAppointmentCache = async (
  userIds: string | string[],
): Promise<void> => {
  const ids = Array.isArray(userIds) ? userIds : [userIds];

  for (const userId of ids) {
    await deleteKeysByPattern(`appointments:*:${userId}:*`);
  }
};

export const invalidatePatientsCache = async (doctorId: string) => {
  await deleteKeysByPattern(`patients:${doctorId}:*`);
};

export const invalidateDoctorProfileCache = async (doctorId: string) => {
  await deleteKeysByPattern(`doctor:profile:${doctorId}*`);
};

export const invalidateMyDoctorsCache = async (patientId: string) => {
  await deleteKeysByPattern(`myDoctors:${patientId}:*`);
};
