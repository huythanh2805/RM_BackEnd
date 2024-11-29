import Notifications from "../models/notifications.js";

class NotificationsController {
  // Lấy danh sách thông báo cho admin
  async getNotifications(req, res) {
    try {
      const notifications = await Notifications.find({}).sort({ createdAt: -1 });
      return res.status(200).json(notifications);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Không thể lấy danh sách thông báo.",
      });
    }
  }

  // Đánh dấu thông báo đã đọc
  async markNotificationAsRead(req, res) {
    const { id } = req.params;

    try {
      const notification = await Notifications.findByIdAndUpdate(id, { isRead: true }, { new: true });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Thông báo không tồn tại.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Thông báo đã được đánh dấu là đã đọc.",
        notification,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra khi cập nhật trạng thái thông báo.",
      });
    }
  }
}

export default NotificationsController;
