import express from "express";
import CategoryController from "../controllers/category.controller.js";

const router = express.Router();

const categoryController = new CategoryController();

router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getDetailCategory);
router.post("/categories", categoryController.createCategory);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

export default router;
