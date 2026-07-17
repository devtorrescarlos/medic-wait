import api from "../api/axios";

export const listNotifications = async (page: number, limit: number) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const response = await api.get("/notifications", { params });
  return response.data;
};

export const markAsReadById = async (id: string) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get("/notifications/unread-count");
  return response.data;
};

export const deleteNotificationById = async (id: string) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data;
};
