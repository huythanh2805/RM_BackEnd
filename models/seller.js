import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.seller || mongoose.model("seller", sellerSchema);
