import DoctorSchedule from "../../models/DoctorSchedule";
import { Op } from "sequelize";
import { format, addDays, startOfDay, addMinutes } from "date-fns";
import redisClient from "../../config/redis";
import Slot from "../../models/Slot";
import { ScheduleData } from "../../types/schedules.types";

const DAYS_TO_GENERATE = 30;

export const createScheduleAndGenerateSlots = async (doctorId: string, scheduleData: ScheduleData) => {
    const { day_of_week, start_time, end_time, slot_duration } = scheduleData;

    const existingSchedule = await DoctorSchedule.findOne({
        where: { doctor_id: doctorId, day_of_week }
    });

    if (existingSchedule) {
        throw { status: 409, message: `Ya tienes un horario configurado para el día ${day_of_week}. Elimínalo primero para crear uno nuevo.` };
    }

    if (start_time >= end_time) {
        throw { status: 409, message: "La hora de fin debe ser mayor a la hora de inicio" };
    }

    const schedule = await DoctorSchedule.create({
        doctor_id: doctorId,
        day_of_week,
        start_time,
        end_time,
        slot_duration
    });

    const slotsCreated = await generateSlotsForSchedule(doctorId, schedule);

    const keys = await redisClient.keys(`slots:${doctorId}:*`);
    if (keys.length > 0) await redisClient.del(keys);
    await redisClient.del(`slots:available:${doctorId}`);

    return { schedule, slotsGenerated: slotsCreated };
};

export const generateSlotsForSchedule = async (doctorId: string, schedule: DoctorSchedule) => {
    const [startH, startM] = schedule.start_time.split(':').map(Number);
    const [endH, endM] = schedule.end_time.split(':').map(Number);
    const dayName = schedule.day_of_week.toLowerCase();

    const today = startOfDay(new Date());
    let slotsCreated = 0;
    const slotsToCreate: any[] = [];

    for (let i = 1; i <= DAYS_TO_GENERATE; i++) {
        const currentDay = addDays(today, i);
        const currentDayName = format(currentDay, 'EEEE').toLowerCase();

        if (currentDayName === dayName) {
            let slotStart = addMinutes(startOfDay(currentDay), startH * 60 + startM);
            const dayEnd = addMinutes(startOfDay(currentDay), endH * 60 + endM);

            while (slotStart < dayEnd) {
                const slotEnd = addMinutes(slotStart, schedule.slot_duration);

                if (slotEnd <= dayEnd) {
                    slotsToCreate.push({
                        doctor_id: doctorId,
                        start_time: slotStart,
                        end_time: slotEnd,
                        date: format(currentDay, 'yyyy-MM-dd'),
                        is_available: true,
                        version: 1
                    });
                }
                slotStart = slotEnd;
            }
        }
    }

    if (slotsToCreate.length > 0) {
        await Slot.bulkCreate(slotsToCreate);
        slotsCreated = slotsToCreate.length;
    }

    await redisClient.del(`slots:available:${doctorId}`);

    return slotsCreated;
};

export const deleteScheduleAndSlots = async (doctorId: string, scheduleId: string) => {
    const schedule = await DoctorSchedule.findOne({ where: { id: scheduleId, doctor_id: doctorId } });

    if (!schedule) throw { status: 404, message: "Horario no encontrado" };

    const dayToDelete = schedule.day_of_week.toLowerCase();
    const today = format(new Date(), 'yyyy-MM-dd');

    const occupiedSlots = await Slot.findAll({
        where: {
            doctor_id: doctorId,
            is_available: false,
            date: { [Op.gte]: today }
        }
    });


    const hasBookedAppointmentsOnThatDay = occupiedSlots.some(slot =>
        slot.date && format(new Date(slot.date), 'eeee').toLowerCase() === dayToDelete
    );

    if (hasBookedAppointmentsOnThatDay) {
        throw {
            status: 409,
            message: `No puedes eliminar el horario de los ${dayToDelete} porque ya tienes citas agendadas ese día. Cancélalas primero.`
        };
    }


    await schedule.destroy();


    const availableSlots = await Slot.findAll({
        where: {
            doctor_id: doctorId,
            is_available: true,
            date: { [Op.gte]: today }
        }
    });

    const idsToDelete = availableSlots
        .filter(slot => slot.date && format(new Date(slot.date), 'eeee').toLowerCase() === dayToDelete)
        .map(s => s.id);

    if (idsToDelete.length > 0) {
        await Slot.destroy({ where: { id: idsToDelete } });
    }

    await redisClient.del(`slots:available:${doctorId}`);
};