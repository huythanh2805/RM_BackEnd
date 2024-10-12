import mongoose from "mongoose";

const feedBackSchame = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'location'
    },
    dish_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'location'
    },

}, 
{
    timestamps: true
}
)

export default mongoose.models.feedback || mongoose.model("feedback", feedBackSchame)