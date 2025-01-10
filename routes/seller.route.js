import express from "express";
import SellerController from "../controllers/seller.controller.js";

const router = express.Router();

const sellerController = new SellerController();

router.get("/sellers", sellerController.fetchListSeller);
router.delete("/sellers/:id", sellerController.deleteSellers);
router.post("/sellers/create", sellerController.createSellers);
router.get("/sellers/:id", sellerController.getDetailSeller);
router.put("/sellers/:id", sellerController.updateSellers);

export default router;
