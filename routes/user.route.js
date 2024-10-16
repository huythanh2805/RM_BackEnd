import express from "express";
import UserController from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/admin/list", auth, UserController.getListUsers);
router.get("/edit", auth, UserController.getUserProfile);
router.put("/edit", auth, upload.single("image"), UserController.updateUserProfile);
router.post("/admin/add", auth, UserController.addUser);
router.get("/admin/edit/:id", auth, UserController.getUserById);
router.put("/admin/edit/:id", auth, upload.single("image"), UserController.updateUserById);
router.delete("/admin/delete/:id", auth, UserController.deleteUser);
router.post("/forgot-password", UserController.requestPasswordReset);
router.post("/reset-password", UserController.resetPassword);
export default router;
