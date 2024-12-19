import express from "express";
import { 
     getReservationStatusCount,
     getRevenueDashboard,
     getTop5OrderedDishes,
     getTop5OUserOrder,
} from "../controllers/dashboard.controller.js";
const router = express.Router();


router.post("/dashboard/revenue", getRevenueDashboard);
router.post("/dashboard/top5", getTop5OrderedDishes);
router.post("/dashboard/reservationState", getReservationStatusCount);
router.post("/dashboard/top5User", getTop5OUserOrder);

export default router;
