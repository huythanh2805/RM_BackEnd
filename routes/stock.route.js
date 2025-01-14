import express from "express";
import StockController from "../controllers/stock.controller.js";

const router = express.Router();

const stockController = new StockController();

router.get("/stocks", stockController.fetchListStock);
router.get("/stocks/status", stockController.fetchListStockStatus);
router.put("/stocks/:id", stockController.updateStock);
router.get("/stocks/history-take-inventory/:id", stockController.getListTakeInventoryByStockID);
router.patch("/stocks/update-take-inventory", stockController.updateStockTakeInventory);

export default router;
