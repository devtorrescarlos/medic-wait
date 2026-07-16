import { Request, Response } from "express";
import * as notificationsService from "./notifications.service";

export const listNotifications = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 7;
    const userId = req.user?.id as string;
    const result = await notificationsService.listNotifications(
      page,
      limit,
      userId,
    );
    res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.id as string;
    const userId = req.user?.id as string;
    const readNotification = await notificationsService.markAsRead(
      notificationId,
      userId,
    );
    res.status(200).json(readNotification);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const result = await notificationsService.markAllAsRead(userId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const result = await notificationsService.getUnreadCount(userId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const removeNotification = async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.id as string;
    const userId = req.user?.id as string;
    const result = await notificationsService.remove(notificationId, userId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
