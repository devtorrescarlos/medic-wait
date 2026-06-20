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

  const url = `${import.meta.env.VITE_API_URL}/appointments/all?${params.toString()}`;
  const response = await api.get(url);
  return response.data;
};

export const getAppointmentById = async (id: string) => {
    const url = `${import.meta.env.VITE_API_URL}/appointments/${id}`
    const response = await api.get(url);
    return response.data;
}

export const confirmAppointmentById = async (id: string) => {
    const url = `${import.meta.env.VITE_API_URL}/appointments/${id}/confirm`;
    const response = await api.post(url);
    return response.data;
}

export const completeAppointmentById = async (id: string) => {
    const url = `${import.meta.env.VITE_API_URL}/appointments/${id}/complete`;
    const response = await api.post(url);
    return response.data;
}

export const cancelAppointmentById = async (id: string, cancellation_reason: string) => {
    const url = `${import.meta.env.VITE_API_URL}/appointments/${id}/cancel`;
    const response = await api.post(url, { cancellation_reason });
    return response.data;
}