import { Job } from "bullmq";
import DoctorSchedule from "../models/DoctorSchedule";
import Slot from "../models/Slot";
import Appointment from "../models/Appointment";
import User from "../models/User";
import db from "../config/database";
import { Op } from "sequelize";
import { format, addDays, startOfDay, addMinutes } from "date-fns";
import { invalidateDoctorSlotsCache } from "../utils/invalidateCache";
import { sendToUser } from "../config/websocket";
import * as notificationsService from "../modules/notifications/notifications.service";

const SLOT_DURATION = 60;
const DAYS_TO_GENERATE = parseInt(
  process.env.SLOT_REGENERATION_DAYS || "7",
  10,
);

export const processSlotRegeneration = async (job: Job) => {
  console.log("[SlotRegeneration] Job started:", job.id);

  const today = startOfDay(new Date());
  const todayStr = format(today, "yyyy-MM-dd");

  const activeSchedules = await DoctorSchedule.findAll({
    where: { is_active: true },
  });

  console.log(
    `[SlotRegeneration] Found ${activeSchedules.length} active schedules`,
  );

  let totalPendingCancelled = 0;
  let totalRemindersSent = 0;
  let totalSlotsCleaned = 0;
  let totalSlotsCreated = 0;

  for (const schedule of activeSchedules) {
    try {
      const pendingCancelled = await handlePendingAppointments(
        schedule.id,
        todayStr,
      );
      totalPendingCancelled += pendingCancelled;

      const remindersSent = await handleConfirmedReminders(
        schedule.id,
        todayStr,
        schedule.doctor_id,
      );
      totalRemindersSent += remindersSent;

      const slotsCleaned = await cleanupAvailableSlots(
        schedule.id,
        todayStr,
      );
      totalSlotsCleaned += slotsCleaned;

      const slotsCreated = await generateNewSlots(schedule, today);
      totalSlotsCreated += slotsCreated;

      await invalidateDoctorSlotsCache(schedule.doctor_id);

      console.log(
        `[SlotRegeneration] Schedule ${schedule.id} (${schedule.day_of_week}): ` +
          `${pendingCancelled} pending cancelled, ${remindersSent} reminders, ` +
          `${slotsCleaned} slots cleaned, ${slotsCreated} slots created`,
      );
    } catch (error: any) {
      console.error(
        `[SlotRegeneration] Error processing schedule ${schedule.id}:`,
        error.message || error,
      );
    }
  }

  const summary = {
    schedulesProcessed: activeSchedules.length,
    pendingCancelled: totalPendingCancelled,
    remindersSent: totalRemindersSent,
    slotsCleaned: totalSlotsCleaned,
    slotsCreated: totalSlotsCreated,
  };

  console.log("[SlotRegeneration] Job completed:", summary);
  return summary;
};

const handlePendingAppointments = async (
  scheduleId: string,
  todayStr: string,
): Promise<number> => {
  const pendingAppointments = await Appointment.findAll({
    where: { status: "pending" },
    include: [
      {
        model: Slot,
        required: true,
        where: {
          schedule_id: scheduleId,
          date: { [Op.lte]: todayStr },
        },
      },
    ],
  });

  for (const appointment of pendingAppointments) {
    const slot = appointment.slot;

    await db.transaction(async (t) => {
      await appointment.update(
        {
          status: "cancelled",
          cancellation_reason:
            "Auto-cancelada por el sistema: falta de confirmación",
        },
        { transaction: t },
      );
      await slot.update({ is_available: true }, { transaction: t });
    });

    const formattedDate = format(new Date(slot.start_time), "dd/MM/yyyy");

    const notification = await notificationsService.create(
      appointment.patient_id,
      "appointment_auto_cancelled",
      "Cita cancelada automáticamente",
      `La cita del ${formattedDate} ha sido cancelada debido a falta de confirmación`,
      appointment.id,
      "appointment",
    );

    sendToUser(appointment.patient_id, {
      type: "appointment_update",
      action: "auto_cancelled",
      appointmentId: appointment.id,
      notificationId: notification.id,
      title: "Cita cancelada automáticamente",
      message: `La cita del ${formattedDate} ha sido cancelada debido a falta de confirmación`,
    });
  }

  return pendingAppointments.length;
};

const handleConfirmedReminders = async (
  scheduleId: string,
  todayStr: string,
  doctorId: string,
): Promise<number> => {
  const confirmedAppointments = await Appointment.findAll({
    where: { status: "confirmed" },
    include: [
      {
        model: Slot,
        required: true,
        where: {
          schedule_id: scheduleId,
          date: { [Op.lte]: todayStr },
        },
      },
    ],
  });

  for (const appointment of confirmedAppointments) {
    const slot = appointment.slot;
    const patient = await User.findByPk(appointment.patient_id);

    const formattedDate = format(new Date(slot.start_time), "dd/MM/yyyy");
    const patientName = patient?.full_name || "el paciente";

    const notification = await notificationsService.create(
      doctorId,
      "appointment_completion_reminder",
      "Recordatorio: cita pendiente de completar",
      `La cita del ${formattedDate} con ${patientName} fue confirmada pero aún no ha sido completada. Por favor, confirma si el paciente asistió o cancela la cita.`,
      appointment.id,
      "appointment",
    );

    sendToUser(doctorId, {
      type: "appointment_update",
      action: "completion_reminder",
      appointmentId: appointment.id,
      notificationId: notification.id,
      title: "Recordatorio: cita pendiente de completar",
      message: `La cita del ${formattedDate} con ${patientName} fue confirmada pero aún no ha sido completada.`,
    });
  }

  return confirmedAppointments.length;
};

const cleanupAvailableSlots = async (
  scheduleId: string,
  todayStr: string,
): Promise<number> => {
  const [updatedCount] = await Slot.update(
    { is_active: false },
    {
      where: {
        schedule_id: scheduleId,
        is_available: true,
        date: { [Op.lte]: todayStr },
      },
    },
  );

  return updatedCount;
};

const generateNewSlots = async (
  schedule: DoctorSchedule,
  today: Date,
): Promise<number> => {
  const [startH, startM] = schedule.start_time.split(":").map(Number);
  const [endH, endM] = schedule.end_time.split(":").map(Number);
  const dayName = schedule.day_of_week.toLowerCase();

  const slotsToCreate: any[] = [];

  for (let i = 0; i < DAYS_TO_GENERATE; i++) {
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

  if (slotsToCreate.length === 0) return 0;

  const uniqueDates = [...new Set(slotsToCreate.map((s) => s.date))];
  const existingSlots = await Slot.findAll({
    where: {
      schedule_id: schedule.id,
      is_active: true,
      date: { [Op.in]: uniqueDates },
    },
    attributes: ["date"],
  });
  const existingDates = new Set(existingSlots.map((s) => s.date));
  const filteredSlots = slotsToCreate.filter((s) => !existingDates.has(s.date));

  if (filteredSlots.length > 0) {
    await Slot.bulkCreate(filteredSlots);
    return filteredSlots.length;
  }

  return 0;
};
