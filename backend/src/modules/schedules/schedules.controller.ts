import { Request, Response } from "express"
import * as scheduleService from "../schedules/schedules.service";

export const createOrUpdateSchedule = async (req: Request, res: Response) => {
    try {
        const doctorId = req.doctorId;
        const result = await scheduleService.createScheduleAndGenerateSlots(doctorId!, req.body);
        res.status(201).json({ 
            message: `Horario configurado con éxito. Se generaron ${result.slotsGenerated} slots.`, 
            schedule: result.schedule,
            slotsGenerated: result.slotsGenerated
        });
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const deleteScheduleAndSlots = async (req: Request, res: Response) => {

    const scheduleId = req.params.scheduleId;

    try {
        const doctorId = req.doctorId;
        await scheduleService.deleteScheduleAndSlots(doctorId!, scheduleId as string);
        res.status(200).json({ message: "Horario eliminado con éxito" });
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}