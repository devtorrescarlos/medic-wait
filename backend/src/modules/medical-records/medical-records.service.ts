import Appointment from "../../models/Appointment";
import User from "../../models/User";
import redisClient from "../../config/ioredis";
import MedicalRecord from "../../models/MedicalRecord";
import {
  MedicalRecordData,
  MedicalRecordAnnexData,
} from "../../types/medical-records.types";
import MedicalRecordAnnexe from "../../models/MedicalRecordAnnexe";

export const getPatients = async (
  page: number,
  limit: number,
  doctorId: string,
) => {
  const cacheKey = `patients:${doctorId}:${page}:${limit}`;
  const cacheValue = await redisClient.get(cacheKey);

  if (cacheValue) {
    return JSON.parse(cacheValue);
  }

  const patient_ids = await Appointment.findAll({
    where: { doctor_id: doctorId },
    attributes: ["patient_id"],
  });

  const { count, rows: patients } = await User.findAndCountAll({
    where: {
      id: patient_ids.map(
        (patient: { patient_id: string }) => patient.patient_id,
      ),
    },
    limit,
    offset: (page - 1) * limit,
  });

  const response = {
    totalPatients: count,
    patients,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  };

  await redisClient.set(cacheKey, JSON.stringify(response), "EX", 60 * 60 * 24);

  return response;
};

export const getPatientById = async (patientId: string) => {
  const patient = await User.findByPk(patientId, {
    attributes: ["id", "full_name", "email"],
  });

  if (!patient) {
    throw {
      status: 404,
      message: "El paciente no existe",
    };
  }

  return patient;
};

export const createMedicalRecord = async (
  doctorId: string,
  appointmentId: string,
  medicalRecordData: MedicalRecordData,
) => {
  const { initial_diagnosis, treatment_plan } = medicalRecordData;

  const appointment = await Appointment.findOne({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw {
      status: 404,
      message: "La cita no existe",
    };
  }

  if (appointment.doctor_id !== doctorId) {
    throw {
      status: 401,
      message: "No tienes permiso para crear una historia médica",
    };
  }

  const existingMedicalRecord = await MedicalRecord.findOne({
    where: { appointment_id: appointmentId },
  });

  if (existingMedicalRecord) {
    throw {
      status: 409,
      message: "Ya existe una historia médica en esta cita",
    };
  }

  const medicalRecord = await MedicalRecord.create({
    doctor_id: doctorId,
    patient_id: appointment.patient_id,
    initial_diagnosis,
    treatment_plan,
    appointment_id: appointmentId,
  });

  return medicalRecord;
};

export const createMedicalRecordAnnexe = async (
  doctorId: string,
  medicalRecordId: string,
  medicalRecordAnnexData: MedicalRecordAnnexData,
) => {
  const { type, content } = medicalRecordAnnexData;

  const medicalRecord = await MedicalRecord.findOne({
    where: { id: medicalRecordId },
  });

  if (!medicalRecord) {
    throw {
      status: 404,
      message: "La historia médica no existe",
    };
  }

  if (medicalRecord.doctor_id !== doctorId) {
    throw {
      status: 401,
      message: "No tienes permiso para crear una historia médica",
    };
  }

  const medicalRecordAnnexe = await MedicalRecordAnnexe.create({
    doctor_id: doctorId,
    medical_record_id: medicalRecordId,
    type,
    content,
  });

  return medicalRecordAnnexe;
};

export const getMedicalRecordById = async (medicalRecordId: string) => {
  const medicalRecord = await MedicalRecord.findOne({
    where: { id: medicalRecordId },
    include: [
      {
        model: MedicalRecordAnnexe,
        as: "annexes",
        attributes: ["id", "type", "content"],
      },
    ],
  });

  if (!medicalRecord) {
    throw {
      status: 404,
      message: "La historia clínica no existe",
    };
  }

  return medicalRecord;
};
