import mongoose from "mongoose";

const importNotesSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        expiryDate: {
          type: Date,
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.models.import || mongoose.model("import-notes", importNotesSchema);
