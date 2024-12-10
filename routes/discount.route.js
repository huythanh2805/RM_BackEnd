import express from "express";
import { createDiscount, deleteAll, deleteDiscountById, getAllDiscounts, getDiscountById, updateDiscountById } from "../controllers/discount.controller.js";

const router = express.Router();

router.get("/discount/:id", getDiscountById);
router.get("/discount", getAllDiscounts);
router.post("/discount", createDiscount);
router.delete("/discount/deleteAll", deleteAll);
router.delete("/discount/:id", deleteDiscountById);
router.patch("/discount/:id", updateDiscountById);

export default router;
