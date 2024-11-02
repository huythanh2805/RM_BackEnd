import express from "express";
import SetComboController from "../controllers/setCombo.controller.js";

const router = express.Router();

const setComboController = new SetComboController();

router.get("/setCombos", setComboController.getAllSetCombos);
router.get("/setCombos/:id", setComboController.getSetComboDetail);
router.post("/setCombos", setComboController.createSetCombo);
router.put("/setCombos/:id", setComboController.updateSetCombo);
router.delete("/setCombos/:id", setComboController.deleteSetCombo);

export default router;
