import mongoose from "mongoose";

const feedBackSchame = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    dish_id: {
      type: mongoose.Schema.ObjectId,
      ref: "dish",
    },
    setcombo_id: {
      type: mongoose.Schema.ObjectId,
      ref: "setCombo",
    },
    isShow: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.feedback ||
  mongoose.model("feedback", feedBackSchame);
