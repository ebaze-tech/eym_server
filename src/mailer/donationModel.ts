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
  { timestamps: true, collection: "Donations" }
);

export const donationModel = mongoose.model("Donations", donationSchema);
