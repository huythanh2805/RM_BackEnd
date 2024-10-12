import mongoose from "mongoose"

const billSchame = new mongoose.Schema(
  {
    reservation_id: {
      type: mongoose.Schema.ObjectId,
      ref: "reservation",
      required: true
    },
    total_money: {
      type: Number,
      required: true,
    },
    original_money: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["ISNOTPAID", "ISPAID"],
      default: "ISNOTPAID",
    },
    discount: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.bill || mongoose.model("bill", billSchame)
