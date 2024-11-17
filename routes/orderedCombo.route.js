import express from "express";
import OrderedComboController from "../controllers/OrderedCombo.controller.js";

const router = express.Router();

const OrderedCombo = new OrderedComboController();


router.get("/orderedCombo", OrderedCombo.getAllCombo);
router.post("/orderedCombo", OrderedCombo.addNewOrderedCombo);
router.patch("/orderedCombo/:orderedDishId", OrderedCombo.updateOrderCombo);
router.delete("/orderedCombo/:orderedDishId/:reservationId", OrderedCombo.deleteOrderedCombo);
export default router;