import Slot from "../../models/Slot";
import { Op } from "sequelize";
import redisClient from "../../config/redis";
import { slotData } from "../../types/slots.types";

export const generateSlots = async (slotData: slotData) => {
    const startDate = new Date(slotData.startTime);
    const endDate = new Date(slotData.endTime);

    const existingSlots = await Slot.findAll({
        where: {
            doctor_id: slotData.doctorId,
            [Op.or]: [
                {
                    start_time: {
                        [Op.lt]: endDate
                    },
                    end_time: {
                        [Op.gt]: startDate
                    }
                }
            ]
        }
    });

    if (existingSlots.length > 0) {
        throw {
            status: 409,
            message: "Ya existen horarios registrados en este rango de tiempo"
        }
    }

    let slots = [];
    let currentPointer = new Date(slotData.startTime);
    const endPointer = new Date(slotData.endTime);

    while (currentPointer < endPointer) {
        let slotEnd = new Date(currentPointer.getTime() + slotData.durationMinutes * 60000);

        if (slotEnd <= endPointer) {
            slots.push({
                doctor_id: slotData.doctorId,
                start_time: new Date(currentPointer),
                end_time: slotEnd,
                is_available: true,
                version: 1
            });
        }

        currentPointer = slotEnd;
    }

    await Slot.bulkCreate(slots)

    return slots;
}

export const getAvailableSlots = async (doctorId: string) => {
    const cacheKey = `slots:available:${doctorId}`;

    const cachedSlots = await redisClient.get(cacheKey);

    if (cachedSlots) {
        return JSON.parse(cachedSlots);
    }

    const slots = await Slot.findAll({
        where: {
            doctor_id: doctorId,
            is_available: true
        }
    });

    if (slots.length > 0) {
        await redisClient.set(cacheKey, JSON.stringify(slots), {
            EX: 600
        });
    }

    return slots;
}

export const updateSlotsById = async (slotId: string, doctorId: string, newStartTime: Date, newEndTime: Date) => {
    const slot = await Slot.findByPk(slotId);

    if (!slot) {
        throw {
            status: 404,
            message: "Slot no encontrado"
        };
    }

    if (slot.doctor_id !== doctorId) {
        throw {
            status: 403,
            message: "No tienes permiso para editar este slot"
        };
    }

    if (!slot.is_available) {
        throw {
            status: 409,
            message: "No puedes editar un slot que no está disponible. Primero debes cancelarlo."
        };
    }

    const existingSlots = await Slot.findAll({
        where: {
            doctor_id: doctorId,
            id: { [Op.ne]: slotId },
            [Op.or]: [
                {
                    start_time: {
                        [Op.lt]: newEndTime
                    },
                    end_time: {
                        [Op.gt]: newStartTime
                    }
                }
            ]
        }
    });

    if (existingSlots.length > 0) {
        throw {
            status: 409,
            message: "Ya existen horarios registrados en este nuevo rango de tiempo"
        };
    }

    await slot.update({
        start_time: newStartTime,
        end_time: newEndTime,
        version: slot.version + 1
    });

    return slot;
}

export const deleteSlots = async (doctorId: string) => {
    const slots = await Slot.findAll({
        where: {
            doctor_id: doctorId
        }
    });

    if (slots.length === 0) {
        throw {
            status: 404,
            message: "No se encontraron slots para eliminar"
        };
    }

    const slotsAreAvailable = slots.every(slot => slot.is_available);

    if (slotsAreAvailable) {
        throw {
            status: 409,
            message: "No puedes eliminar un slot que está disponible. Primero debes cancelarlo."
        };
    }

    await Slot.destroy({
        where: {
            doctor_id: doctorId
        }
    });

    return slots;
}

export const deleteSlotsById = async (slotId: string, doctorId: string) => {
    const slot = await Slot.findByPk(slotId);

    if (!slot) {
        throw {
            status: 404,
            message: "Slot no encontrado"
        };
    }

    if (!slot.is_available) {
        throw {
            status: 409,
            message: "No puedes eliminar un slot que no está disponible. Primero debes cancelarlo."
        };
    }

    if (slot.doctor_id !== doctorId) {
        throw {
            status: 403,
            message: "No tienes permiso para eliminar este slot"
        };
    }

    await slot.destroy();

    return slot;
}