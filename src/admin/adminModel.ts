import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
  },
  {
    timestamps: true,
  }
);
export const AdminModel = mongoose.model("Admin", AdminSchema);
