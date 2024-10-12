import mongoose from "mongoose";

const billDishSchame = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    images: [
       {
        type: String,
       }
    ],
    desc: {
        type: String,
    },
    isShow: {
        type: Boolean,
    },
    category_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'category',
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

export default mongoose.models.billDish || mongoose.model("billDish", billDishSchame)