import api from "../api/axios";

export const getAppointments = async (
  page: number,
  limit: number,
  patient?: string,
  date?: string,
  status?: string,
  doctor?: string,
) => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));

  if (date) params.append("date", String(date));
  if (patient) params.append("patient", String(patient));
  if (status) params.append("status", String(status));
  if (doctor) params.append("doctor", String(doctor));

  const response = await api.get("/appointments/all", { params });
  return response.data;
};

export const getAppointmentById = async (id: string) => {
  const response = await api.get(`/appointments/${id}`);
  return response.data;
};

export const confirmAppointmentById = async (id: string) => {
  const response = await api.post(`/appointments/${id}/confirm`);
  return response.data;
};

export const completeAppointmentById = async (id: string) => {
  const response = await api.post(`/appointments/${id}/complete`);
  return response.data;
};

export const cancelAppointmentById = async (id: string, cancellation_reason: string) => {
  const response = await api.post(`/appointments/${id}/cancel`, { cancellation_reason });
  return response.data;
};

export const createAppointment = async (doctorId: string, slotId: string, reason: string) => {
  const response = await api.post(`/appointments/${doctorId}/${slotId}`, { reason });
  return response.data;
};
