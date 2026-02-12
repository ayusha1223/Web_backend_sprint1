import { Request, Response } from "express";
import Order from "../models/order.model";
import Payment from "../models/payment.model";

export class OrderController {

  static async createOrder(req: Request, res: Response) {
    try {
      const {
        userId,
        items,
        totalAmount,
        paymentMethod,
        address,
      } = req.body;

      if (!userId || !items || !totalAmount) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // 1️⃣ Create Order
      const order = await Order.create({
        userId,
        items,
        totalAmount,
        paymentMethod,
        paymentStatus:
          paymentMethod === "COD" ? "Pending" : "Paid",
        address,
      });

      // 2️⃣ Create Payment
      await Payment.create({
        orderId: order._id,
        userId,
        amount: totalAmount,
        method: paymentMethod,
        status:
          paymentMethod === "COD" ? "Pending" : "Paid",
      });

      return res.status(201).json({
        success: true,
        data: order,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Order creation failed",
      });
    }
  }

  // 🔥 ADMIN - GET ALL ORDERS
  static async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await Order.find()
        .populate("userId", "email name")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        data: orders,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
      });
    }
  }
    // 🔥 GET SINGLE ORDER
static async getOrderById(req: Request, res: Response) {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("userId", "email name");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
}
  }

