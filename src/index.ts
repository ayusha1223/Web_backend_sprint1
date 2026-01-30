import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./database";
import authRoutes from "./routes/auth.route";
import adminRoutes from "./routes/admin.route";

dotenv.config();             
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);



const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
