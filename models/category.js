import mongoose from "mongoose";

const categorySchame = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    unique: true
   },
    desc: {
        type: String,
    },
    isShow: {
        type: Boolean,
        required: true,
        default: true,
    },
    dishes_id: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'dish',
        },
    ]
}, 
{
    timestamps: true
}
)

export default mongoose.models.category || mongoose.model("category", categorySchame)