import { DashboardRepository } from "../../repositories/dashboard.repository";

export class DashboardService {
  private repo = new DashboardRepository();

  async getDashboardStats() {

    const totalUsers = await this.repo.countUsers();
    const totalAdmins = await this.repo.countAdmins();
    const totalOrders = await this.repo.countOrders();
    const totalRevenue = await this.repo.calculateTotalRevenue();
    const pendingPayments = await this.repo.countPendingPayments();

    /* ===== NEW ANALYTICS ===== */

    const revenueByMonth = await this.repo.getRevenueByMonth();
    const ordersThisWeek = await this.repo.getOrdersThisWeek();

    return {
      totalUsers,
      totalAdmins,
      totalOrders,
      totalRevenue,
      pendingPayments,
      revenueByMonth,
      ordersThisWeek,
    };
  }
}