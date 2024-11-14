import mongoose from "mongoose";

const messageSchame = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.ObjectId, 
        ref: "user",
    },
    conversationId: {
        type: mongoose.Schema.ObjectId, 
        ref: "conversation",
    },
    text: {
        type: String, 
    },
    seen: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String, 
    }
}, 
{
    timestamps: true
}
)

export default mongoose.models.message || mongoose.model("message", messageSchame)