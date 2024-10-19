import multer from "multer";
import path from "path";

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/"); // Thư mục lưu tệp
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên tệp
  },
});

const upload = multer({ storage: storage });

export default upload;
