import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    amount: String,
    reference: String,
    message: String,
    emailId: String,
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },
  },
  { timestamps: true }
);

export const donationModel = mongoose.model("Donation Message", donationSchema);
