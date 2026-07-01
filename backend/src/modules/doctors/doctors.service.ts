import { Op } from "sequelize";
import User from "../../models/User";
import Role from "../../models/Role";
import Specialty from "../../models/Specialty";
import redisClient from "../../config/ioredis";
import Slot from "../../models/Slot";
import DoctorSchedule from "../../models/DoctorSchedule";
import Appointment from "../../models/Appointment";

export const getDoctors = async (
  page: number,
  limit: number,
  name?: string,
  email?: string,
  specialty?: string,
) => {
  const cacheKey = `doctors:p:${page}:l:${limit}:n:${name || "all"}:e:${email || "all"}:s:${specialty || "all"}`;
  const cachedDoctors = await redisClient.get(cacheKey);
  if (cachedDoctors) {
    return JSON.parse(cachedDoctors);
  }

  const whereClause: any = { is_approved_by_admin: true };
  if (name) {
    whereClause.full_name = { [Op.iLike]: `%${name}%` };
  }
  if (email) {
    whereClause.email = { [Op.iLike]: `%${email}%` };
  }
  if (specialty) {
    whereClause.specialty_id = specialty;
  }

  const { count, rows } = await User.findAndCountAll({
    where: whereClause,
    attributes: ["id", "full_name", "email", "specialty_id"],
    include: [
      {
        model: Role,
        through: { attributes: [] },
        where: { name: "doctor" },
        attributes: [],
      },
      {
        model: Specialty,
        attributes: ["id", "name"],
      },
    ],
    limit,
    offset: (page - 1) * limit,
    order: [["full_name", "ASC"]],
  });

  if (count === 0) {
    return {
      totalItems: 0,
      totalPages: 0,
      currentPage: page,
      doctors: [],
    };
  }

  const response = {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    doctors: rows,
  };

  await redisClient.set(cacheKey, JSON.stringify(response), "EX", 3600);

  return response;
};

export const getDoctorById = async (doctorId: string, patientId: string) => {
  const cacheKey = `doctor:profile:${doctorId}:${patientId}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const doctor = await User.findByPk(doctorId, {
    attributes: ["id", "full_name", "email", "specialty_id"],
    include: [
      {
        model: Role,
        through: { attributes: [] },
        where: { name: "doctor" },
        attributes: [],
      },
      {
        model: Specialty,
        attributes: ["id", "name"],
      },
    ],
  });

  if (!doctor) {
    throw { status: 404, message: "No se encontró el médico" };
  }

  const slots = await Slot.findAll({
    include: [
      {
        model: DoctorSchedule,
        where: { doctor_id: doctorId },
        attributes: ["day_of_week"],
      },
    ],
    where: { is_available: true, is_active: true },
    order: [
      ["date", "ASC"],
      ["start_time", "ASC"],
    ],
  });

  const dayOrder: Record<string, number> = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
    sunday: 6,
  };

  const slotsByDate = slots.reduce<
    Record<string, { date: string; dayName: string; slots: Slot[] }>
  >((acc, slot) => {
    const dateKey = slot.date;
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        dayName: slot.schedule.day_of_week,
        slots: [],
      };
    }
    acc[dateKey].slots.push(slot);
    return acc;
  }, {});

  const availableSlots = Object.values(slotsByDate).sort(
    (a, b) =>
      dayOrder[a.dayName] - dayOrder[b.dayName] || a.date.localeCompare(b.date),
  );

  const pendingAppointment = await Appointment.findOne({
    where: { doctor_id: doctorId, patient_id: patientId, status: "pending" },
    attributes: ["id", "status"],
  });

  const response = { doctor, availableSlots, pendingAppointment };

  await redisClient.set(cacheKey, JSON.stringify(response), "EX", 3600);

  return response;
};
