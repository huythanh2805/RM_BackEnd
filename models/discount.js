import mongoose from "mongoose";

const discountSchame = new mongoose.Schema({
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
    minOrderValue: {
        type: Number,
        required: true
    },
    totalQuantity: {
        type: Number,
        required: true
    },
    remainingQuantity: {
        type: Number,
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    },
    isActive: {
        type: Boolean,
    },
}, 
{
    timestamps: true
}
)

export default mongoose.models.discount || mongoose.model("discount", discountSchame)