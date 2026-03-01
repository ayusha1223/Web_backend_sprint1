import mongoose from "mongoose";
import { MONGODB_URI } from "../config";

export const connectDB = async () => {
  try {
    // ✅ Prevent multiple connections
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database Error:", error);

    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    } else {
      throw error;
    }
  }
};


export const connectDBTest = async () => {
  try {
    // ✅ Prevent multiple connections
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect("mongodb://127.0.0.1:27017/naayu_test_db");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database Error:", error);
  }
};