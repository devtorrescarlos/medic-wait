import { Op } from "sequelize";
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
  doctorId: string,
  page: number,
  limit: number,
  name: string,
  email: string,
) => {
  const cacheKey = `patients:${doctorId}:${page}:${limit}:${name}:${email}`;
  const cacheValue = await redisClient.get(cacheKey);

  if (cacheValue) {
    return JSON.parse(cacheValue);
  }

  const patient_ids = await Appointment.findAll({
    where: { doctor_id: doctorId, status: "completed" },
    attributes: ["patient_id"],
  });

  const { count, rows: patients } = await User.findAndCountAll({
    where: {
      id: patient_ids.map(
        (patient: { patient_id: string }) => patient.patient_id,
      ),
      [Op.and]: [
        {
          full_name: {
            [Op.iLike]: `%${name}%`,
          },
        },
        {
          email: {
            [Op.iLike]: `%${email}%`,
          },
        },
      ],
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
    attributes: ["id", "full_name", "email", "age"],
  });

  if (!patient) {
    throw {
      status: 404,
      message: "El paciente no existe",
    };
  }

  const medicalRecords = await MedicalRecord.findAll({
    where: { patient_id: patientId },
    include: [
      {
        model: MedicalRecordAnnexe,
        as: "annexes",
        attributes: ["id", "type", "content", "created_at"],
      },
      {
        model: Appointment,
        as: "appointment",
        attributes: ["id", "status", "created_at"],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  const appointmentsCount = await Appointment.count({
    where: { patient_id: patientId, status: "completed" },
  });

  return { patient, medicalRecords, appointmentsCount };
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

  if (appointment.status !== "completed") {
    throw {
      status: 409,
      message: "La cita no ha sido completada",
    };
  }

  const patientHasMedicalRecord = await MedicalRecord.findOne({
    where: { patient_id: appointment.patient_id },
  });

  if (patientHasMedicalRecord) {
    throw {
      status: 409,
      message: "El paciente ya tiene una historia médica. Agrega un anexo.",
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
        attributes: ["id", "type", "content", "created_at"],
      },
      {
        model: User,
        as: "patient",
        attributes: ["id", "full_name", "email", "age"],
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

export const getMedicalRecordAnnexeById = async (annexeId: string) => {
  const medicalRecordAnnexe = await MedicalRecordAnnexe.findOne({
    where: { id: annexeId },
    include: [
      {
        model: MedicalRecord,
        as: "medicalRecord",
        attributes: ["patient_id"],
        include: [
          {
            model: User,
            as: "patient",
            attributes: ["id", "full_name", "email", "age"],
          },
        ],
      },
    ],
  });

  if (!medicalRecordAnnexe) {
    throw {
      status: 404,
      message: "El anexo no existe",
    };
  }

  return medicalRecordAnnexe;
};
