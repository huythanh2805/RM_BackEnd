import mongoose from "mongoose";

const billSchame = new mongoose.Schema(
  {
    reservation_id: {
      type: mongoose.Schema.ObjectId,
      ref: "reservation",
      required: true,
    },
    billDetail_id: {
      type: mongoose.Schema.ObjectId,
      ref: "billDetail",
    },
    original_money: {
      type: Number,
      required: true,
    },
    VAT: {
      type: Number,
      default: 5,
      // Tính theo phần trăm
    },
    total_money: {
      type: Number,
    },
    discount_money: {
      type: Number,
    },
    deposit_money: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["ISNOTPAID", "ISPAID"],
      default: "ISNOTPAID",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.bill || mongoose.model("bill", billSchame);
