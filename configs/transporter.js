import nodemailer from "nodemailer";

// Tạo transporter để gửi email
const Transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "thiuyen1132004@gmail.com",
    pass: "wguu pjyy vjnz edob", // Thay bằng mật khẩu ứng dụng (App password) của bạn
  },
});

export const sendEmailConfirmedStatus = (email, text)=>{
  const mailOptions = {
    from: "thiuyen1132004@gmail.com", // Địa chỉ email gửi
    to: email, // Địa chỉ email nhận
    subject: "Thông báo từ nhà hàng Goldren Fork",
    text: text,
  };
  // Gửi email
  return Transporter.sendMail(mailOptions);
}

export default Transporter;
