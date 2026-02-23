import { Request, Response } from "express";
import Order from "../models/order.model";
import Payment from "../models/payment.model";

export class OrderController {

  static async createOrder(req: Request, res: Response) {
  try {
    const userId = req.user.id; // 🔥 from auth middleware

    const {
      items,
      totalAmount,
      paymentMethod,
      address,
    } = req.body;

     // 🔥 ADD DEBUG LOGS HERE
    console.log("===== ORDER DEBUG =====");
    console.log("USER ID:", userId);
    console.log("BODY:", req.body);
    console.log("ITEMS:", items);
    console.log("TOTAL:", totalAmount);
    console.log("ADDRESS:", address);
    console.log("=======================");

 if (!items || items.length === 0 || !totalAmount) {
  return res.status(400).json({
    success: false,
    message: "Missing required fields",
  });
}

    // 🔹 Create Order
    const order = await Order.create({
      userId,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus:
        paymentMethod === "COD" ? "Pending" : "Paid",
      address,
    });

    // 🔹 Create Payment
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

static async getAllOrders(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();

    const orders = await Order.find()
      .populate("userId", "email name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total: totalOrders,
        page,
        pages: Math.ceil(totalOrders / limit),
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
}
  static async getMyOrders(req: any, res: any) {
  try {
    const userId = req.user.id; // comes from JWT

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
    });
  }
}
static async requestCancel(req: any, res: any) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus !== "Processing") {
      return res.status(400).json({
        success: false,
        message: "Only processing orders can be cancelled",
      });
    }

    order.orderStatus = "Cancel Requested";
    await order.save();

    return res.json({
      success: true,
      message: "Cancel request sent to admin",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cancel request failed",
    });
  }
}
static async updateOrderStatus(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    // If refunded, update payment status
    if (status === "Refunded") {
      order.paymentStatus = "Paid"; // already paid
    }

    await order.save();

    return res.json({
      success: true,
      message: "Order status updated",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
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

