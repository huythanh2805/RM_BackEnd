import express from "express";
import { createUserDiscount, GetAllAvailableDiscount, getAllUserDiscount, getUserDiscountByCode, getUserDiscountByReservationId } from "../controllers/userDiscount.controller.js";

const router = express.Router();

router.get("/userDiscount/reservation/client/getAvailableStatus/:userId", GetAllAvailableDiscount);
router.get("/userDiscount/reservation/admin/:code/:totalPrice/:reservationId", getUserDiscountByCode);
router.get("/userDiscount/reservation/:reservationId", getUserDiscountByReservationId);
router.post("/userDiscount", createUserDiscount);
router.get("/userDiscount/:userId", getAllUserDiscount);

export default router;
