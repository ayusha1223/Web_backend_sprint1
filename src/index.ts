import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

// ROUTES
import paymentRoutes from "./routes/payment.route";
import authRoutes from "./routes/auth.route";
import adminRoutes from "./routes/admin.route";
import cartRoutes from "./routes/cart.route";
import orderRoutes from "./routes/order.route";

// DB
import { connectDB } from "./database";

dotenv.config();
connectDB();

const app = express();

/* ================== MIDDLEWARE (ORDER MATTERS) ================== */

// 🔥 REQUIRED to read req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ ADD THIS

app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

/* ================== ROUTES ================== */

// PAYMENT
app.use("/api/payment", paymentRoutes);

// CART
app.use("/api/cart", cartRoutes); // ✅ FIXED PATH (IMPORTANT)

// ORDERS
app.use("/api/orders", orderRoutes); // ✅ THIS IS WHY ORDERS SAVE

// AUTH & ADMIN
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// STATIC UPLOADS
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

/* ================== SERVER ================== */

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
