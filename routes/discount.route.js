import express from "express";
import { createDiscount, deleteAll, deleteDiscountById, getAllDiscounts, getAllDiscountsClient, getDiscountById, updateDiscountById } from "../controllers/discount.controller.js";

const router = express.Router();

router.get("/discount/:id", getDiscountById);
router.get("/discount", getAllDiscounts);
router.get("/discount-client", getAllDiscountsClient);
router.post("/discount", createDiscount);
router.delete("/discount/deleteAll", deleteAll);
router.delete("/discount/:id", deleteDiscountById);
router.patch("/discount/:id", updateDiscountById);

export default router;
