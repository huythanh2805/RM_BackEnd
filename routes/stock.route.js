import express from "express";
import StockController from "../controllers/stock.controller.js";

const router = express.Router();

const stockController = new StockController();

router.get("/stocks", stockController.fetchListStock);
router.put("/stocks/:id", stockController.updateStock);

export default router;
