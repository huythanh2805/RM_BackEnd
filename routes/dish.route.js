import express from "express";
import DishController from "../controllers/dish.controller.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

const dishController = new DishController();

router.get("/dishes", dishController.getAllDishes);
router.get("/dishes/:id", dishController.getDishDetail);
router.post("/dishes", upload.array("images", 10), dishController.createDish);
router.put("/dishes/:id", upload.array("images", 10), dishController.updateDish);
router.delete("/dishes/:id", dishController.deleteDish);

export default router;
