import mongoose from "mongoose";

const orderedDishSchame = new mongoose.Schema({
    dish_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'dish'
    },
    reservation_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'reservation'
    },
    quantity: {
        type: Number,
        default: 1,
        required: true
    },
    status: {
      type: String,
      enum: ["ISPREPARED", "ISCOMPLETED", "ISCANCELED"],
      default: "ISPREPARED",
    }
}, 
{
    timestamps: true
}
)

export default mongoose.models.orderedDish || mongoose.model("orderedDish", orderedDishSchame)