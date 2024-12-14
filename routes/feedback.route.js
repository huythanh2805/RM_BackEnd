import express from "express";
import FeedbackController from "../controllers/feedback.controller.js";

const router = express.Router();

const feedbackController = new FeedbackController();

router.get("/feedbacks", feedbackController.getAllFeedback);
router.get("/feedbacks/dish/:id", feedbackController.getFeedbackByDishId);
router.get("/feedbacks/combo/:id", feedbackController.getFeedbackByComboId);
router.post("/feedbacks", feedbackController.createFeedback);
router.put("/feedbacks/:id", feedbackController.updateFeedback);
router.delete("/feedbacks/:id", feedbackController.deleteFeedback);

export default router;
