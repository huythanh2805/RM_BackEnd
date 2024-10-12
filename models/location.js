import mongoose from "mongoose";

const locationSchame = new mongoose.Schema({
    locationInRestaurant: {
        type: String,
        default: "Location_Name",
    },
    order: {
        type: Number,
        required: true
    },
    tables: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "table",
        }
    ]

}, 
{
    timestamps: true
}
)

export default mongoose.models.location || mongoose.model("location", locationSchame)