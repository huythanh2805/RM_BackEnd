import mongoose from "mongoose";

const conversationSchame = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId, 
        ref: "user",
    },
    adminIds: [{ 
        type: mongoose.Schema.ObjectId, 
        ref: "user",
    }],
}, 
{
    timestamps: true
}
)

export default mongoose.models.conversation || mongoose.model("conversation", conversationSchame)