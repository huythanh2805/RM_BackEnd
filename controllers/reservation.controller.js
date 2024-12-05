import mongoose from "mongoose";
import { sendEmailConfirmedStatus } from "../configs/transporter.js";
import notifications from "../models/notifications.js";
import OrderdCombo from "../models/orderedCombo.js";
import OrderedDish from "../models/orderedDish.js";
import Reservation from "../models/reservation.js";
import Table from "../models/table.js";

class ReservationController {
  constructor(io) {
    this.io = io;
  }
  // Get all reservation
  getAllReser = async (req, res) => {
    try {
      const reservations = await Reservation.find({})
        .sort({ createdAt: -1 })
        .populate("user_id")
        .populate("table_id")
        .populate("ordered_dishes");
      return res.status(201).json({ reservations });
    } catch (error) {
      console.log("Inventories_Error", error);
      return res.status(501).json({ message: "Internal Server Error" });
    }
  };
  // Get detail reservation by id
  getDetail = async (reservation_id) => {
    const reservation = await Reservation.findById(reservation_id)
      .populate("table_id") // Populate thông tin table
      .populate("user_id") // Populate thông tin user
      .populate({
        path: "ordered_dishes", // Populate các dish liên quan
        populate: {
          path: "dish_id", // Populate trường dish_id trong orderedDish
          model: "dish", // Model của dish
        },
      })
      .populate({
        path: "ordered_combos", // Populate các dish liên quan
        populate: {
          path: "setComboProduct_id", // Populate trường dish_id trong orderedDish
          model: "setComboProduct",
          populate: {
            path: "combo_id",
            model: "setCombo",
          },
        },
      });
    return reservation;
  };
  getReserDetailById = async (req, res) => {
    try {
      const { reservation_id } = req.params;

      // Tìm reservation theo ID và populate các trường liên quan
      const reservation = await this.getDetail(reservation_id);

      // Kiểm tra nếu reservation không tồn tại
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      // Trả về thông tin reservation
      return res.status(200).json(reservation);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  cancelReservationById = async (req, res) => {
    try {
      const { reservation_id } = req.params;
      const reservation = await Reservation.findByIdAndUpdate(reservation_id, { status: "CANCELED" }, { new: true });
      if (!reservation) {
        return res.status(404).json({ message: "Đơn hàng không tồn tại." }); // Trả về 404 nếu không tìm thấy
      }

      // Tạo thông báo
      const notification = new notifications({
        title: "Hủy đặt bàn",
        message: `Đơn đặt bàn ${reservation_id} đã bị hủy. Vui lòng xem chi tiết.`,
      });
      await notification.save();

      // Phát sự kiện qua WebSocket
      if (this.io) {
        this.io.emit("new-notification", {
          title: notification.title,
          message: notification.message,
        });
      }

      return res.status(200).json({ message: "Đơn hàng đã được hủy." }); // Trả về thành công
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình hủy đơn hàng." });
    }
  };
  // Get detail reservation by table status
  getReserDetailByTableId = async (req, res) => {
    const { table_id } = req.params;
    if (!table_id) return res.status(201).json({ message: "Missing table id" });
    try {
      const tableDetail = await Table.findById(table_id);
      let reservationDetail;
      if (tableDetail.status === "ISBOOKED") {
        reservationDetail = await Reservation.findOne({
          table_id: table_id,
          status: "RESERVED",
          prepay: { $gt: 0 },
          startTime: { $gte: new Date() },
        })
          .populate("user_id")
          .populate("table_id")
          .sort({ startTime: 1 })
          .exec();
        return res.status(201).json({ reservationDetail });
      } else if (tableDetail.status === "ISSERVING") {
        console.log("ISSERVING");
        reservationDetail = await Reservation.findOne({
          table_id: table_id,
          status: "SEATED",
        })
          .populate("user_id")
          .populate("table_id");
        console.log(reservationDetail);
        return res.status(201).json({ reservationDetail });
      }
      console.log({ reservationDetail });
    } catch (error) {
      console.log("Inventories_Error", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  // add new reservation admin
  createAdminReservation = async (req, res) => {
    const { table_id, userName, guests_count, payment_method, startTime, detailAddress, phoneNumber, orderedFoods } =
      req.body;
    try {
      if (!req.body) return res.status(401).json({ message: "All data are required" });
      // 4: create reservation
      const newReservation = await Reservation.create({
        userName,
        guests_count,
        payment_method,
        table_id,
        detailAddress,
        startTime,
        status: "SEATED",
        phoneNumber,
      });
      // 5: push orderedDish _id or orderedCombo _id into reservation
      // Tạo mới billDish và insert vào billDetail
      console.log({ orderedFoods });
      for (const orderedDish of orderedFoods) {
        if (orderedDish.type === "combo") {
          const newOrderedCombo = await OrderdCombo.create({
            setComboProduct_id: orderedDish._id,
            quantity: orderedDish.quantity,
            reservation_id: newReservation._doc._id,
          });
          newReservation.ordered_combos.push(newOrderedCombo._doc._id);
        } else if (orderedDish.type === "dish") {
          const newOrderedDish = await OrderedDish.create({
            dish_id: orderedDish.dish_id._id,
            quantity: orderedDish.quantity,
            reservation_id: newReservation._doc._id,
          });
          newReservation.ordered_dishes.push(newOrderedDish._doc._id);
        }
      }
      const reservation = await newReservation.save();
      // 6: if create reservation successfully update table status
      if (reservation) {
        await Table.findByIdAndUpdate({ _id: table_id }, { status: "ISSERVING" }, { new: true });
      }
      return res.status(201).json({ message: "Succussfully!", reservation });
    } catch (error) {
      console.log("Inventories_Error", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  // Lấy tất cả đơn đặt bàn theo user_id
  getReservationsByUser = async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(userId);
      const reservations = await Reservation.find({ user_id: userId }).sort({ createdAt: -1 });

      if (!reservations || reservations.length === 0) {
        return res.status(404).json({ message: "No reservations found for this user" });
      }

      return res.status(200).json({ reservations });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  // add new reservation client
  createClientReservation = async (req, res) => {
    const { startTime, dishs, user_id, guests_count, phoneNumber, userName, couponValue, deposit } = req.body;
    try {
      if (!req.body) return res.status(401).json({ message: "All data are required" });

      // Tạo đặt chỗ
      const newReservation = await Reservation.create({
        user_id,
        userName,
        guests_count,
        startTime,
        status: "ISWAITING",
        phoneNumber,
        userDiscountId: couponValue || null,
        deposit,
      });

      if (!newReservation) return res.status(401).json({ message: "Can't Create new order" });

      // Tạo mảng món ăn
      const orderedDishes = dishs.map((dish) => ({
        dish_id: dish.dish_id,
        reservation_id: newReservation._id,
        quantity: dish.quantity,
        status: "ISPREPARED",
      }));

      const insertedOrderedDishes = await OrderedDish.insertMany(orderedDishes);
      if (!insertedOrderedDishes) return res.status(401).json({ message: "Can't Create new ordered dish" });

      const orderedDishIds = insertedOrderedDishes.map((dish) => dish._id);
      await Reservation.findByIdAndUpdate(newReservation._id, {
        ordered_dishes: orderedDishIds,
      });

      // Tạo thông báo
      const notification = new notifications({
        title: "Yêu cầu đặt bàn mới",
        message: `Khách hàng ${userName} đã đặt bàn thành công. Vui lòng xác nhận.`,
      });

      await notification.save();

      // Phát sự kiện qua WebSocket
      this.io.emit("new-notification", {
        title: notification.title,
        message: notification.message,
      });

      return res.status(201).json({ message: "Successfully!" });
    } catch (error) {
      console.error("Inventories_Error", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  // Delete reservation by Array Id
  deleteReservationByIdArray = async (req, res) => {
    const { IdArray: ArrayId } = req.body; // Lấy ArrayId từ body của request
    // Kiểm tra xem ArrayId có tồn tại và là một mảng hay không
    if (!ArrayId || !Array.isArray(ArrayId)) {
      return res.status(400).json({
        success: false,
        message: "ArrayId is required and must be an array",
      });
    }

    try {
      //  update lại trạng thái của table
      const reservations = await Reservation.find({
        _id: { $in: ArrayId },
      });
      // Lấy danh sách các table_id từ các reservation
      const tableIds = reservations.map((reservation) => reservation.table_id);

      // Bước 2: Cập nhật trạng thái của tất cả các table có id trong danh sách tableIds về 'available'
      await Table.updateMany({ _id: { $in: tableIds } }, { $set: { status: "AVAILABLE" } });

      // Sử dụng deleteMany để xóa các reservation có id nằm trong ArrayId
      await Reservation.deleteMany({
        _id: { $in: ArrayId }, // Điều kiện _id nằm trong mảng ArrayId
      });

      // Trả về kết quả thành công
      return res.status(200).json({
        success: true,
        message: `Reservations were deleted`,
      });
    } catch (error) {
      // Xử lý lỗi khi thực hiện xóa
      console.error("Error deleting reservations:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting reservations",
        error: error.message,
      });
    }
  };
  // Reselect table
  reselectTable = async (req, res) => {
    const { reservation_id, table_id } = req.body;
    console.log({ reservation_id, table_id });
    if (!reservation_id) return res.status(401).json({ message: "There is no Id to update reservation" });

    try {
      const oldReservation = await Reservation.findById(reservation_id);

      await Table.updateOne({ _id: oldReservation.table_id }, { $set: { status: "AVAILABLE" } });

      await Table.findByIdAndUpdate(table_id, { $set: { status: "ISSERVING" } });
      //  update reservation table_id
      await Reservation.findByIdAndUpdate({ _id: reservation_id }, { table_id: table_id });

      return res.status(201).json({ message: "Successfully!" });
    } catch (error) {
      console.log("Inventories_Error", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  // Select table
  selectTable = async (req, res) => {
    const { reservation_id, table_id } = req.body;
    if (!reservation_id) return res.status(401).json({ message: "There is no Id to update reservation" });

    try {
      const reservation = await Reservation.findById(reservation_id);
      // Check if reser startTime larger than now
      if (new Date(reservation.startTime).getTime() < new Date().getTime())
        return res.status(401).json({ message: "It's not reach out the startTime yet" });
      await Table.findByIdAndUpdate(table_id, { $set: { status: "ISSERVING" } });
      //  update reservation table_id
      await Reservation.findByIdAndUpdate(reservation_id, { table_id: table_id, status: "SEATED" });

      return res.status(201).json({ message: "Successfully!" });
    } catch (error) {
      console.log("Inventories_Error", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  // update reservation reusable for update status and informations which don't have status
  updateReservation = async (req, res) => {
    const { table_id, userName, guests_count, payment_method, detailAddress, phoneNumber, status } = req.body;
    const { reservation_id } = req.params;
    try {
      const reservation = await Reservation.findById(reservation_id).populate("user_id");
      if (status) {
        await Reservation.findByIdAndUpdate(reservation_id, {
          status,
        });
        if (status === "ISCOMFIRMED")
          sendEmailConfirmedStatus(
            reservation.user_id.email,
            "Bạn đã đặt lịch thành công vui lòng đến đúng thời gian 🎉🎉"
          );
        if (status === "CANCELED")
          sendEmailConfirmedStatus(reservation.user_id.email, "Đơn đặt bàn của bạn không được chấp nhận 😛😛");
        return res.status(201).json({ message: "Succussfully!" });
      }

      await Reservation.findByIdAndUpdate(reservation_id, {
        userName,
        guests_count,
        payment_method,
        table_id,
        detailAddress,
        phoneNumber,
      });
      return res.status(201).json({ message: "Succussfully!" });
    } catch (error) {
      console.log("Inventories_Error", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  getReservation = async (userId, phoneNumber, guestsCount) => {
    const userIdObject = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null;

    try {
      const reservations = await Reservation.find({
        user_id: userIdObject,
        phoneNumber: phoneNumber,
        guests_count: guestsCount,
      });

      if (reservations.length === 0) {
        return null; // Trả về null nếu không tìm thấy đơn đặt bàn
      }
      return reservations[0]; // Trả về đơn đặt bàn đầu tiên nếu tìm thấy
    } catch (error) {
      console.error("GetReservation_Error", error);
      throw new Error("Lỗi trong quá trình tìm kiếm đơn đặt bàn."); // Ném lỗi để xử lý bên ngoài
    }
  };

  checkout = async (req, res) => {
    try {
      const content = req.body.content;
      const parts = content.trim().split(/\s+/);

      const phoneNumber = parts[1];
      const userId = parts[2];
      const guestsCount = parseInt(parts[3], 10);
      console.log("Guests Count: " + guestsCount, phoneNumber, userId);
      const coc = req.body.transferAmount;
      const reservation = await this.getReservation(userId, phoneNumber, guestsCount);

      if (!reservation) {
        return res.status(404).json({ message: "Không tìm thấy đơn đặt bàn phù hợp." });
      }

      reservation.deposit = coc; // Giả sử thuộc tính `coc` tồn tại trong đối tượng `reservation`

      // Lưu lại thay đổi vào cơ sở dữ liệu
      await reservation.save();

      // Trả về kết quả thành công
      return res.status(200).json({ message: "Thanh toán và đặt bàn thành công!" });
    } catch (error) {
      console.error("Checkout_Error", error);
      return res.status(500).json({ message: "Lỗi trong quá trình thanh toán và tạo đơn đặt bàn." });
    }
  };
}
export default ReservationController;
