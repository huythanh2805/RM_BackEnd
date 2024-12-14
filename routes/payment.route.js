import express from "express";
const router = express.Router();
import { conFirmedSuccessPayment, MoMopayment } from "../controllers/momo.controller.js";
import { createZaloTransaction, zaloTransactionCallback } from "../controllers/zaloPay.controller.js";

router.post("/payment/zalo/callback", zaloTransactionCallback );
router.post("/payment/zalo", createZaloTransaction );
router.post("/payment/ipnUrl", conFirmedSuccessPayment );
router.post("/payment", MoMopayment );

export default router;