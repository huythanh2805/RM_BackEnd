import mongoose from "mongoose";

const orderedDishSchame = new mongoose.Schema({
    dishes_id: {
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
}, 
{
    timestamps: true
}
)

export default mongoose.models.orderedDish || mongoose.model("orderedDish", orderedDishSchame)