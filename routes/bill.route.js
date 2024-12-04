import express from "express";
import BillController from "../controllers/bill.controller.js";
const billRouter = (io) => {
  const router = express.Router();

  const billController = new BillController(io);

  router.get("/bills/:id", billController.getBillById);
  router.post("/bills", billController.createBill);
  router.get("/bills", billController.getAll);
  router.post("/webhook/seepay", billController.payment);
  return router;
};

export default billRouter;
