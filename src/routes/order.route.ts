import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

const router = Router();

router.post("/", OrderController.createOrder);
router.get("/", OrderController.getAllOrders);
router.get("/:orderId", OrderController.getOrderById);

export default router;
