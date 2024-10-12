import mongoose from "mongoose";

const employeeSchame = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE"],
    },
    workPosition: {
        type: String,
        required: true,
    },
    employStatus: {
        type: String,
        enum: ["ACTIVE", "LEAVED"],
        default: "ACTIVE"
    },
    workSchedule: {
        type: mongoose.Schema.ObjectId,
        ref: "workSchedule",
    }
}, 
{
    timestamps: true
}
)

export default mongoose.models.employee || mongoose.model("employee", employeeSchame)