import express from "express";
import DishController from "../controllers/dish.controller.js";

const router = express.Router();

const dishController = new DishController();

router.get("/dishes", dishController.getAllDishes);
router.get("/dishes/:id", dishController.getDishDetail);
router.post("/dishes", dishController.createDish);
router.put("/dishes/:id", dishController.updateDish);
router.delete("/dishes/:id", dishController.deleteDish);

export default router;
