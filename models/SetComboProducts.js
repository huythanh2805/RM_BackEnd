import mongoose from "mongoose";

const setComboProductSchame = new mongoose.Schema({
    dishes: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'dish',
        },
    ],
    combo_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'setCombo',
        },

}, 
{
    timestamps: true
}
)

export default mongoose.models.setComboProduct || mongoose.model("setComboProduct", setComboProductSchame)