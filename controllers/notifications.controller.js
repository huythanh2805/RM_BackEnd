import KitchenNotify from "../models/kitchenNotify.js";
import Notifications from "../models/notifications.js";
import OrderDishHistory from "../models/order-dish-history.js"; 
import OrderedDish from "../models/orderedDish.js"; 
import OrderedCombo from "../models/orderedCombo.js"; 
import Reservation from "../models/reservation.js"; 
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
  // Tạo thông báo cho nhà bếp
  async createNewKitChenNotify(req, res){
    const {title, message, orderedCode, orderHistoryId} = req.body
    console.log(req.body)
    try {
      const kitchenNotify = await KitchenNotify.create({title, message, orderedCode})
      if(kitchenNotify) await OrderDishHistory.findByIdAndUpdate(orderHistoryId, {isRequiredToCancel: true})
      const orderDish = await OrderedDish.findOne({code: orderedCode})
      if(orderDish){
        await OrderedDish.findByIdAndUpdate({_id: orderDish._doc._id}, {isRequiredToCancel: true})
      }else{
        const orderCombo = await OrderedCombo.findOne({code: orderedCode})
        await OrderedCombo.findByIdAndUpdate({_id: orderCombo._doc._id}, {isRequiredToCancel: true})
      }
      return res.status(200).json(kitchenNotify);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong on server",
      });
    }
  }
  // lấy tất cả thông báo cho nhà bếp
  async getAllKitChenNotify(req, res){
    try {
      const kitchenNotify = await KitchenNotify.find({}).sort({createdAt: -1})
      return res.status(200).json(kitchenNotify);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong on server",
      });
    }
  }
  // Cập nhật lại trạng thái của thông báo
  async updateKitchenNotify(req, res){
    const {_id, changer_id} = req.body
    try {
       const kitchenNotify = await KitchenNotify.findOne({_id})
       await KitchenNotify.findByIdAndUpdate(_id, {isConfirmed: true})
      //  Tìm xem có tìm thấy món ăn nào có id trùng với lịch sử món ăn hay không
       const orderDish = await OrderedDish.findOne({code: kitchenNotify._doc.orderedCode})
      //  Nếu có thì update lại trạng thái cho món ăn được gọi, không thì update lại trạng thái của combo
       const orderHistory = await OrderDishHistory.findOne({code: kitchenNotify._doc.orderedCode}).sort({ createdAt: -1 })
       if(orderDish){
        await OrderedDish.findOneAndUpdate({code: kitchenNotify._doc.orderedCode}, {status: "ISCANCELED", isRequiredToCancel: false})
        await OrderDishHistory.create({
          code: orderHistory._doc.code,
          reservation_id: orderHistory._doc.reservation_id,
          changer_id,
          quantity: orderHistory._doc.quantity,
          ordered_dish: orderHistory._doc.ordered_dish,
          currentStatus: "ISCANCELED",
          previousStatus: orderHistory._doc.currentStatus
          })
       }else{
        await OrderedCombo.findOneAndUpdate({code: kitchenNotify._doc.orderedCode}, {status: "ISCANCELED", isRequiredToCancel: false})
        await OrderDishHistory.create({
          code: orderHistory._doc.code,
          reservation_id: orderHistory._doc.reservation_id,
          changer_id,
          quantity: orderHistory._doc.quantity,
          ordered_combo: orderHistory._doc.ordered_combo,
          currentStatus: "ISCANCELED",
          previousStatus: orderHistory._doc.currentStatus
          })
       }
      
      return res.status(200).json(kitchenNotify);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong on server",
      });
    }
  }
}

export default NotificationsController;
