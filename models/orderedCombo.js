import mongoose from "mongoose";
import { generateUUID } from "../uitls/GenerateUUID.js"
 
const OrderedComboSchame = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        default: () => generateUUID()
    },
    setComboProduct_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'setComboProduct'
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
    isRequiredToCancel: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["ORDERED", "ISPREPARED", "ISCOMPLETED", "ISCANCELED"],
        default: "ORDERED",
      }
}, 
{
    timestamps: true
}
)

export default mongoose.models.orderedCombo || mongoose.model("orderedCombo", OrderedComboSchame)