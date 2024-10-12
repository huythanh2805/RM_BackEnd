import mongoose from "mongoose";

const setComboSchame = new mongoose.Schema({
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
}, 
{
    timestamps: true
}
)

export default mongoose.models.setCombo || mongoose.model("setCombo", setComboSchame)