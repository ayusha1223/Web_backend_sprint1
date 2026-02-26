import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import reverseRoute from "./routes/reverse.route";

// ROUTES
import paymentRoutes from "./routes/payment.route";
import authRoutes from "./routes/auth.route";
import adminRoutes from "./routes/admin.route";
import cartRoutes from "./routes/cart.route";
import orderRoutes from "./routes/order.route";
import productRoutes from "./routes/product.routes";
import notificationRoutes from "./routes/notification.route";

dotenv.config();

const app = express();

/* ================== MIDDLEWARE ================== */

// ✅ MOVE CORS HERE (VERY TOP)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/notifications", notificationRoutes);

/* ================== ROUTES ================== */

app.use("/api", reverseRoute);
app.use("/api/payment", paymentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

export default app;