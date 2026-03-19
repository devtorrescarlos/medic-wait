import { Request, Response } from "express";
import * as slotsService from "./slots.service";

export const getSlots = async (req: Request, res: Response) => {
    try {
        const doctorId = req.doctorId;
        const slots = await slotsService.getSlots(doctorId!,);
        res.json(slots);
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const getAvailableSlots = async (req: Request, res: Response) => {
    try {
        const doctorId = req.params.doctorId;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const availableSlots = await slotsService.getAvailableSlots(doctorId as string, page, limit);
        res.json(availableSlots);
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const deleteSlot = async (req: Request, res: Response) => {
    try {
        const doctorId = req.doctorId;
        const slotId = req.params.slotId;
        const deletedSlot = await slotsService.deleteSlot(slotId as string, doctorId!);
        res.json(deletedSlot);
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const updateSlot = async (req: Request, res: Response) => {
    try {
        const doctorId = req.doctorId;
        const slotId = req.params.slotId;
        const { start_time, end_time } = req.body;
        const updatedSlot = await slotsService.updateSlot(slotId as string, doctorId!, start_time, end_time);
        res.json(updatedSlot);
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}
