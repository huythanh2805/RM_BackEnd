import mongoose from "mongoose";
 
const kitChenNotifySchame = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    orderedCode: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.kitchenNotify || mongoose.model("kitchenNotify", kitChenNotifySchame);
