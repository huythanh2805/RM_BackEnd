import mongoose from "mongoose";

const workScheduleSchame = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.ObjectId,
        ref: "employee",
    },
    month: {
        type: String
    },
    week_1: {
        type: Number,
        enum: [1, 2, 3],
        default: 1
    },
    week_2: {
        type: Number,
        enum: [1, 2, 3],
        default: 1
    },
    week_3: {
        type: Number,
        enum: [1, 2, 3],
        default: 1
    },
    week_4: {
        type: Number,
        enum: [1, 2, 3],
        default: 1
    },
    isShow:{
        type: Boolean,
        default: false
    }
    // week_1: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "shift", 
    // },
    // week_2: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "shift",
    // },
    // week_3: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "shift",
    // },
    // week_4: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "shift",
    // },
}, 
{
    timestamps: true
}
)

export default mongoose.models.workSchedule || mongoose.model("workSchedule", workScheduleSchame)