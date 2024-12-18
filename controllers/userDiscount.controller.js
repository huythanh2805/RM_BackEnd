import mongoose from "mongoose";
import { nanoid } from "nanoid";
import Discount from "../models/discount.js";
import Reservation from "../models/reservation.js";
import UserDiscount from "../models/userDiscount.js";
const createUserDiscount = async (req, res) => {
  const { discountId, userId } = req.body;

  try {
    // Kiểm tra discountId và userId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(discountId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid discountId or userId." });
    }

    // Lấy thông tin discount
    const discount = await Discount.findById(discountId);
    if (!discount) {
      return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    }

    // Điều kiện 1: remainingQuantity nhỏ hơn hoặc bằng 0
    if (discount.remainingQuantity <= 0) {
      return res.status(400).json({ message: "Mã giảm giá đã hết số lượng." });
    }

    // Điều kiện 2: expireDate nhỏ hơn thời gian hiện tại
    if (discount.expireDate && new Date(discount.expireDate) < new Date()) {
      return res.status(400).json({ message: "Mã giảm giá đã hết hạn" });
    }
    // Điều kiện 3: expireDate nhỏ hơn thời gian hiện tại
    if (!discount.isActive) {
      return res.status(400).json({ message: "Mã giảm giá Không còn hoạt động" });
    }

    // Điều kiện 4: Tìm trong userDiscount nếu đã tồn tại
    const existingUserDiscount = await UserDiscount.findOne({
      discountId,
      userId,
    });
    if (existingUserDiscount) {
      return res.status(400).json({ message: "Bạn đã lấy mã giảm giá này rồi" });
    }

    // Thỏa mãn hết điều kiện, tạo userDiscount
    const newCode = nanoid(6).toUpperCase(); // Tạo mã code 6 ký tự ngẫu nhiên (chữ & số, viết hoa)

    const userDiscount = new UserDiscount({
      code: newCode,
      userId,
      discountId,
      status: "AVAILABLE",
    });

    await userDiscount.save();

    // Giảm remainingQuantity đi 1
    discount.remainingQuantity -= 1;
    await discount.save();

    return res.status(201).json({
      message: "Bạn đã lấy thành công",
      data: userDiscount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getAllUserDiscount = async (req, res) => {
  const { userId } = req.params;

  try {
    // Kiểm tra userId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId." });
    }

   
    const userDiscounts = await UserDiscount.find({ userId })
      .populate("discountId") 
      .sort({ createdAt: -1 }); 

    return res.status(200).json(userDiscounts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const GetAllAvailableDiscount = async (req, res) => {
  const { userId } = req.params;

  try {
    // Kiểm tra userId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId." });
    }

    // Lấy tất cả userDiscount của userId và populate thông tin discount
    const userDiscounts = await UserDiscount.find({ userId, status: "AVAILABLE" })
      .populate("discountId") // Populate discount thông qua discountId
      .sort({ createdAt: -1 }); // Sắp xếp từ mới đến cũ

    return res.status(200).json(userDiscounts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const getUserDiscountByReservationId = async (req, res) => {
  const { reservationId } = req.params;
  try {
    const reservation = await Reservation.findById(reservationId).populate({
      path: "userDiscountId",
      populate: {
        path: "discountId", // Populate tiếp trường discountId trong userDiscountId
      },
    });
    if (!reservation) {
      return res.status(501).json({ message: "Reservation not found" });
    }
    console.log(reservation.userDiscountId);
    return res.status(201).json(reservation.userDiscountId); // Đây sẽ chứa đầy đủ thông tin của discount
  } catch (error) {
    console.error(error);
    throw new Error("Error while fetching discount details");
  }
};
const getUserDiscountByCode = async (req, res) => {
  const { code, totalPrice, reservationId } = req.params;
  try {
    const reservation = await Reservation.findById(reservationId);
    const newUserDiscount = await UserDiscount.findOne({ code: { $regex: new RegExp(code.trim(), "i") } }).populate(
      "discountId"
    );
    if (!newUserDiscount) {
      return res.status(501).json({ message: "Không thể tìm thấy mã" });
    }
    if (newUserDiscount.status === "USED") {
      return res.status(501).json({ message: "Mã giảm giá đã được sử dụng" });
    }
    if (!newUserDiscount.discountId.isActive) {
      return res.status(501).json({ message: "Mã giảm giá không còn hoạt động" });
    }
    if (Number(totalPrice) < newUserDiscount.discountId.minOrderValue) {
      return res
        .status(501)
        .json({ message: `Số tiền tối thiểu của mã này là ${newUserDiscount.discountId.minOrderValue / 1000}k` });
    }
    // Cập nhật discount cũ thành AVAILABLE
    if (reservation.userDiscountId) {
      await UserDiscount.findByIdAndUpdate(reservation.userDiscountId, { status: "AVAILABLE" });
    }
    // Cập nhật discount mới thành USED
    await UserDiscount.findByIdAndUpdate(newUserDiscount._doc._id, { status: "USED" });
    // Cập nhật userDiscount trong reservation
    reservation.userDiscountId = newUserDiscount._doc._id;
    await reservation.save();
    return res.status(201).json({ newUserDiscount }); // Đây sẽ chứa đầy đủ thông tin của discount
  } catch (error) {
    console.error(error);
    throw new Error("Error while fetching discount details");
  }
};

export {
  createUserDiscount,
  GetAllAvailableDiscount,
  getAllUserDiscount,
  getUserDiscountByCode,
  getUserDiscountByReservationId,
};
