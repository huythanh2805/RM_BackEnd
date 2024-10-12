import mongoose from "mongoose";

const billComboSchame = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    images: [
       {
        type: String,
        required: true
       }
    ],
    desc: {
        type: String,
    },
    isShow: {
        type: Boolean,
        default: true
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

export default mongoose.models.billCombo || mongoose.model("billCombo", billComboSchame)