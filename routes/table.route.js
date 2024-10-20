import express from "express";
import TableController from "../controllers/table.controller.js";

const router = express.Router();

const tableController = new TableController();

router.get("/tables", tableController.getAlltables);
router.get("/tables/:id", tableController.getDetailTable);
router.post("/tables", tableController.addNewTable);
router.put("/tables", tableController.updateOrderTable);
router.patch("/tables/:id", tableController.updateTableInformation);
router.delete("/tables/:id", tableController.deleteTable);

export default router;