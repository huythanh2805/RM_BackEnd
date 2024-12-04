import Discount from "../models/discount.js";

const createDiscount = async (req, res) => {
  try {
    // Lấy dữ liệu từ body của request
    const {
      discountType,
      discountValue,
      expireDate,
      minOrderValue,
      totalQuantity,
      userId,
    } = req.body;

    // Kiểm tra dữ liệu đầu vào (có thể dùng thư viện như Zod hoặc Joi nếu muốn thêm validation nâng cao)
    if (!discountType || !discountValue || !expireDate || !minOrderValue || !totalQuantity || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Tạo tài liệu mới
    const discount = new Discount({
      discountType,
      discountValue,
      expireDate: new Date(expireDate), // Đảm bảo đúng kiểu Date
      minOrderValue,
      totalQuantity,
      remainingQuantity: totalQuantity, // Remaining quantity ban đầu bằng totalQuantity
      createdBy: userId,
      isActive: true, // Mặc định kích hoạt
    });

    // Lưu vào cơ sở dữ liệu
    const savedDiscount = await discount.save();

    // Trả về dữ liệu phản hồi
    res.status(201).json({
      message: "Discount created successfully",
      data: savedDiscount,
    });
  } catch (error) {
    // Xử lý lỗi
    console.error("Error creating discount:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getAllDiscounts = async (req, res) => {
    try {
      // Lấy tất cả các phiếu giảm giá, sắp xếp từ mới nhất đến cũ nhất
      const discounts = await Discount.find()
        .populate("createdBy", "name email userName") // Chỉ lấy trường name và email của user
        .sort({ createdAt: -1 }); // Sắp xếp từ mới nhất đến cũ nhất
  
      // Trả về danh sách
      res.status(200).json(discounts);
    } catch (error) {
      // Xử lý lỗi
      console.error("Error fetching discounts:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
export {
    createDiscount,
    getAllDiscounts
}