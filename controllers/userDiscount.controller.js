import mongoose from "mongoose";
import Discount from "../models/discount.js";
import UserDiscount from "../models/userDiscount.js";
import { nanoid } from "nanoid"; 
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

    // Điều kiện 3: Tìm trong userDiscount nếu đã tồn tại
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
}

const getAllUserDiscount =async (req, res) => {
  const { userId } = req.params;

  try {
    // Kiểm tra userId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId." });
    }

    // Lấy tất cả userDiscount của userId và populate thông tin discount
    const userDiscounts = await UserDiscount.find({ userId })
      .populate("discountId") // Populate discount thông qua discountId
      .sort({ createdAt: -1 }); // Sắp xếp từ mới đến cũ

    return res.status(200).json(userDiscounts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export {
    createUserDiscount,
    getAllUserDiscount
}