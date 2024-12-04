import mongoose from "mongoose";

const userDiscountSchame = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    },
    discountId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'discount',
    },
    usedAt:{
      type: Date,
    },
    status: {
        type: String,
        enum: ["AVAILABLE", "USED", "EXPIRED"],
    },
    
}, 
{
    timestamps: true
}
)

export default mongoose.models.userDiscount || mongoose.model("userDiscount", userDiscountSchame)