import mongoose from "mongoose"

const billDetailSchame = new mongoose.Schema(
  {
    bill_id: {
      type: mongoose.Schema.ObjectId,
      ref: "bill",
      required: true
    },
    orderedDishes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "billDish",
        },
    ],
    orderedCombos: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "billCombo",
        },
    ]
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.billDetail || mongoose.model("billDetail", billDetailSchame)
