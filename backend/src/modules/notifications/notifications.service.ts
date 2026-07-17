import Notification from "../../models/Notification";

export const create = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  referenceId?: string,
  referenceType?: string,
) => {
  const notification = await Notification.create({
    user_id: userId,
    type,
    title,
    message,
    reference_id: referenceId ?? null,
    reference_type: referenceType ?? null,
  });

  return notification;
};

export const listNotifications = async (
  page: number,
  limit: number,
  userId: string,
) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Notification.findAndCountAll({
    where: { user_id: userId },
    limit,
    offset,
    order: [["created_at", "DESC"]],
  });

  return {
    notifications: rows,
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};

export const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOne({
    where: {
      user_id: userId,
      id: notificationId,
    },
  });

  if (!notification) {
    throw {
      status: 404,
      message: "Notificación no encontrada",
    };
  }

  if (notification.user_id !== userId) {
    throw {
      status: 403,
      message: "No puedes leer notificaciones de otros usuarios",
    };
  }

  await notification.update({
    is_read: true,
  });

  return notification;
};

export const markAllAsRead = async (userId: string) => {
  await Notification.update(
    { is_read: true },
    { where: { user_id: userId, is_read: false } },
  );

  return { message: "Notificaciones marcadas como leídas" };
};

export const getUnreadCount = async (userId: string) => {
  const count = await Notification.count({
    where: { user_id: userId, is_read: false },
  });

  return { count };
};

export const remove = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOne({
    where: { id: notificationId, user_id: userId },
  });

  if (!notification) {
    throw { status: 404, message: "Notificación no encontrada" };
  }

  await notification.destroy();

  return { message: "Notificación eliminada" };
};
