import nodemailer from "nodemailer";

// Tạo transporter để gửi email
const Transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "thiuyen1132004@gmail.com",
    pass: "wguu pjyy vjnz edob", // Thay bằng mật khẩu ứng dụng (App password) của bạn
  },
});

export default Transporter;
