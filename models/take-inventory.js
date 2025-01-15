import mongoose from "mongoose";

const takeInventorySchema = new mongoose.Schema(
    {
        stock: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "stock",
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        lastQuantity: {
            type: Number,
            required: true,
            default: 0,
        },
        newQuantity: {
            type: Number,
            required: true,
            default: 0,
        },
        lastExpiryDate: {
            type: Date,
        },
        newExpiryDate: {
            type: Date,
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
    },
    { timestamps: true }
);

export default mongoose.models.takeInventory || mongoose.model("takeInventory", takeInventorySchema);
