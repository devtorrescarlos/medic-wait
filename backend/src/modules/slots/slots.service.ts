import Slot from "../../models/Slot";
import redisClient from "../../config/ioredis";
import { parse } from "date-fns";
import { invalidateDoctorSlotsCache } from "../../utils/invalidateCache";
import DoctorSchedule from "../../models/DoctorSchedule";


const parseTimeString = (timeStr: string, referenceDate: Date): Date => {
    return parse(timeStr, "HH:mm", referenceDate);
};


export const getAvailableSlots = async (doctorId: string, page: number, limit: number) => {
    const cachedAvailableSlots = await redisClient.get(`slots:available:${doctorId}:p:${page}:l:${limit}`);

    if (cachedAvailableSlots) {
        return JSON.parse(cachedAvailableSlots);
    }

    const { count, rows } = await Slot.findAndCountAll({
        where: {
            doctor_id: doctorId,
            is_active: true,
            is_available: true
        },
        limit,
        offset: (page - 1) * limit,
        order: [['start_time', 'ASC']]
    });

    if (count === 0) {
        throw { status: 404, message: "No se encontraron slots disponibles" };
    }

    const response = {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        slots: rows
    };

    await redisClient.set(`slots:available:${doctorId}:p:${page}:l:${limit}`, JSON.stringify(response), 'EX', 3600);

    return response;
}

export const getSlots = async (doctorId: string, page: number, limit: number, day?: string, date?: string) => {
    const cacheKey = `slots:${doctorId}:p:${page}:l:${limit}:d:${day || 'all'}:dt:${date || 'all'}`;

    const cachedSlots = await redisClient.get(cacheKey);
    if (cachedSlots) {
        return JSON.parse(cachedSlots);
    }

    const whereClause: any = { doctor_id: doctorId, is_active: true };
    if (date) {
        whereClause.date = date;
    }

    const includeClause: any = {
        model: DoctorSchedule,
        attributes: ['day_of_week']
    };
    if (day) {
        includeClause.where = { day_of_week: day };
    }

    const { count, rows } = await Slot.findAndCountAll({
        where: whereClause,
        include: [includeClause],
        limit,
        offset: (page - 1) * limit,
        order: [['start_time', 'ASC']]
    });

    if (rows.length === 0) {
        return {
            totalItems: 0,
            totalPages: 0,
            currentPage: page,
            slots: [],
            day_of_week: null
        };
    }

    const response = {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        slots: rows
    };

    await redisClient.set(cacheKey, JSON.stringify(response), 'EX', 3600);

    return response;
}

export const deleteSlot = async (slotId: string, doctorId: string) => {
    const slot = await Slot.findOne({
        where: {
            id: slotId,
            doctor_id: doctorId
        }
    });
    if (!slot) {
        throw {
            status: 404,
            message: "No se encontro el slot"
        }
    }

    if (slot.doctor_id !== doctorId) {
        throw {
            status: 403,
            message: "No tienes permiso para eliminar este slot"
        }
    }

    if (!slot.is_available) {
        throw {
            status: 400,
            message: "El slot ya está ocupado. Debes cancelar la cita primero."
        }
    }

    if (!slot.is_active) {
        throw {
            status: 400,
            message: "El slot ya está inactivo"
        }
    }

    await slot.update({ is_active: false });

    const remainingSlots = await Slot.count({
        where: {
            doctor_id: doctorId,
            schedule_id: slot.schedule_id
        }
    });

    if (remainingSlots === 0) {
        await DoctorSchedule.update(
            { is_active: false },
            {
                where: {
                    id: slot.schedule_id,
                    doctor_id: doctorId
                }
            }
        );
    }

    await invalidateDoctorSlotsCache(doctorId);
}

export const updateSlot = async (slotId: string, doctorId: string, start_time: string, end_time: string) => {
    const slot = await Slot.findOne({
        where: {
            id: slotId,
            doctor_id: doctorId
        }
    });
    if (!slot) {
        throw {
            status: 404,
            message: "No se encontro el slot"
        }
    }

    if (slot.doctor_id !== doctorId) {
        throw {
            status: 403,
            message: "No tienes permiso para actualizar este slot"
        }
    }

    if (!slot.is_available) {
        throw {
            status: 400,
            message: "El slot ya está ocupado. Debes cancelar la cita primero."
        }
    }

    const slotDate = new Date(slot.date);
    const newStartTime = parseTimeString(start_time, slotDate);
    const newEndTime = parseTimeString(end_time, slotDate);

    if (newStartTime >= newEndTime) {
        throw {
            status: 400,
            message: "La hora de inicio debe ser menor a la hora de fin"
        }
    }

    slot.start_time = newStartTime;
    slot.end_time = newEndTime;
    await slot.save();

    await invalidateDoctorSlotsCache(slot.doctor_id);
    return slot;
}   