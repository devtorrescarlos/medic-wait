import Appointment from "../../models/Appointment"
import User from "../../models/User"
import Slot from "../../models/Slot"
import DoctorSchedule from "../../models/DoctorSchedule"
import { redlock } from "../../config/redlock"
import redisClient from "../../config/ioredis";
import { notifyAppointmentChange } from "../../config/websocket";
import { Op } from "sequelize";
import { invalidateAppointmentCache, invalidateDoctorSlotsCache } from "../../utils/invalidateCache";
import { differenceInMinutes } from "date-fns";


export const createAppointment = async (patientId: string, doctorId: string, reason: string, slotId: string) => {

    const resource = `locks:appointment:${slotId}`;
    const ttl = 5000;
    let lock: any;

    try {
        lock = await redlock.acquire([resource], ttl);

        if (patientId === doctorId) {
            throw {
                status: 409,
                message: "No puedes agendar una cita contigo mismo"
            }
        }

        const patient = await User.findOne({
            where: { id: patientId }
        })

        if (!patient) {
            throw {
                status: 404,
                message: "El paciente no existe"
            }
        }

        const existingAppointment = await Appointment.findOne({
            where: {
                doctor_id: doctorId,
                slot_id: slotId,
                patient_id: patientId,
            }
        })

        if (existingAppointment && existingAppointment.doctor_id === doctorId) {
            throw {
                status: 409,
                message: "Ya tienes una cita en ese bloque de horas"
            }
        }

        const slot = await Slot.findOne({
            where: {
                id: slotId,
                is_available: true,
                is_active: true
            },
            include: [{
                model: DoctorSchedule,
                where: { doctor_id: doctorId },
                attributes: ['doctor_id']
            }]
        })

        if (!slot) {
            throw {
                status: 404,
                message: "El bloque de horas no existe o no está disponible"
            }
        }

        await slot.update({ is_available: false });


        const newAppointment = await Appointment.create({
            patient_id: patientId,
            doctor_id: doctorId,
            slot_id: slotId,
            reason,
            status: "pending"
        })

        await notifyAppointmentChange(newAppointment, "created", patientId);
        await invalidateDoctorSlotsCache(doctorId);
        await invalidateAppointmentCache([patientId, doctorId]);

        return newAppointment;
    } catch (error) {
        if (error instanceof Error && error.name === "ExecutionError") {
            throw { status: 423, message: "El horario está siendo procesado, intenta en unos segundos" };
        }
        throw error;
    } finally {
        if (lock) {
            await lock.release().catch((error: any) => {
                console.error("Error al liberar el lock de Redis:", error);
            });
        }
    }


}

export const confirmAppointment = async (appointmentId: string, patientId: string) => {
    const appointment = await Appointment.findOne({
        where: {
            id: appointmentId,
            patient_id: patientId,
        }
    })

    if (!appointment) {
        throw {
            status: 404,
            message: "La cita no existe"
        }
    }

    if (appointment.status === "confirmed") {
        throw {
            status: 400,
            message: "La cita ya ha sido confirmada"
        }
    }

    if (appointment.status === "cancelled") {
        throw {
            status: 400,
            message: "La cita no se puede confirmar porque ya ha sido cancelada"
        }
    }

    await appointment.update({ status: "confirmed" });

    await notifyAppointmentChange(appointment, "confirmed", patientId);
    await invalidateAppointmentCache([patientId]);

    return appointment;
}

export const cancelAppointment = async (appointmentId: string, cancellationReason: string, userId: string) => {
    const appointment = await Appointment.findOne({
        where: {
            id: appointmentId
        }
    })


    if (!appointment) {
        throw {
            status: 404,
            message: "La cita no existe"
        }
    }

    if (appointment.status === "cancelled") {
        throw {
            status: 400,
            message: "La cita ya ha sido cancelada"
        }
    }

    if (appointment.patient_id !== userId && appointment.doctor_id !== userId) {
        throw {
            status: 403,
            message: "No tienes permiso para cancelar esta cita"
        }
    }

    const assignedSlot = await Slot.findOne({
        where: {
            id: appointment.slot_id
        }
    })


    if (!assignedSlot) {
        throw {
            status: 404,
            message: "El bloque de horas no existe"
        }
    }

    const now = new Date();
    const minutesRemaining = differenceInMinutes(assignedSlot.start_time, now);

    if (minutesRemaining < 30) {
        throw {
            status: 403,
            message: "No puedes cancelar la cita con menos de 30 minutos de anticipación."
        }
    }

    await appointment.update({
        status: "cancelled",
        cancellation_reason: cancellationReason || null
    })

    await assignedSlot.update({ is_available: true });

    await notifyAppointmentChange(appointment, "cancelled", appointment.patient_id);
    await invalidateDoctorSlotsCache(appointment.doctor_id);
    await invalidateAppointmentCache([appointment.patient_id, appointment.doctor_id]);

    return appointment;
}

export const completeAppointment = async (appointmentId: string, doctorId: string) => {
    const appointment = await Appointment.findOne({
        where: {
            id: appointmentId,
            doctor_id: doctorId,
        }
    })

    if (!appointment) {
        throw {
            status: 404,
            message: "La cita no existe"
        }
    }

    if (appointment.status === "completed") {
        throw {
            status: 400,
            message: "La cita ya ha sido completada"
        }
    }

    if (appointment.status === "cancelled") {
        throw {
            status: 400,
            message: "La cita no se puede completar porque ya ha sido cancelada"
        }
    }

    await appointment.update({ status: "completed" });

    await Slot.update({
        is_active: false,
    }, {
        where: {
            id: appointment.slot_id
        }
    })

    await notifyAppointmentChange(appointment, "completed", doctorId);
    await invalidateDoctorSlotsCache(doctorId);
    await invalidateAppointmentCache([doctorId]);

    return appointment;
}

export const getAppointmentById = async (appointmentId: string) => {
    const appointment = await Appointment.findOne({
        where: {
            id: appointmentId,
        },
        include: [
            { model: User, as: 'patient', attributes: ['id', 'full_name', 'email'] },
            { model: User, as: 'doctor', attributes: ['id', 'full_name'] },
            { model: Slot }
        ]
    })

    if (!appointment) {
        throw {
            status: 404,
            message: "La cita no existe"
        }
    }

    return appointment;
}

export const getAppointmentWithDetails = async (appointmentId: string) => {
    const appointment = await Appointment.findOne({
        where: { id: appointmentId },
        include: [
            { model: User, as: 'patient', attributes: ['id', 'full_name', 'email'] },
            { model: User, as: 'doctor', attributes: ['id', 'full_name'] },
            { model: Slot }
        ]
    })

    if (!appointment) {
        throw { status: 404, message: "La cita no existe" };
    }

    return appointment;
}

export const getAppointmentsByDoctorId = async (doctorId: string, page: number, limit: number) => {

    const cacheKey = `appointments:${doctorId}:${page}:${limit}`;
    const cachedAppointments = await redisClient.get(cacheKey);

    if (cachedAppointments) {
        return JSON.parse(cachedAppointments);
    }

    const { count, rows } = await Appointment.findAndCountAll({
        where: {
            doctor_id: doctorId,
        },
        include: [
            { model: User, as: 'patient', attributes: ['id', 'full_name', 'email'] },
            { model: Slot }
        ],
        limit,
        offset: (page - 1) * limit,
        order: [['created_at', 'DESC']]
    });

    if (rows.length === 0) {
        return {
            totalItems: 0,
            totalPages: 0,
            currentPage: page,
            appointments: [],
        };
    }

    const response = {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        appointments: rows,
    };

    await redisClient.setex(cacheKey, 3600, JSON.stringify(response));

    return response;
}

export const getAppointmentsByPatientId = async (patientId: string, page: number, limit: number) => {

    const cacheKey = `appointments:${patientId}:${page}:${limit}`;
    const cachedAppointments = await redisClient.get(cacheKey);

    if (cachedAppointments) {
        return JSON.parse(cachedAppointments);
    }

    const { count, rows } = await Appointment.findAndCountAll({
        where: {
            patient_id: patientId,
        },
        include: [
            { model: User, as: 'doctor', attributes: ['id', 'full_name'] },
            { model: Slot }
        ],
        limit,
        offset: (page - 1) * limit,
        order: [['created_at', 'DESC']]
    });

    if (rows.length === 0) {
        return {
            totalItems: 0,
            totalPages: 0,
            currentPage: page,
            appointments: [],
        };
    }

    const response = {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        appointments: rows,
    };

    await redisClient.setex(cacheKey, 3600, JSON.stringify(response));

    return response;

}

export const getAllAppointments = async (page: number, limit: number, patient: string, date: string, status: string, doctorId: string) => {

    const cacheKey = `appointments:all:${page}:${limit}:p:${patient}:d:${date}:s:${status}`;
    const cachedAppointments = await redisClient.get(cacheKey);

    if (cachedAppointments) {
        return JSON.parse(cachedAppointments);
    }

    const whereClause: any = {};
    if (date) {
        whereClause.date = date;
    }
    if (status) {
        whereClause.status = status;
    }

    const includeClause: any[] = [
        { model: User, as: 'patient', attributes: ['id', 'full_name', 'email'] },
        { model: User, as: 'doctor', attributes: ['id', 'full_name'] },
        { model: Slot }
    ];

    if (patient) {
        includeClause[0].where = { full_name: { [Op.iLike]: `%${patient}%` } };
    }

    const { count, rows } = await Appointment.findAndCountAll({
        where: { ...whereClause, doctor_id: doctorId },
        include: includeClause,
        limit,
        offset: (page - 1) * limit,
        order: [['created_at', 'DESC']]
    });

    if (rows.length === 0) {
        return {
            totalItems: 0,
            totalPages: 0,
            currentPage: page,
            appointments: [],
        };
    }

    const response = {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        appointments: rows,
    };

    await redisClient.setex(cacheKey, 3600, JSON.stringify(response));

    return response;
}