import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, },
});

export const AdminModel = mongoose.model("Admin", AdminSchema);

export const getAdminByUsername = (username: string) =>
  AdminModel.findOne({ username });
