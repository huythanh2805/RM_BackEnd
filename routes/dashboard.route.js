import express from "express";
import { 
     getReservationStatusCount,
     getRevenueDashboard,
     getTop5OrderedDishes,
     getTotalRevenueByMonth } from "../controllers/dashboard.controller.js";
const router = express.Router();


router.get("/dashboard/revenue/6months/:month/:year", getTotalRevenueByMonth);
router.get("/dashboard/revenue/:month/:year", getRevenueDashboard);
router.get("/dashboard/top5/:month/:year", getTop5OrderedDishes);
router.get("/dashboard/reservationState/:month/:year", getReservationStatusCount);

export default router;
