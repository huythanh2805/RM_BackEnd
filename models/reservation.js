import mongoose from "mongoose";

const reservationSchame = new mongoose.Schema(
  {
    table_id: {
      type: mongoose.Schema.ObjectId,
      ref: "table",
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    userName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    detailAddress: {
      type: String,
    },
    guests_count: {
      type: Number,
      default: 1,
    },
    ordered_dishes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "orderedDish",
      },
    ],
    ordered_combos: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "orderedCombo",
      },
    ],
    userDiscountId: {
      type: mongoose.Schema.ObjectId,
      ref: "userDiscount",
    },
    deposit: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["ISWAITING", "ISCOMFIRMED", "SEATED", "COMPLETED", "CANCELED"],
      default: "ISWAITING",
    },
    startTime: {
      type: Date,
    },
    isOrderedOnline: {
      type: Boolean,
      default: false,
    },
    payment_method: {
      type: String,
      enum: ["CASH", "MOMO","ZALOPAY"],
      default: "CASH",
    },
    isUsedDiscount: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.reservation || mongoose.model("reservation", reservationSchame);
