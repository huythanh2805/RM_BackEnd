import express from "express";
import UserController from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js"; // Middleware upload sử dụng multer

const router = express.Router();

// Các routes dành cho người dùng
router.post("/google-login", UserController.googleLogin);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/edit", auth, UserController.getUserProfile);
router.put("/edit", auth, upload.single("image"), UserController.updateUserProfile);
router.post("/forgot-password", UserController.requestPasswordReset);
router.post("/reset-password", UserController.resetPassword);

// Các routes dành cho quản trị viên
router.get("/admin/list", auth, UserController.getListUsers);
router.post("/admin/add", auth, upload.single("image"), UserController.addUser);
router.get("/admin/edit/:id", auth, UserController.getUserById);
router.put("/admin/edit/:id", auth, upload.single("image"), UserController.updateUserById);
router.delete("/admin/delete/:id", auth, UserController.deleteUser);

export default router;
