import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, unique: true },
  gender: { type: String },
  dateOfBirth: { type: String },
  religion: { type: String },
  phoneNumber: { type: String },
  residentialAddress: { type: String },
  town: { type: String },
  city: { type: String },
  country: { type: String },
  compound: { type: String },
  quarter: { type: String },
  occupation: { type: String },
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();

export const getUserByName = (fullName: string) =>
  UserModel.findOne({ fullName });

export const getUserById = (id: string) => UserModel.findById(id);

export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });

export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findOneAndUpdate({ _id: id }, values, { new: true });
