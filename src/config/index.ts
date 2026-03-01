import dotenv from "dotenv";

if (process.env.NODE_ENV === "test") {
  dotenv.config({
    path: ".env.test",
    override: true, // important
  });
} else {
  dotenv.config({
    path: ".env",
  });
}

// Server Port
export const PORT: number =
  process.env.PORT ? parseInt(process.env.PORT) : 3000;

// MongoDB connection string
export const MONGODB_URI: string =
  process.env.MONGO_URI || "mongodb://localhost:27017/defaultdb";

// JWT Secret
export const JWT_SECRET: string =
  process.env.JWT_SECRET || "default";

// Refresh token secret (if used)
export const REFRESH_TOKEN_SECRET: string =
  process.env.REFRESH_TOKEN_SECRET || "default_refresh";