import { Request, Response } from "express";
import Order from "../models/order.model"; // ✅ DEFAULT IMPORT

export class OrderController {
  // CREATE ORDER
  // CREATE ORDER
static async createOrder(req: Request, res: Response) {
  try {
    const order = await Order.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: order._id,   // ✅ IMPORTANT
    });
  } catch (error) {
    console.error("Order creation error:", error);

    return res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
}


  // GET ALL ORDERS
  static async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch orders" });
    }
  }
  // GET ORDER BY ID
static async getOrderById(req: Request, res: Response) {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.json(order);
  } catch (error) {
    console.error("Fetch order error:", error);

    return res.status(500).json({
      message: "Failed to fetch order",
    });
  }
}

}
