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
  const url = `${import.meta.env.VITE_API_URL}/medical-records/patients?${params.toString()}`;
  const response = await api.get(url);
  return response.data;
};

export const getPatientById = async (id: string) => {
  const url = `${import.meta.env.VITE_API_URL}/medical-records/patients/${id}`;
  const response = await api.get(url);
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
  const url = `${import.meta.env.VITE_API_URL}/medical-records/doctors?${params.toString()}`;
  const response = await api.get(url);
  return response.data;
};

export const getMyDoctorById = async (id: string) => {
  const url = `${import.meta.env.VITE_API_URL}/medical-records/doctors/${id}`;
  const response = await api.get(url);
  return response.data;
};

export const createMedicalRecord = async (
  appointmentId: string,
  data: MedicalRecordFormData,
) => {
  const url = `${import.meta.env.VITE_API_URL}/medical-records?appointmentId=${appointmentId}`;
  const response = await api.post(url, data);
  return response.data;
};

export const createMedicalRecordAnnexe = async (
  medicalRecordId: string,
  data: MedicalRecordAnnexeData,
) => {
  const url = `${import.meta.env.VITE_API_URL}/medical-records/annex/${medicalRecordId}`;
  const response = await api.post(url, data);
  return response.data;
};

export const getMedicalRecordById = async (id: string) => {
  const url = `${import.meta.env.VITE_API_URL}/medical-records/${id}`;
  const response = await api.get(url);
  return response.data;
};

export const getMedicalRecordAnnexeById = async (id: string) => {
  const url = `${import.meta.env.VITE_API_URL}/medical-records/annexe/${id}`;
  const response = await api.get(url);
  return response.data;
};
