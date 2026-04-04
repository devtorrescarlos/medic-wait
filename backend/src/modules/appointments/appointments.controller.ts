import { Request, Response } from "express";
import * as appointmentService from "./appointments.service";


export const createAppointment = async (req: Request, res: Response) => {
    try {
        const { reason, slotId } = req.body;
        const patientId = req.patientId;
        const doctorId = req.query.doctorId as string;

        const appointment = await appointmentService.createAppointment(patientId as string, doctorId, reason, slotId);

        return res.status(201).json(appointment);
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const confirmAppointment = async (req: Request, res: Response) => {
    try {
        const appointmentId = req.params.appointmentId;
        const patientId = req.patientId;
        const appointment = await appointmentService.confirmAppointment(appointmentId as string, patientId as string);

        return res.status(200).json(appointment);
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        const appointmentId = req.params.appointmentId;
        const cancellationReason = req.body.cancellation_reason;

        const appointment = await appointmentService.cancelAppointment(appointmentId as string, cancellationReason);

        return res.status(200).json(appointment);
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const completeAppointment = async (req: Request, res: Response) => {
    try {
        const appointmentId = req.params.appointmentId;
        const doctorId = req.doctorId;

        const appointment = await appointmentService.completeAppointment(appointmentId as string, doctorId as string);

        return res.status(200).json(appointment);
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const getAppointmentById = async (req: Request, res: Response) => {
    try {
        const appointmentId = req.params.appointmentId;
        const appointment = await appointmentService.getAppointmentById(appointmentId as string);
        return res.status(200).json(appointment);
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const getAppointmentsByDoctorId = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const doctorId = req.doctorId;
        const appointments = await appointmentService.getAppointmentsByDoctorId(doctorId as string, page, limit);
        return res.status(200).json(appointments);
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const getAppointmentsByPatientId = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const patientId = req.patientId;
        const appointments = await appointmentService.getAppointmentsByPatientId(patientId as string, page, limit);
        return res.status(200).json(appointments);
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const getAllAppointments = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const appointments = await appointmentService.getAllAppointments(page, limit);
        return res.status(200).json(appointments);
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}
