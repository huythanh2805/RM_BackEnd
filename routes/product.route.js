import express from "express";
import ProductController from "../controllers/product.controller.js";

const router = express.Router();

const productController = new ProductController();

router.get("/products", productController.fetchListProduct);
router.delete("/products/:id", productController.deleteProduct);
router.post("/products/create", productController.createProduct);
router.get("/products/:id", productController.getDetailProduct);
router.put("/products/:id", productController.updateProduct);

export default router;
