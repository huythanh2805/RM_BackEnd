import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

class UserController {
  // Register method
  async register(req, res) {
    const { email, password, userName, phoneNumber } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Người dùng đã tồn tại" });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        password: hashedPassword,
        userName,
        phoneNumber,
      });
      await newUser.save();
      return res.status(201).json({ message: "Đăng kí thành công" });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi đăng ký người dùng", error });
    }
  }
  // Login method
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Tài khoản không tồn tại" });
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Thông tin xác thực không hợp lệ" });
      }
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({ result: user, token });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi đăng nhập", error });
    }
  }
  //list user accounts
  async getListUsers(req, res) {
    try {
      const users = await User.find({});
      return res.status(200).json({ users });
    } catch (error) {
      console.error("Lỗi lấy danh sách người dùng:", error);
      return res.status(500).json({ message: "Lỗi lấy danh sách người dùng", error: error.message });
    }
  }
  // Get user profile
  async getUserProfile(req, res) {
    console.log("getUserProfile được gọi"); // Để kiểm tra
    console.log("User ID:", req.user.id);
    try {
      const user = await User.findById(req.user.id);
      console.log("ảnh:", user.image);
      console.log(user);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi lấy thông tin người dùng", error });
    }
  }
  // Update user profile
  async updateUserProfile(req, res) {
    const { userName, phoneNumber, address } = req.body;
    let image;
    // Kiểm tra xem có hình ảnh mới không
    if (req.file) {
      image = req.file.path;
    }
    try {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          userName,
          phoneNumber,
          address,
          ...(image && { image }), // Cập nhật hình ảnh nếu có
        },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi cập nhật thông tin người dùng", error });
    }
  }
  //Delete user
  async deleteUser(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID người dùng không hợp lệ" });
    }
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }
      return res.status(200).json({ message: "Người dùng đã được xóa thành công." });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi xóa người dùng", error });
    }
  }
}

export default new UserController();
