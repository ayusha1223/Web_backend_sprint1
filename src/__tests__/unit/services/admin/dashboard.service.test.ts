import { DashboardService } from "../../../../services/admin/dashboard.service";
import { DashboardRepository } from "../../../../repositories/dashboard.repository";

jest.mock("../../../../repositories/dashboard.repository");

describe("DashboardService", () => {

  let service: DashboardService;

  beforeEach(() => {
    service = new DashboardService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return complete dashboard stats", async () => {

    (DashboardRepository.prototype.countUsers as jest.Mock).mockResolvedValue(10);
    (DashboardRepository.prototype.countAdmins as jest.Mock).mockResolvedValue(2);
    (DashboardRepository.prototype.countOrders as jest.Mock).mockResolvedValue(50);
    (DashboardRepository.prototype.calculateTotalRevenue as jest.Mock).mockResolvedValue(1000);
    (DashboardRepository.prototype.countPendingPayments as jest.Mock).mockResolvedValue(5);
    (DashboardRepository.prototype.getRevenueByMonth as jest.Mock).mockResolvedValue([
      { month: "Jan", revenue: 100 }
    ]);
    (DashboardRepository.prototype.getOrdersThisWeek as jest.Mock).mockResolvedValue([
      { day: "Mon", orders: 3 }
    ]);

    const result = await service.getDashboardStats();

    expect(result).toEqual({
      totalUsers: 10,
      totalAdmins: 2,
      totalOrders: 50,
      totalRevenue: 1000,
      pendingPayments: 5,
      revenueByMonth: [{ month: "Jan", revenue: 100 }],
      ordersThisWeek: [{ day: "Mon", orders: 3 }],
    });

  });

});