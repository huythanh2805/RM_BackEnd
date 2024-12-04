import express from "express";
import { createUserDiscount, getAllUserDiscount } from "../controllers/userDiscount.controller.js";

const router = express.Router();

router.post("/userDiscount", createUserDiscount);
router.get("/userDiscount/:userId", getAllUserDiscount);

export default router;
