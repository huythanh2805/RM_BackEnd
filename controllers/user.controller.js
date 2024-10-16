import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import transporter from "../configs/transporter.js";
import User from "../models/user.js";

class UserController {
  //Client
  // Register method
  async register(req, res) {
    const { email, password, userName, phoneNumber } = req.body;
    if (!email || !password || !userName || !phoneNumber) {
      return res.status(400).json({ message: "Tất cả các trường là bắt buộc." });
    }
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
        return res.status(400).json({ message: "Mật khẩu không đúng" });
      }
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({ result: user, token });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi đăng nhập", error });
    }
  }
  // Get user profile
  async getUserProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
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
    const { userName, phoneNumber, address, password } = req.body;
    let image;
    // Kiểm tra xem có hình ảnh mới không
    if (req.file) {
      image = req.file.path;
    }
    try {
      const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          userName,
          phoneNumber,
          address,
          ...(hashedPassword && { password: hashedPassword }), // Cập nhật mật khẩu nếu có
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
  // Admin
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
  // add user
  async addUser(req, res) {
    const { email, password, userName, phoneNumber } = req.body;
    if (!email || !password || !userName || !phoneNumber) {
      return res.status(400).json({ message: "Tất cả các trường là bắt buộc." });
    }
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Người dùng đã tồn tại." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password: hashedPassword,
        userName,
        phoneNumber,
        role: "ADMIN",
      });
      await newUser.save();
      return res.status(201).json({ message: "Người dùng đã được tạo thành công." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Đã xảy ra lỗi. Vui lòng thử lại sau." });
    }
  }
  // Get user profile by ID
  async getUserById(req, res) {
    const { id } = req.params; // Lấy ID từ tham số URL
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi lấy thông tin người dùng", error });
    }
  }
  // Update user
  async updateUserById(req, res) {
    const { userName, phoneNumber, address, password, role } = req.body;
    let image;
    // Kiểm tra xem có hình ảnh mới không
    if (req.file) {
      image = req.file.path;
    }

    try {
      const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          userName,
          phoneNumber,
          address,
          ...(hashedPassword && { password: hashedPassword }), // Cập nhật mật khẩu nếu có
          ...(image && { image }), // Cập nhật hình ảnh nếu có
          ...(role && { role }), // Cập nhật vai trò nếu có
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
  // Hàm gửi email đặt lại mật khẩu
  async requestPasswordReset(req, res) {
    console.log("Received request body:", req.body);
    const { email } = req.body;
    // Kiểm tra xem email có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống." });
    }
    // Tạo token đặt lại mật khẩu
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 3600000; // Token có hiệu lực trong 1 giờ
    // Lưu token và thời hạn vào user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpiry;
    await user.save();
    // Tạo liên kết đặt lại mật khẩu
    const resetUrl = `http://localhost:4444/reset-password/${resetToken}`;
    console.log("Reset URL:", resetUrl);
    // Cấu hình nội dung email
    const mailOptions = {
      from: "thiuyen1132004@gmail.com", // Địa chỉ email gửi
      to: user.email, // Địa chỉ email nhận
      subject: "Đặt lại mật khẩu",
      text: `Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu của bạn: ${resetUrl}`,
      html: `<p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
             <p>Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu của bạn:</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    };
    // Gửi email
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Không thể gửi email. Vui lòng thử lại sau." });
      }
      return res.status(200).json({ message: "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn." });
    });
  }
  // Hàm thực hiện việc đặt lại mật khẩu
  async resetPassword(req, res) {
    const { token, newPassword } = req.body;
    console.log(token);
    console.log(newPassword);
    // Tìm user theo token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Kiểm tra xem token còn hiệu lực không
    });
    if (!user) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    // Cập nhật mật khẩu mới
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; // Xóa token cũ
    user.resetPasswordExpires = undefined; // Xóa thời gian hết hạn
    await user.save();
    return res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công." });
  }
}

export default new UserController();
