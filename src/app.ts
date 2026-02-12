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
import productRoutes from "./routes/product.routes";

dotenv.config();

const app = express();

/* ================== MIDDLEWARE ================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

/* ================== ROUTES ================== */

app.use("/api/payment", paymentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

export default app;
