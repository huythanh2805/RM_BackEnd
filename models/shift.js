import mongoose from "mongoose";

const shiftSchame = new mongoose.Schema({
    shift: {
        type: String,
        default: "Ca 1",
        required: true
    }, 
    money: {
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