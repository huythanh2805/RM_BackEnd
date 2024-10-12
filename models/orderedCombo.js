import mongoose from "mongoose";

const OrderedComboSchame = new mongoose.Schema({
    orderedCombo: {
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
}, 
{
    timestamps: true
}
)

export default mongoose.models.orderedCombo || mongoose.model("orderedCombo", OrderedComboSchame)