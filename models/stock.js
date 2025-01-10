import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: Boolean, default: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.stock || mongoose.model("stock", stockSchema);
