import mongoose from "mongoose";

const exportNotesSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    products: [
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
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      enum: ["INTERNAL", "RETURN", "EXPIRED", "ADJUSTMENT"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.models.export || mongoose.model("export-notes", exportNotesSchema);
