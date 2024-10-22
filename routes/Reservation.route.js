import express from "express";
import ReservationController from "../controllers/reservation.controller.js";

const router = express.Router();

const reservationController = new ReservationController();

router.get("/reservations/v2/:table_id", reservationController.getReserDetailByTableId);

router.get("/reservations", reservationController.getAllReser);
router.get("/reservations/:reservation_id", reservationController.getReserDetailById);
router.post("/reservations", reservationController.createReservation);
router.put("/reservations/:reservation_id", reservationController.updateReservation);
router.patch("/reservations", reservationController.reselectTable);
router.delete("/reservations", reservationController.deleteReservationByIdArray);

export default router;