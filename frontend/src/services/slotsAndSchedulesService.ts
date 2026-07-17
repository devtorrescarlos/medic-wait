import api from "../api/axios";
import type { ScheduleFormData, SlotFormData } from "../types";

export const getSlots = async (
  page: number,
  limit: number,
  day?: string,
  date?: string,
  status?: string,
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (day) params.append("day", day);
  if (date) params.append("date", date);
  if (status) params.append("status", status);
  const response = await api.get("/slots", { params });
  return response.data;
};

export const deleteSlotById = async (id: string) => {
  const response = await api.delete(`/slots/${id}`);
  return response.data;
};

export const updateSlotById = async (id: string, slotData: SlotFormData) => {
  const response = await api.put(`/slots/${id}`, slotData);
  return response.data;
};

export const generateScheduleAndSlots = async (
  scheduleData: ScheduleFormData,
) => {
  const response = await api.post("/schedules", scheduleData);
  return response.data;
};

export const getAllSchedules = async () => {
  const response = await api.get("/schedules");
  return response.data;
};

export const toggleSchedule = async (id: string) => {
  const response = await api.patch(`/schedules/${id}/toggle`);
  return response.data;
};

export const updateSchedule = async (
  id: string,
  scheduleData: ScheduleFormData,
) => {
  const response = await api.put(`/schedules/${id}`, scheduleData);
  return response.data;
};

export const deleteScheduleById = async (id: string) => {
  const response = await api.delete(`/schedules/${id}`);
  return response.data;
};
