import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

// Server Port
export const PORT: number =
  process.env.PORT ? parseInt(process.env.PORT) : 3000;

// MongoDB connection string
export const MONGODB_URI: string =
  process.env.MONGO_URI || "mongodb://localhost:27017/defaultdb";

// JWT Secret
export const JWT_SECRET: string =
  process.env.JWT_SECRET || "default";
