import mongoose from "mongoose";

const PartnershipSchema = new mongoose.Schema(
  {
    organizationName: String,
    contactPerson: String,
    email: String,
    partnershipType: String,
    message: String,
    phoneNumber: String,

    emailId: String,
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },
  },
  { timestamps: true }
);

export const partnershipModel = mongoose.model(
  "Partnerships",
  PartnershipSchema
);
