import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

mongoose.Promise = Promise;

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongDB connection error:", error);
    process.exit(1);
  }
};

export default mongoose;
