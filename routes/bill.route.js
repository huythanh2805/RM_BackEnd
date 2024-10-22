import express from "express";
import BillController from "../controllers/bill.controller.js";

const router = express.Router();

const billController = new BillController();

router.get("/bills/:id", billController.getBillById);
router.post("/bills", billController.createBill);

export default router;