import express from "express";
import ReservationController from "../controllers/reservation.controller.js";

const router = express.Router();

const reservationController = new ReservationController();

router.get("/reservations", reservationController.getAllReser);
router.get("/reservations/:table_id", reservationController.getReserDetail);
router.post("/reservations", reservationController.createReservation);
router.delete("/reservations", reservationController.deleteReservationByIdArray);
export default router;