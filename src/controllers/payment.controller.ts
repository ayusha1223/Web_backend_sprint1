import { Request, Response } from "express";
import Payment from "../models/payment.model";

export class PaymentController {

  // CREATE PAYMENT
  async create(req: Request, res: Response) {
    try {
      const payment = await Payment.create(req.body);
      res.status(201).json(payment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // GET ALL PAYMENTS
  async getAll(req: Request, res: Response) {
    try {
      const payments = await Payment.find()
        .populate("userId", "email")
        .populate("orderId");
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // UPDATE STATUS
  async updateStatus(req: Request, res: Response) {
    try {
      const payment = await Payment.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );

      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
