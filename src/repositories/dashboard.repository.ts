import Order from "../models/order.model";
import User from "../models/user.model";
import Payment from "../models/payment.model";

export class DashboardRepository {
  async countUsers() {
    return User.countDocuments({ role: "user" });
  }

  async countAdmins() {
    return User.countDocuments({ role: "admin" });
  }

  async countOrders() {
    return Order.countDocuments();
  }

  async calculateTotalRevenue() {
    const result = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    return result[0]?.total || 0;
  }

  async countPendingPayments() {
    return Order.countDocuments({ paymentStatus: "Pending" });
  }
   /* ================= NEW ANALYTICS ================= */

  async getRevenueByMonth() {
    const revenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    return revenue.map((item) => ({
      month: monthNames[item._id - 1],
      revenue: item.revenue,
    }));
  }

  async getOrdersThisWeek() {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 6);

    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const dayNames = [
      "Sun","Mon","Tue","Wed","Thu","Fri","Sat"
    ];

    return orders.map((item) => ({
      day: dayNames[item._id - 1],
      orders: item.orders,
    }));
  }
}
