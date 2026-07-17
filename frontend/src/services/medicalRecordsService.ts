import api from "../api/axios";
import type { MedicalRecordAnnexeData, MedicalRecordFormData } from "../types";

export const getPatients = async (
  page: number,
  limit: number,
  name: string,
  email: string,
  search?: string,
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    name: String(name),
    email: String(email),
  });
  if (search) params.append("search", search);
  const response = await api.get("/medical-records/patients", { params });
  return response.data;
};

export const getPatientById = async (id: string) => {
  const response = await api.get(`/medical-records/patients/${id}`);
  return response.data;
};

export const getMyDoctors = async (
  page: number,
  limit: number,
  name?: string,
  email?: string,
  specialty?: string,
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (name) params.append("name", name);
  if (email) params.append("email", email);
  if (specialty) params.append("specialty", specialty);
  const response = await api.get("/medical-records/doctors", { params });
  return response.data;
};

export const getMyDoctorById = async (id: string) => {
  const response = await api.get(`/medical-records/doctors/${id}`);
  return response.data;
};

export const createMedicalRecord = async (
  appointmentId: string,
  data: MedicalRecordFormData,
) => {
  const response = await api.post("/medical-records", data, {
    params: { appointmentId },
  });
  return response.data;
};

export const createMedicalRecordAnnexe = async (
  medicalRecordId: string,
  data: MedicalRecordAnnexeData,
) => {
  const response = await api.post(`/medical-records/annex/${medicalRecordId}`, data);
  return response.data;
};

export const getMedicalRecordById = async (id: string) => {
  const response = await api.get(`/medical-records/${id}`);
  return response.data;
};

export const getMedicalRecordAnnexeById = async (id: string) => {
  const response = await api.get(`/medical-records/annexe/${id}`);
  return response.data;
};
