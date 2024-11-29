import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notifications || mongoose.model("Notifications", NotificationSchema);
