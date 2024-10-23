import mongoose from "mongoose";

const UserSchame = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: ["CLIENT", "ADMIN"],
      default: "CLIENT",
      required: true,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    provider: { type: String, required: false },
    resetPasswordToken: { type: String }, // Thêm trường này
    resetPasswordExpires: { type: Date },
    isdelete: { type: Number, default: 0 }, // Thêm trường này
  },
  {
    timestamps: true,
  }
);

export default mongoose.models?.user || mongoose.model("User", UserSchame);
