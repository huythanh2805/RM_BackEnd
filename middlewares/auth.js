import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Hàm để tạo token cho một người dùng dựa trên userId
export async function generateToken(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
}
export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decodedData.userId || decodedData.id };
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" }); // Token đã hết hạn
    }

    res.status(401).json({ message: "Authentication failed", error: error.message }); // Gửi thông báo lỗi cụ thể
  }
};
