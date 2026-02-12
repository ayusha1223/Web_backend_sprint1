import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import auth from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";

const router = Router();

/**
 * USER ROUTE
 * Create order (must be logged in)
 */
router.post("/", auth, OrderController.createOrder);

/**
 * ADMIN ROUTES
 * View all orders (admin only)
 */
router.get("/", auth, admin, OrderController.getAllOrders);

/**
 * View single order
 * Logged in user OR admin (for now admin only)
 */
router.get("/:orderId", auth, OrderController.getOrderById);

export default router;
