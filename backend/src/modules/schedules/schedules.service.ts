import DoctorSchedule from "../../models/DoctorSchedule";
import { Op } from "sequelize";
import { format, addDays, startOfDay, addMinutes } from "date-fns";
import Slot from "../../models/Slot";
import { ScheduleData } from "../../types/schedules.types";
import { invalidateDoctorSlotsCache } from "../../utils/invalidateCache";

const DAYS_TO_GENERATE = 14;

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

    const [startH, startM] = start_time.split(':').map(Number);
    const [endH, endM] = end_time.split(':').map(Number);
    const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);

    if (totalMinutes < slot_duration) {
        throw { status: 400, message: "El horario debe durar al menos lo que dure un slot" };
    }

    if (totalMinutes % slot_duration !== 0) {
        throw {
            status: 400,
            message: `El horario debe ser divisible por la duración del slot. Tiempo disponible: ${totalMinutes} min, duración del slot: ${slot_duration} min`
        };
    }

    const schedule = await DoctorSchedule.create({
        doctor_id: doctorId,
        day_of_week,
        start_time,
        end_time,
        slot_duration
    });

    const slotsCreated = await generateSlotsForSchedule(doctorId, schedule);

    return { schedule, slotsGenerated: slotsCreated };
};

const generateSlotsForSchedule = async (doctorId: string, schedule: DoctorSchedule) => {
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
                        schedule_id: schedule.id
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

    await invalidateDoctorSlotsCache(doctorId);

    return slotsCreated;
};


export const toggleSchedule = async (doctorId: string, scheduleId: string) => {
    const schedule = await DoctorSchedule.findOne({ where: { id: scheduleId, doctor_id: doctorId } });
    const today = format(new Date(), 'yyyy-MM-dd');
    if (!schedule) throw { status: 404, message: "Horario no encontrado" };

    if (schedule.is_active) {
        const occupiedSlotsCount = await Slot.count({
            where: {
                schedule_id: scheduleId,
                is_available: false,
                is_active: true,
                date: { [Op.gte]: today }
            }
        });

        if (occupiedSlotsCount > 0) {
            throw {
                status: 409,
                message: `No puedes desactivar el horario porque ya tienes citas agendadas ese día. Cancélalas primero.`
            };
        }
    }

    schedule.is_active = !schedule.is_active;
    await schedule.save();

    if (!schedule.is_active) {
        await Slot.update({
            is_active: false
        }, {
            where: {
                schedule_id: scheduleId,
                is_available: true,
                date: { [Op.gte]: today }
            }
        });
    }

    if (schedule.is_active) {
        await generateSlotsForSchedule(doctorId, schedule);
    }

    await invalidateDoctorSlotsCache(doctorId);

    return schedule;
}


export const updateSchedule = async (doctorId: string, scheduleId: string, scheduleData: ScheduleData) => {
    const schedule = await DoctorSchedule.findOne({ where: { id: scheduleId, doctor_id: doctorId } });

    if (!schedule) throw { status: 404, message: "Horario no encontrado" };

    if (schedule.day_of_week !== scheduleData.day_of_week) {
        throw { status: 409, message: "No puedes modificar el día del horario" };
    }

    if (scheduleData.start_time >= scheduleData.end_time) {
        throw { status: 409, message: "La hora de fin debe ser mayor a la hora de inicio" };
    }
    const today = format(new Date(), 'yyyy-MM-dd');

    if (schedule.is_active) {
        const occupiedSlotsCount = await Slot.count({
            where: {
                schedule_id: scheduleId,
                is_available: false,
                date: { [Op.gte]: today }
            }
        });

        if (occupiedSlotsCount > 0) {
            throw {
                status: 409,
                message: `No puedes modificar el horario porque ya tienes citas agendadas ese día. Cancélalas primero.`
            };
        }
    }

    schedule.start_time = scheduleData.start_time;
    schedule.end_time = scheduleData.end_time;
    await schedule.save();

    await Slot.update({
        is_active: false
    }, {
        where: {
            schedule_id: scheduleId,
            is_available: true
        }
    });

    await generateSlotsForSchedule(doctorId, schedule);

    await invalidateDoctorSlotsCache(doctorId);

    return schedule;
}

export const deleteScheduleAndSlots = async (doctorId: string, scheduleId: string) => {
    const schedule = await DoctorSchedule.findOne({ where: { id: scheduleId, doctor_id: doctorId } });

    if (!schedule) throw { status: 404, message: "Horario no encontrado" };

    const today = format(new Date(), 'yyyy-MM-dd');

    const occupiedSlotsCount = await Slot.count({
        where: {
            schedule_id: scheduleId,
            is_available: false,
            is_active: true,
            date: { [Op.gte]: today }
        }
    });

    if (occupiedSlotsCount > 0) {
        throw {
            status: 409,
            message: `No puedes eliminar el horario porque ya tienes citas agendadas ese día. Cancélalas primero.`
        };
    }

    await schedule.destroy();

    await Slot.update({
        is_active: false
    }, {
        where: {
            schedule_id: scheduleId,
            is_available: true
        }
    });

    await invalidateDoctorSlotsCache(doctorId);
};

export const getDoctorSchedulesByDoctorId = async (doctorId: string) => {
    const schedules = await DoctorSchedule.findAll({ where: { doctor_id: doctorId } });

    if (schedules.length === 0) {
        throw { status: 404, message: "No se encontraron horarios para el doctor" };
    }

    return schedules;
};

export const getDoctorSchedules = async (doctorId: string) => {
    const schedules = await DoctorSchedule.findAll({ where: { doctor_id: doctorId }, order: [["day_of_week", "ASC"]] });
    return schedules;
};