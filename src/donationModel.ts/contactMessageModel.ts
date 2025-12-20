import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    subject: String,
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

export default mongoose.model("ContactMessage", contactMessageSchema);
