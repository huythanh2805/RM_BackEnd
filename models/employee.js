import mongoose from "mongoose";
 
const employeeSchame = new mongoose.Schema({
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
    // salary: {
    //     type: Number,
    //     required: true
    // },
    employStatus: {
        type: String,
        enum: ["ACTIVE", "LEAVED"],
        default: "ACTIVE"
    },
    workSchedule: {
        type: mongoose.Schema.ObjectId,
        ref: "workSchedule",
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
}, 
{
    timestamps: true
}
)

export default mongoose.models.employee || mongoose.model("employee", employeeSchame)