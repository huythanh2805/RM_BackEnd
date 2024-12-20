import jwt from "jsonwebtoken";
import User from "../models/user.js";
async function generateToken(userId) {
  const user = await User.findById(userId); // Lấy thông tin người dùng
  if (!user) throw new Error("User not found"); // Kiểm tra nếu người dùng tồn tại
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token; // Trả về token
}
export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Lấy token từ header
    if (!token) {
      return res.status(401).json({ message: "No token provided" }); // Kiểm tra nếu không có token
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET); // Xác thực token
    req.user = decodedData; // Gán thông tin người dùng vào req.user
    next(); // Tiếp tục đến middleware hoặc route tiếp theo
  } catch (error) {
    console.error("Authentication error:", error.message); // Ghi lại lỗi
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" }); // Token không hợp lệ
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" }); // Token đã hết hạn
    }
    res.status(401).json({ message: "Authentication failed", error: error.message }); // Gửi thông báo lỗi cụ thể
  }
};
