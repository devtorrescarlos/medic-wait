import { Op } from "sequelize";
import Slot from "../../models/Slot";
import DoctorSchedule from "../../models/DoctorSchedule";
import db from "../../config/database";
import redisClient from "../../config/ioredis";
import { parseTimeString } from "../../utils";
import { invalidateDoctorSlotsCache } from "../../utils/invalidateCache";
import User from "../../models/User";
import Role from "../../models/Role";
import Specialty from "../../models/Specialty";

export const getAvailableSlots = async (
  doctorId: string,
  page: number,
  limit: number,
) => {
  const cachedAvailableSlots = await redisClient.get(
    `slots:available:${doctorId}:p:${page}:l:${limit}`,
  );

  if (cachedAvailableSlots) {
    return JSON.parse(cachedAvailableSlots);
  }

  const { count, rows } = await Slot.findAndCountAll({
    include: [
      {
        model: DoctorSchedule,
        where: { doctor_id: doctorId },
        attributes: ["doctor_id"],
      },
    ],
    where: {
      is_active: true,
      is_available: true,
    },
    limit,
    offset: (page - 1) * limit,
    order: [["start_time", "ASC"]],
  });

  if (count === 0) {
    throw { status: 404, message: "No se encontraron slots disponibles" };
  }

  const response = {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    slots: rows,
  };

  await redisClient.set(
    `slots:available:${doctorId}:p:${page}:l:${limit}`,
    JSON.stringify(response),
    "EX",
    3600,
  );

  return response;
};

export const getSlots = async (
  doctorId: string,
  page: number,
  limit: number,
  day?: string,
  date?: string,
  status?: string,
) => {
  const cacheKey = `slots:${doctorId}:p:${page}:l:${limit}:d:${day || "all"}:dt:${date || "all"}:st:${status || "all"}`;

  const cachedSlots = await redisClient.get(cacheKey);
  if (cachedSlots) {
    return JSON.parse(cachedSlots);
  }

  const scheduleInclude: any = {
    model: DoctorSchedule,
    where: { doctor_id: doctorId },
    attributes: ["day_of_week", "doctor_id"],
  };
  if (day) {
    scheduleInclude.where = { ...scheduleInclude.where, day_of_week: day };
  }

  const whereClause: any = { is_active: true };
  if (date) {
    whereClause.date = date;
  }
  if (status === "available") {
    whereClause.is_available = true;
  } else if (status === "booked") {
    whereClause.is_available = false;
  }

  const { count, rows } = await Slot.findAndCountAll({
    where: whereClause,
    include: [scheduleInclude],
    limit,
    offset: (page - 1) * limit,
    order: [
      [
        db.literal(`CASE 
        WHEN "schedule"."day_of_week" = 'monday' THEN 1
        WHEN "schedule"."day_of_week" = 'tuesday' THEN 2
        WHEN "schedule"."day_of_week" = 'wednesday' THEN 3
        WHEN "schedule"."day_of_week" = 'thursday' THEN 4
        WHEN "schedule"."day_of_week" = 'friday' THEN 5
        WHEN "schedule"."day_of_week" = 'saturday' THEN 6
        WHEN "schedule"."day_of_week" = 'sunday' THEN 7
        ELSE 8
    END`),
        "ASC",
      ],
      ["start_time", "ASC"],
    ],
  });

  if (rows.length === 0) {
    return {
      totalItems: 0,
      totalPages: 0,
      currentPage: page,
      slots: [],
      day_of_week: null,
    };
  }

  const response = {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    slots: rows,
  };

  await redisClient.set(cacheKey, JSON.stringify(response), "EX", 3600);

  return response;
};

export const deleteSlot = async (slotId: string, doctorId: string) => {
  const slot = await Slot.findOne({
    where: { id: slotId },
    include: [
      {
        model: DoctorSchedule,
        where: { doctor_id: doctorId },
        attributes: ["doctor_id", "id"],
      },
    ],
  });
  if (!slot) {
    throw {
      status: 404,
      message: "No se encontro el slot",
    };
  }

  if (!slot.is_available) {
    throw {
      status: 400,
      message: "El slot ya está ocupado. Debes cancelar la cita primero.",
    };
  }

  if (!slot.is_active) {
    throw {
      status: 400,
      message: "El slot ya está inactivo",
    };
  }

  await slot.update({ is_active: false });

  const remainingSlots = await Slot.count({
    where: {
      schedule_id: slot.schedule_id,
      is_active: true,
    },
  });

  if (remainingSlots === 0) {
    await DoctorSchedule.update(
      { is_active: false },
      {
        where: {
          id: slot.schedule_id,
          doctor_id: doctorId,
        },
      },
    );
  }

  await invalidateDoctorSlotsCache(doctorId);
};

export const updateSlot = async (
  slotId: string,
  doctorId: string,
  start_time: string,
  end_time: string,
) => {
  const slot = await Slot.findOne({
    where: { id: slotId },
    include: [
      {
        model: DoctorSchedule,
        where: { doctor_id: doctorId },
        attributes: ["doctor_id", "id"],
      },
    ],
  });
  if (!slot) {
    throw {
      status: 404,
      message: "No se encontro el slot",
    };
  }

  if (!slot.is_available) {
    throw {
      status: 400,
      message: "El slot ya está ocupado. Debes cancelar la cita primero.",
    };
  }

  const slotDate = new Date(slot.date);
  const newStartTime = parseTimeString(start_time, slotDate);
  const newEndTime = parseTimeString(end_time, slotDate);

  if (newStartTime >= newEndTime) {
    throw {
      status: 400,
      message: "La hora de inicio debe ser menor a la hora de fin",
    };
  }

  slot.start_time = newStartTime;
  slot.end_time = newEndTime;
  await slot.save();

  await invalidateDoctorSlotsCache(doctorId);
  return slot;
};
