import mongoose from "mongoose";

const discountSchame = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    discountType: {
        type: String,
        enum: ["FIXEDAMOUNT", "PERCENTAGE"],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    expireDate: {
        type: Date,
        required: true,
        default: null
    },
    minimumMoney: {
        type: Number,
        required: true
    }
}, 
{
    timestamps: true
}
)

export default mongoose.models.discount || mongoose.model("discount", discountSchame)