import mongoose from "mongoose";

const workScheduleSchame = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.ObjectId,
        ref: "employee",
    },
    week_1: {
        type: mongoose.Schema.ObjectId,
        ref: "shift",
    },
    week_2: {
        type: mongoose.Schema.ObjectId,
        ref: "shift",
    },
    week_3: {
        type: mongoose.Schema.ObjectId,
        ref: "shift",
    },
    week_4: {
        type: mongoose.Schema.ObjectId,
        ref: "shift",
    },
}, 
{
    timestamps: true
}
)

export default mongoose.models.workSchedule || mongoose.model("workSchedule", workScheduleSchame)