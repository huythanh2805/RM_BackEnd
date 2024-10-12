import mongoose from "mongoose";

const dishSchame = new mongoose.Schema({
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
    category_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'category',
    },
}, 
{
    timestamps: true
}
)

export default mongoose.models.dish || mongoose.model("dish", dishSchame)