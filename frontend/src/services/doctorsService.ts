import api from "../api/axios";

export const getDoctors = async (
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
  const response = await api.get("/doctors", { params });
  return response.data;
};

export const getDoctorById = async (id: string) => {
  const response = await api.get(`/doctors/${id}`);
  return response.data;
};
