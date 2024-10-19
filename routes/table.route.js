import express from "express";
import TableController from "../controllers/table.controller.js";

const router = express.Router();

const dishController = new DishController();

router.get("/tables", TableController.getAlltables);
router.post("/tables", TableController.addNewTable);
router.put("/tables", TableController.updateOrderTable);
router.put("/tables/:id", TableController.updateTableInformation);
router.delete("/tables/:id", TableController.deleteTable);

export default router;