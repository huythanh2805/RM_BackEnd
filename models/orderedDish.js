import mongoose from "mongoose";
 import { generateUUID } from "../uitls/GenerateUUID.js"
const orderedDishSchame = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        default: () => generateUUID()
    },
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
      enum: ["ORDERED","ISPREPARED", "ISCOMPLETED", "ISCANCELED"],
      default: "ORDERED",
    }
}, 
{
    timestamps: true
}
)

export default mongoose.models.orderedDish || mongoose.model("orderedDish", orderedDishSchame)