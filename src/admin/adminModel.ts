import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
});

export const AdminModel = mongoose.model("AdminModel", AdminSchema);
