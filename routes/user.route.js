import express from "express";
import UserController from "../controllers/user.controller.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/list", UserController.getListUsers);
router.get("/edit", UserController.getUserProfile);
router.put("/edit", upload.single("image"), UserController.updateUserProfile);
router.delete("/delete/:id", UserController.deleteUser);

export default router;
