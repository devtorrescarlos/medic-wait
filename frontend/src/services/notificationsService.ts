import api from "../api/axios";

export const listNotifications = async (page: number, limit: number) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const url = `${import.meta.env.VITE_API_URL}/notifications?${params.toString()}`;

  const response = await api.get(url);

  return response.data;
};

export const markAsReadById = async (id: string) => {
  const url = `${import.meta.env.VITE_API_URL}/notifications/${id}/read`;
  const response = await api.patch(url);

  return response.data;
};

export const getUnreadCount = async () => {
  const url = `${import.meta.env.VITE_API_URL}/notifications/unread-count`;
  const response = await api.get(url);

  return response.data;
};

export const deleteNotificationById = async (id: string) => {
  const url = `${import.meta.env.VITE_API_URL}/notifications/${id}`;
  const response = await api.delete(url);

  return response.data;
};

export const markAllAsRead = async () => {
  const url = `${import.meta.env.VITE_API_URL}/notifications/read-all`;
  const response = await api.patch(url);

  return response.data;
};
