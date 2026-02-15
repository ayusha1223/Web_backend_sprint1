import { Request, Response } from "express";
import Payment from "../models/payment.model";
import Order from "../models/order.model"; // ✅ REQUIRED

export class PaymentController {

  // 🔥 CREATE PAYMENT
  static async create(req: Request, res: Response) {
    try {
      const { orderId, userId, amount, method, status } = req.body;

      if (!orderId || !userId || !amount || !method) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const payment = await Payment.create({
        orderId,
        userId,
        amount,
        method,
        status: status || "Pending",
      });

      return res.status(201).json({
        success: true,
        data: payment,
      });

    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }


  // 🔥 GET ALL PAYMENTS (ADMIN)
  static async getAll(req: Request, res: Response) {
    try {
      const payments = await Payment.find()
        .populate("userId", "email name")
        .populate("orderId")
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        data: payments,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch payments",
      });
    }
  }


  // 🔥 UPDATE PAYMENT STATUS (ADMIN)
  static async updateStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;

      if (!["Pending", "Paid", "Failed"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment status",
        });
      }

      const payment = await Payment.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      // 🔥 Sync Order Payment Status
      await Order.findByIdAndUpdate(
        payment.orderId,
        { paymentStatus: status }
      );

      return res.json({
        success: true,
        data: payment,
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Failed to update payment",
      });
    }
  }


  // 🔥 GET SINGLE PAYMENT
  static async getById(req: Request, res: Response) {
    try {
      const payment = await Payment.findById(req.params.id)
        .populate("userId", "email name")
        .populate("orderId");

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }

      return res.json({
        success: true,
        data: payment,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch payment",
      });
    }
  }
}
