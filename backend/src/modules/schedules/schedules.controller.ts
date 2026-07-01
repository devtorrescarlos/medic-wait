import { Request, Response } from "express";
import * as scheduleService from "./schedules.service";

export const createOrUpdateSchedule = async (req: Request, res: Response) => {
  try {
    const doctorId = req.doctorId;
    const result = await scheduleService.createScheduleAndGenerateSlots(
      doctorId as string,
      req.body,
    );
    res.status(201).json({
      message: `Horario configurado con éxito. Se generaron ${result.slotsGenerated} slots.`,
      schedule: result.schedule,
      slotsGenerated: result.slotsGenerated,
    });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const toggleSchedule = async (req: Request, res: Response) => {
  try {
    const doctorId = req.doctorId;
    const scheduleId = req.params.scheduleId;
    const result = await scheduleService.toggleSchedule(
      doctorId as string,
      scheduleId as string,
    );
    res
      .status(200)
      .json({ message: "Estado del horario actualizado", schedule: result });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const doctorId = req.doctorId;
    const scheduleId = req.params.scheduleId;
    const result = await scheduleService.updateSchedule(
      doctorId as string,
      scheduleId as string,
      req.body,
    );
    res
      .status(200)
      .json({ message: "Horario actualizado con éxito", schedule: result });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorSchedulesByDoctorId = async (
  req: Request,
  res: Response,
) => {
  try {
    const doctorId = req.params.doctorId;
    const schedules = await scheduleService.getDoctorSchedulesByDoctorId(
      doctorId as string,
    );
    res.status(200).json(schedules);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorSchedules = async (req: Request, res: Response) => {
  try {
    const doctorId = req.doctorId;
    const schedules = await scheduleService.getDoctorSchedules(
      doctorId as string,
    );
    res.status(200).json(schedules);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteScheduleAndSlots = async (req: Request, res: Response) => {
  const scheduleId = req.params.scheduleId;

  try {
    const doctorId = req.doctorId;
    await scheduleService.deleteScheduleAndSlots(
      doctorId as string,
      scheduleId as string,
    );
    res.status(200).json({ message: "Horario eliminado con éxito" });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
