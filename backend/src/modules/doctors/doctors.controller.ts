import { Request, Response } from "express";
import * as doctorsService from "./doctors.service";

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const name = req.query.name as string;
    const email = req.query.email as string;
    const specialty = req.query.specialty as string;
    const doctors = await doctorsService.getDoctors(
      page,
      limit,
      name,
      email,
      specialty,
    );
    res.status(200).json(doctors);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const patientId = req.patientId as string;
    const doctorId = req.params.doctorId as string;
    const doctor = await doctorsService.getDoctorById(doctorId, patientId);
    res.status(200).json(doctor);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
