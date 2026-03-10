import { Request, Response } from "express"
import * as generateSlotsService from "./slots.service"

export const generateSlots = async (req: Request, res: Response) => {

    const { startTime, endTime, durationMinutes } = req.body;
    const doctorId = req.doctorId;

    try {
        const slots = await generateSlotsService.generateSlots({ startTime, endTime, durationMinutes, doctorId: doctorId! });
        res.status(201).json({ message: `${slots.length} slots generados con éxito.`, slots });
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const getAvailableSlots = async (req: Request, res: Response) => {
    const { doctorId } = req.params;

    try {
        const slots = await generateSlotsService.getAvailableSlots(doctorId as string);
        res.status(200).json({ message: `${slots.length} slots disponibles.`, slots });
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }

}

export const updateSlotsById = async (req: Request, res: Response) => {
    const { slotId } = req.params;
    const { startTime, endTime } = req.body;
    const doctorId = req.doctorId;

    try {
        const newStartTime = new Date(startTime);
        const newEndTime = new Date(endTime);

        const slot = await generateSlotsService.updateSlotsById(
            slotId as string,
            doctorId!,
            newStartTime,
            newEndTime
        );

        res.status(200).json({ message: "Slot actualizado exitosamente.", slot });
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const deleteSlots = async (req: Request, res: Response) => {
    const { doctorId } = req.params;

    try {
        const slots = await generateSlotsService.deleteSlots(doctorId as string);
        res.status(200).json({ message: `${slots.length} slots eliminados con éxito.`, slots });
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const deleteSlotsById = async (req: Request, res: Response) => {
    const { slotId } = req.params;
    const doctorId = req.doctorId;

    try {
        const slot = await generateSlotsService.deleteSlotsById(slotId as string, doctorId!);
        res.status(200).json({ message: "Slot eliminado exitosamente.", slot });
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}