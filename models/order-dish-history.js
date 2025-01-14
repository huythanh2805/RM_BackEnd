import mongoose from "mongoose"


const orderDishHistorySchame = new mongoose.Schema(
  { 
    code: {
      type: String,
      required: true,
    },
    reservation_id: {
      type: mongoose.Schema.ObjectId,
      ref: "reservation",
    },
    ordered_dish: {
      type: mongoose.Schema.ObjectId,
      ref: "orderedDish",
    },
    ordered_combo: {
      type: mongoose.Schema.ObjectId,
      ref: "orderedCombo",
    },
    quantity: {
      type: Number,
    },
    changer_id: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    isRequiredToCancel: {
       type: Boolean
    },
    previousStatus: {
        type: String,
        enum: ["ORDERED", "ISPREPARED", "ISCOMPLETED", "ISCANCELED"],
      },
    currentStatus: {
      type: String,
      enum: ["ORDERED", "ISPREPARED", "ISCOMPLETED", "ISCANCELED"],
      default: "ORDERED",
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.orderDishHistory ||
  mongoose.model("orderDishHistory", orderDishHistorySchame)
