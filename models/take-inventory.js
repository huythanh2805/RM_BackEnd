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
        lastStatus: {
            type: Boolean, default: true,
        },
        newStatus: {
            type: Boolean, default: true,
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.models.takeInventory || mongoose.model("takeInventory", takeInventorySchema);
