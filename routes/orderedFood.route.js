import express from "express";
import ReservationController from "../controllers/reservation.controller.js";
import OrderedFoodController from "../controllers/orderedFood.controller.js";

const router = express.Router();

const orderedFoodController = new OrderedFoodController();

router.get("/orderedFood/:reservationId", orderedFoodController.getAllOrderedFood);
router.post("/orderedFood", orderedFoodController.addNewOrderedDish);
router.patch("/orderedFood", orderedFoodController.updateOrderedDishesStatus);
// router.put("/orderedFood", orderedFoodController.updateOrderedDishesStatus);
router.delete("/orderedFood/:orderedDishId/:reservationId", orderedFoodController.deleteOrderedDish);

export default router;