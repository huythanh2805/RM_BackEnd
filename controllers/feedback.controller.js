import Feedback from "../models/feedback.js";

class FeedbackController {
  async getAllFeedback(req, res) {
    try {
      const feedbacks = await Feedback.find({})
        .populate("user_id", "email userName image createdAt")
        .populate("dish_id", "name")
        .populate("setcombo_id", "name");

      if (feedbacks.length === 0) {
        return res.status(404).json({
          message: "No feedbacks found",
        });
      }

      return res.status(200).json({ feedbacks });
    } catch (error) {
      return res.status(500).json({
        message: "Get all feedbacks failed",
        error: error.message,
      });
    }
  }

  async getFeedbackByDishId(req, res) {
    const { id } = req.params;

    try {
      const feedbacks = await Feedback.find({ dish_id: id })
        .populate("user_id", "email userName image createdAt")
        .populate("dish_id", "name");

      if (feedbacks.length === 0) {
        return res
          .status(404)
          .json({ message: "No feedbacks found for this dish" });
      }

      return res.status(200).json({ feedbacks });
    } catch (error) {
      return res.status(500).json({
        message: "Get feedbacks by dish ID failed",
        error: error.message,
      });
    }
  }

  async getFeedbackByComboId(req, res) {
    const { id } = req.params;

    try {
      const feedbacks = await Feedback.find({ setcombo_id: id })
        .populate("user_id", "email userName image createdAt")
        .populate("setcombo_id", "name");

      if (feedbacks.length === 0) {
        return res
          .status(404)
          .json({ message: "No feedbacks found for this combo" });
      }

      return res.status(200).json({ feedbacks });
    } catch (error) {
      return res.status(500).json({
        message: "Get feedbacks by combo ID failed",
        error: error.message,
      });
    }
  }

  async createFeedback(req, res) {
    try {
      const feedback = await Feedback.create(req.body);

      return res.status(201).json({ feedback });
    } catch (error) {
      return res.status(500).json({
        message: "Create feedback failed",
        error: error.message,
      });
    }
  }

  async updateFeedback(req, res) {
    try {
      const feedback = await Feedback.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      if (!feedback) {
        return res.status(404).json({
          message: "Feedback not found",
        });
      }

      return res.status(201).json({ feedback });
    } catch (error) {
      return res.status(500).json({
        message: "Create feedback failed",
        error: error.message,
      });
    }
  }

  async deleteFeedback(req, res) {
    try {
      const feedback = await Feedback.findByIdAndDelete(req.params.id);

      if (!feedback) {
        return res.status(404).json({
          message: "Feedback not found",
        });
      }

      return res.status(200).json({
        message: "Delete successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Delete feedback failed",
        error: error.message,
      });
    }
  }
}

export default FeedbackController;
