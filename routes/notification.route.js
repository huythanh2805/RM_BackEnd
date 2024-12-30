import express from "express";
import NotificationsController from "../controllers/notifications.controller.js";

const router = express.Router();

// Khởi tạo instance của NotificationsController
const notifications = new NotificationsController();

// Các route xử lý thông báo
// Thông báo nhà bếp
router.get("/kitchen/notification", notifications.getAllKitChenNotify);
router.post("/notification", notifications.createNewKitChenNotify);
router.patch("/kitchen/notification", notifications.updateKitchenNotify);
// Thông báo đơn hàng
router.put("/notification/:id", notifications.markNotificationAsRead);
router.get("/notification", notifications.getNotifications);
 
export default router;
