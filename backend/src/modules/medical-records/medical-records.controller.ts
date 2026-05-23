import { Request, Response } from "express";
import * as medicalRecordService from "./medical-records.service";

export const getPatients = async (req: Request, res: Response) => {
  try {
    const doctorId = req.doctorId as string;
    const page = Number(req.query.page as string) || 1;
    const limit = Number(req.query.limit as string) || 10;
    const patients = await medicalRecordService.getPatients(
      page,
      limit,
      doctorId,
    );
    return res.status(200).json(patients);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const patientId = req.params.id;
    const patient = await medicalRecordService.getPatientById(
      patientId as string,
    );
    return res.status(200).json(patient);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const createMedicalRecord = async (req: Request, res: Response) => {
  try {
    const doctorId = req.doctorId as string;
    const appointmentId = req.query.appointmentId as string;
    const medicalRecordData = req.body;

    const medicalRecord = await medicalRecordService.createMedicalRecord(
      doctorId,
      appointmentId,
      medicalRecordData,
    );
    return res.status(201).json(medicalRecord);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const createMedicalRecordAnnexe = async (
  req: Request,
  res: Response,
) => {
  try {
    const doctorId = req.doctorId as string;
    const medicalRecordId = req.params.medicalRecordId;
    const medicalRecordAnnexData = req.body;

    const medicalRecordAnnexe =
      await medicalRecordService.createMedicalRecordAnnexe(
        doctorId,
        medicalRecordId as string,
        medicalRecordAnnexData,
      );
    return res.status(201).json(medicalRecordAnnexe);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getMedicalRecordById = async (req: Request, res: Response) => {
  try {
    const medicalRecordId = req.params.medicalRecordId;
    const medicalRecord = await medicalRecordService.getMedicalRecordById(
      medicalRecordId as string,
    );
    return res.status(200).json(medicalRecord);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
