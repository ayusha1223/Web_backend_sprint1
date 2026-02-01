import mongoose from "mongoose";
import { MONGODB_URI } from "../config";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database Error:", error);
    process.exit(1);
  }
};
