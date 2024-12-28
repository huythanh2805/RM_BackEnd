import express from "express";
import WorkScheduleController from "../controllers/workSchedule.controller.js";

const router = express.Router();

const workScheduleController = new WorkScheduleController();

router.get("/workSchedules", workScheduleController.getAllworkSchedule);
router.get("/workSchedules/:id", workScheduleController.getWorkScheduleDetail);
router.post("/workSchedules", workScheduleController.createWorkSchedule);
router.put("/workSchedules/:id", workScheduleController.updateWorkSchedule);
router.delete("/workSchedules/:id", workScheduleController.deleteWorkSchedule);
 
export default router;
