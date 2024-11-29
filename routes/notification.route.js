import express from "express";
import NotificationsController from "../controllers/notifications.controller.js";

const router = express.Router();

// Khởi tạo instance của NotificationsController
const notifications = new NotificationsController();

// Các route xử lý thông báo
router.put("/notification/:id", notifications.markNotificationAsRead);
router.get("/notification", notifications.getNotifications);

export default router;
