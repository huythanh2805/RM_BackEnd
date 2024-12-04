import express from "express";
import { createDiscount, getAllDiscounts } from "../controllers/discount.controller.js";

const router = express.Router();

router.get("/discount", getAllDiscounts);
router.post("/discount", createDiscount);

export default router;
