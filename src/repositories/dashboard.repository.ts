import Order from "../models/order.model";
import User from "../models/user.model";


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
}
