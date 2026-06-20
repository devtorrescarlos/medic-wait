import { Request, Response } from "express";
import * as slotsService from "./slots.service";

export const getSlots = async (req: Request, res: Response) => {
  try {
    const doctorId = req.doctorId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const day = req.query.day as string;
    const date = req.query.date as string;
    const status = req.query.status as string;
    const slots = await slotsService.getSlots(
      doctorId as string,
      page,
      limit,
      day,
      date,
      status,
    );
    res.status(200).json(slots);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const doctorId = req.params.doctorId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const availableSlots = await slotsService.getAvailableSlots(
      doctorId as string,
      page,
      limit,
    );
    res.status(200).json(availableSlots);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteSlot = async (req: Request, res: Response) => {
  try {
    const doctorId = req.doctorId;
    const slotId = req.params.slotId;
    await slotsService.deleteSlot(slotId as string, doctorId as string);
    res.status(200).json({ message: "Slot eliminado exitosamente" });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateSlot = async (req: Request, res: Response) => {
  try {
    const doctorId = req.doctorId;
    const slotId = req.params.slotId;
    const { start_time, end_time } = req.body;
    const updatedSlot = await slotsService.updateSlot(
      slotId as string,
      doctorId as string,
      start_time,
      end_time,
    );
    res
      .status(200)
      .json({ message: "Slot actualizado exitosamente", updatedSlot });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const name = req.query.name as string;
    const email = req.query.email as string;
    const doctors = await slotsService.getDoctors(page, limit, name, email);
    res.status(200).json(doctors);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
