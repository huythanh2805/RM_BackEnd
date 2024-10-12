import mongoose from "mongoose";

const userSchame = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    userName: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    address: {
        type: String
    },
    role: {
        type: String,
        enum: ['CLIENT', 'ADMIN'],
        default: "CLIENT",
        required: true
    },
    emailVerified:{
        type: Date,
        default: null
    },
}, 
{
    timestamps: true
})

export default mongoose.models?.user || mongoose.model("user", userSchame)