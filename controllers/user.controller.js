import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import cloudinary from "../configs/cloudinary.js";
import transporter from "../configs/transporter.js";
import User from "../models/user.js";
const client = new OAuth2Client("1034244549008-5hm8ddao395soh8ebcgpcj3q1tl9q83f.apps.googleusercontent.com");
class UserController {
  //Login google
  async googleLogin(req, res) {
    const { token } = req.body;

    try {
      console.log("Received token:", token);
      // Xác thực token Google
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "1034244549008-5hm8ddao395soh8ebcgpcj3q1tl9q83f.apps.googleusercontent.com",
      });
      const payload = ticket.getPayload();
      const { email, name, picture } = payload;

      // Kiểm tra xem người dùng đã tồn tại chưa
      let user = await User.findOne({ email });

      if (!user) {
        // Nếu chưa tồn tại, tạo mới người dùng
        user = new User({
          email,
          userName: name,
          image: picture,
          provider: "google", // Để đánh dấu rằng người dùng này đăng nhập qua Google
        });
        await user.save();
      }

      // Tạo JWT cho người dùng
      const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      // Gửi phản hồi về phía client
      res.status(200).json({
        message: "Login successful",
        token: jwtToken, // Gửi token đã tạo cho client
        user: {
          email: user.email,
          userName: user.userName,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error("Error during Google login:", error);
      res.status(400).json({ message: "Invalid Google token" });
    }
  }
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
        expiresIn: "7d",
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
    const { userName, phoneNumber, address } = req.body;
    let image;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Users",
      });
      image = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    try {
      const updateData = {
        userName,
        phoneNumber,
        address,
      };
      if (image) updateData.image = image;
      const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }
      user.image = image;
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi cập nhật thông tin người dùng", error: error.message });
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
    const { email, password, userName, phoneNumber, address } = req.body;
    console.log(req.body);
    let image;
    if (!email || !password || !userName || !phoneNumber) {
      return res.status(400).json({ message: "Tất cả các trường là bắt buộc." });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Người dùng đã tồn tại." });
      }
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "user_images",
        });
        image = result.secure_url;
        fs.unlinkSync(req.file.path);
      }
      console.log("Before hashing password");
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hashed Password:", hashedPassword);
      const newUser = new User({
        email,
        password: hashedPassword,
        userName,
        phoneNumber,
        role: "ADMIN",
        image,
        address,
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
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Users",
      });
      image = result.secure_url;
      fs.unlinkSync(req.file.path);
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
      // Cập nhật trường `isDelete` thành 1 thay vì xóa người dùng
      const user = await User.findByIdAndUpdate(
        id,
        { isDelete: 1 },
        { new: true } // Tùy chọn `new: true` để trả về document sau khi được cập nhật
      );

      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      return res.status(200).json({ message: "Người dùng đã được đánh dấu là đã xóa." });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi khi đánh dấu người dùng là đã xóa", error });
    }
  }
}

export default new UserController();
