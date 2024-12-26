import express from "express";
import { getOrderDishHistoryById } from "../controllers/order-dish-history.js";
const router = express.Router();



router.get("/order-dish-history/:id", getOrderDishHistoryById);

export default router;