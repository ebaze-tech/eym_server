import mongoose from "mongoose";

const VolunteerSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phoneNumber: String,
    occupation: String,
    skills: String,
    interests: String,
    availability: String,
    status: {
      type: String,
      enum: ["approved", "rejected"],
      default: "approved",
    },
    emailId: String,
  },
  {
    timestamps: true,
    collection: "Volunteers",
  }
);

export const VolunteerModel = mongoose.model("VolunteerModel", VolunteerSchema);
