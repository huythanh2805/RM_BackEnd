import express from "express";
import ReservationController from "../controllers/reservation.controller.js";

const reservationRoute = (io) => {
  const router = express.Router();
  const reservationController = new ReservationController(io); 

  router.get("/reservations/v2/:table_id", reservationController.getReserDetailByTableId);
  router.post("/reservations/v2/client", reservationController.createClientReservation);
  router.get("/reservations/user/:userId", reservationController.getReservationsByUser);
  router.get("/reservations/history-detail/:reservation_id", reservationController.getReserDetailById);
  router.put("/reservations/cancel/:reservation_id", reservationController.cancelReservationById);
  router.get("/reservations", reservationController.getAllReser);
  router.get("/reservations/:reservation_id", reservationController.getReserDetailById);
  router.post("/reservations", reservationController.createAdminReservation);
  router.put("/reservations/:reservation_id", reservationController.updateReservation);
  router.delete("/reservations", reservationController.deleteReservationByIdArray);
  router.patch("/reservations/reselect", reservationController.reselectTable);
  router.patch("/reservations/select", reservationController.selectTable);
  return router;
};

export default reservationRoute;
