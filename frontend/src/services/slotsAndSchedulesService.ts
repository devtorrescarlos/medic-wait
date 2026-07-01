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
  const url = `${import.meta.env.VITE_API_URL}/slots?${params.toString()}`;
  const response = await api.get(url);
  return response.data;
};

export const deleteSlotById = async (id: string) => {
  const url = `${import.meta.env.VITE_API_URL}/slots/${id}`;
  const response = await api.delete(url);
  return response.data;
};

export const updateSlotById = async (id: string, slotData: SlotFormData) => {
  const url = `${import.meta.env.VITE_API_URL}/slots/${id}`;
  const response = await api.put(url, slotData);
  return response.data;
};

export const generateScheduleAndSlots = async (
  scheduleData: ScheduleFormData,
) => {
  const url = `${import.meta.env.VITE_API_URL}/schedules`;
  const response = await api.post(url, scheduleData);
  return response.data;
};

export const getAllSchedules = async () => {
  const url = `${import.meta.env.VITE_API_URL}/schedules`;
  const response = await api.get(url);
  return response.data;
};

export const toggleSchedule = async (id: string) => {
  const url = `${import.meta.env.VITE_API_URL}/schedules/${id}/toggle`;
  const response = await api.patch(url);
  return response.data;
};

export const updateSchedule = async (
  id: string,
  scheduleData: ScheduleFormData,
) => {
  const url = `${import.meta.env.VITE_API_URL}/schedules/${id}`;
  const response = await api.put(url, scheduleData);
  return response.data;
};

export const deleteScheduleById = async (id: string) => {
  const url = `${import.meta.env.VITE_API_URL}/schedules/${id}`;
  const response = await api.delete(url);
  return response.data;
};
