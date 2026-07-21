import DoctorSchedule from "../../models/DoctorSchedule";
import { Op } from "sequelize";
import { format, addDays, startOfDay, addMinutes } from "date-fns";
import Slot from "../../models/Slot";
import { ScheduleData } from "../../types/schedules.types";
import { invalidateDoctorSlotsCache } from "../../utils/invalidateCache";
import { toMinutes } from "../../utils/convertToMinutes";

const DAYS_TO_GENERATE = parseInt(process.env.SLOT_REGENERATION_DAYS || "7", 10);
const SLOT_DURATION = 60;

export const createScheduleAndGenerateSlots = async (
  doctorId: string,
  scheduleData: ScheduleData,
) => {
  const { day_of_week, start_time, end_time } = scheduleData;

  const existingSchedule = await DoctorSchedule.findOne({
    where: { doctor_id: doctorId, day_of_week },
  });

  if (existingSchedule) {
    throw {
      status: 409,
      message: `Ya tienes un horario configurado para el día ${day_of_week}. Elimínalo primero para crear uno nuevo.`,
    };
  }

  if (toMinutes(start_time) >= toMinutes(end_time)) {
    throw {
      status: 409,
      message: "La hora de fin debe ser mayor a la hora de inicio",
    };
  }

  const [startH, startM] = start_time.split(":").map(Number);
  const [endH, endM] = end_time.split(":").map(Number);
  const totalMinutes = endH * 60 + endM - (startH * 60 + startM);

  if (totalMinutes < SLOT_DURATION) {
    throw {
      status: 400,
      message: "El horario debe durar al menos lo que dure un slot",
    };
  }

  if (totalMinutes % SLOT_DURATION !== 0) {
    throw {
      status: 400,
      message: `El horario debe ser divisible por la duración del slot. Tiempo disponible: ${totalMinutes} min, duración del slot: ${SLOT_DURATION} min`,
    };
  }

  const schedule = await DoctorSchedule.create({
    doctor_id: doctorId,
    day_of_week,
    start_time,
    end_time,
  });

  const slotsCreated = await generateSlotsForSchedule(doctorId, schedule);

  return { schedule, slotsGenerated: slotsCreated };
};

const generateSlotsForSchedule = async (
  doctorId: string,
  schedule: DoctorSchedule,
) => {
  const [startH, startM] = schedule.start_time.split(":").map(Number);
  const [endH, endM] = schedule.end_time.split(":").map(Number);
  const dayName = schedule.day_of_week.toLowerCase();

  const today = startOfDay(new Date());
  let slotsCreated = 0;
  const slotsToCreate: any[] = [];

  for (let i = 1; i <= DAYS_TO_GENERATE; i++) {
    const currentDay = addDays(today, i);
    const currentDayName = format(currentDay, "EEEE").toLowerCase();

    if (currentDayName === dayName) {
      let slotStart = addMinutes(startOfDay(currentDay), startH * 60 + startM);
      const dayEnd = addMinutes(startOfDay(currentDay), endH * 60 + endM);

      while (slotStart < dayEnd) {
        const slotEnd = addMinutes(slotStart, SLOT_DURATION);

        if (slotEnd <= dayEnd) {
          slotsToCreate.push({
            schedule_id: schedule.id,
            start_time: slotStart,
            end_time: slotEnd,
            date: format(currentDay, "yyyy-MM-dd"),
            is_available: true,
            is_active: true,
          });
        }
        slotStart = slotEnd;
      }
    }
  }

  if (slotsToCreate.length > 0) {
    const uniqueDates = [...new Set(slotsToCreate.map((s: any) => s.date))];
    const existingSlots = await Slot.findAll({
      where: {
        schedule_id: schedule.id,
        is_active: true,
        date: { [Op.in]: uniqueDates },
      },
      attributes: ["date"],
    });
    const existingDates = new Set(existingSlots.map((s) => s.date));
    const filteredSlots = slotsToCreate.filter(
      (s: any) => !existingDates.has(s.date),
    );

    if (filteredSlots.length > 0) {
      await Slot.bulkCreate(filteredSlots);
      slotsCreated = filteredSlots.length;
    }
  }

  await invalidateDoctorSlotsCache(doctorId);

  return slotsCreated;
};

export const toggleSchedule = async (doctorId: string, scheduleId: string) => {
  const schedule = await DoctorSchedule.findOne({
    where: { id: scheduleId, doctor_id: doctorId },
  });
  const today = format(new Date(), "yyyy-MM-dd");
  if (!schedule) throw { status: 404, message: "Horario no encontrado" };

  if (schedule.is_active) {
    const occupiedSlotsCount = await Slot.count({
      where: {
        schedule_id: scheduleId,
        is_available: false,
        is_active: true,
        date: { [Op.gte]: today },
      },
    });

    if (occupiedSlotsCount > 0) {
      throw {
        status: 409,
        message: `No puedes desactivar el horario porque ya tienes citas agendadas ese día. Cancélalas primero.`,
      };
    }
  }

  schedule.is_active = !schedule.is_active;
  await schedule.save();

  if (!schedule.is_active) {
    await Slot.update(
      {
        is_active: false,
      },
      {
        where: {
          schedule_id: scheduleId,
          is_available: true,
          date: { [Op.gte]: today },
        },
      },
    );
  }

  if (schedule.is_active) {
    await generateSlotsForSchedule(doctorId, schedule);
  }

  await invalidateDoctorSlotsCache(doctorId);

  return schedule;
};

export const updateSchedule = async (
  doctorId: string,
  scheduleId: string,
  scheduleData: ScheduleData,
) => {
  const schedule = await DoctorSchedule.findOne({
    where: { id: scheduleId, doctor_id: doctorId },
  });

  if (!schedule) throw { status: 404, message: "Horario no encontrado" };

  if (schedule.day_of_week !== scheduleData.day_of_week) {
    throw { status: 409, message: "No puedes modificar el día del horario" };
  }

  if (toMinutes(scheduleData.start_time) >= toMinutes(scheduleData.end_time)) {
    throw {
      status: 409,
      message: "La hora de fin debe ser mayor a la hora de inicio",
    };
  }
  const today = format(new Date(), "yyyy-MM-dd");

  if (schedule.is_active) {
    const occupiedSlotsCount = await Slot.count({
      where: {
        schedule_id: scheduleId,
        is_available: false,
        is_active: true,
        date: { [Op.gte]: today },
      },
    });

    if (occupiedSlotsCount > 0) {
      throw {
        status: 409,
        message:
          "No puedes modificar el horario porque ya tienes citas agendadas ese día. Cancélalas primero.",
      };
    }
  }

  schedule.start_time = scheduleData.start_time;
  schedule.end_time = scheduleData.end_time;
  await schedule.save();

  await Slot.update(
    {
      is_active: false,
    },
    {
      where: {
        schedule_id: scheduleId,
        is_available: true,
      },
    },
  );

  await generateSlotsForSchedule(doctorId, schedule);

  await invalidateDoctorSlotsCache(doctorId);

  return schedule;
};

export const deleteScheduleAndSlots = async (
  doctorId: string,
  scheduleId: string,
) => {
  const schedule = await DoctorSchedule.findOne({
    where: { id: scheduleId, doctor_id: doctorId },
  });

  if (!schedule) throw { status: 404, message: "Horario no encontrado" };

  const today = format(new Date(), "yyyy-MM-dd");

  const occupiedSlotsCount = await Slot.count({
    where: {
      schedule_id: scheduleId,
      is_available: false,
      is_active: true,
      date: { [Op.gte]: today },
    },
  });

  if (occupiedSlotsCount > 0) {
    throw {
      status: 409,
      message: `No puedes eliminar el horario porque ya tienes citas agendadas ese día. Cancélalas primero.`,
    };
  }

  await schedule.update({
    is_active: false,
  });

  await Slot.update(
    {
      is_active: false,
    },
    {
      where: {
        schedule_id: scheduleId,
        is_available: true,
      },
    },
  );

  await invalidateDoctorSlotsCache(doctorId);
};

export const getDoctorSchedulesByDoctorId = async (doctorId: string) => {
  const schedules = await DoctorSchedule.findAll({
    where: { doctor_id: doctorId },
  });

  if (schedules.length === 0) {
    throw { status: 404, message: "No se encontraron horarios para el doctor" };
  }

  return schedules;
};

export const getDoctorSchedules = async (doctorId: string) => {
  const schedules = await DoctorSchedule.findAll({
    where: { doctor_id: doctorId },
    order: [["day_of_week", "ASC"]],
  });
  return schedules;
};
