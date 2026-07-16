import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import * as notificationsController from "./notifications.controller";

const router = Router();

router.get("/", authenticate, notificationsController.listNotifications);
router.get("/unread-count", authenticate, notificationsController.getUnreadCount);

router.patch("/:id/read", authenticate, notificationsController.markAsRead);
router.patch("/read-all", authenticate, notificationsController.markAllAsRead);

router.delete("/:id", authenticate, notificationsController.removeNotification);

export default router;
