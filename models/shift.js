import mongoose from "mongoose";

const shiftSchame = new mongoose.Schema({
    name: {
        type: String,
        default: "Table_Name",
        required: true
    },
    startTime: {
        type: Date,
    },
    endTime: {
        type: Date,
    }

}, 
{
    timestamps: true
}
)

export default mongoose.models.shift || mongoose.model("shift", shiftSchame)