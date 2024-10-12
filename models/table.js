import mongoose from "mongoose";

const tableSchame = new mongoose.Schema({
    name: {
        type: String,
        default: "Table_Name",
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    number_of_seats: {
        type: Number,
        required: true,
        default: 1
    },
    location_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'location'
    },
    status: {
        type: String,
        required: true,
        enum: ['AVAILABLE', 'ISSERVING'],
        default: "AVAILABLE"
    }

}, 
{
    timestamps: true
}
)

export default mongoose.models.table || mongoose.model("table", tableSchame)