import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import { connectDB } from "./database";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
