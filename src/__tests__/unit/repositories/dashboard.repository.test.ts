import { DashboardRepository } from "../../../repositories/dashboard.repository";
import User from "../../../models/user.model";
import Order from "../../../models/order.model";
import Payment from "../../../models/payment.model";

jest.mock("../../../models/user.model");
jest.mock("../../../models/order.model");
jest.mock("../../../models/payment.model");

describe("DashboardRepository", () => {

  let repo: DashboardRepository;

  beforeEach(() => {
    repo = new DashboardRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ================= COUNT USERS ================= */

  test("should count users", async () => {
    (User.countDocuments as jest.Mock).mockResolvedValue(5);

    const result = await repo.countUsers();

    expect(result).toBe(5);
    expect(User.countDocuments).toHaveBeenCalledWith({ role: "user" });
  });

  test("should count admins", async () => {
    (User.countDocuments as jest.Mock).mockResolvedValue(2);

    const result = await repo.countAdmins();

    expect(result).toBe(2);
    expect(User.countDocuments).toHaveBeenCalledWith({ role: "admin" });
  });

  test("should count orders", async () => {
    (Order.countDocuments as jest.Mock).mockResolvedValue(10);

    const result = await repo.countOrders();

    expect(result).toBe(10);
  });

  /* ================= TOTAL REVENUE ================= */

  test("should calculate total revenue", async () => {
    (Order.aggregate as jest.Mock).mockResolvedValue([{ total: 500 }]);

    const result = await repo.calculateTotalRevenue();

    expect(result).toBe(500);
  });

  test("should return 0 if no revenue", async () => {
    (Order.aggregate as jest.Mock).mockResolvedValue([]);

    const result = await repo.calculateTotalRevenue();

    expect(result).toBe(0);
  });

  test("should count pending payments", async () => {
    (Order.countDocuments as jest.Mock).mockResolvedValue(3);

    const result = await repo.countPendingPayments();

    expect(result).toBe(3);
    expect(Order.countDocuments).toHaveBeenCalledWith({ paymentStatus: "Pending" });
  });

  /* ================= REVENUE BY MONTH ================= */

  test("should map revenue by month", async () => {
    (Payment.aggregate as jest.Mock).mockResolvedValue([
      { _id: 1, revenue: 100 },
      { _id: 2, revenue: 200 },
    ]);

    const result = await repo.getRevenueByMonth();

    expect(result).toEqual([
      { month: "Jan", revenue: 100 },
      { month: "Feb", revenue: 200 },
    ]);
  });

  /* ================= ORDERS THIS WEEK ================= */

  test("should map orders by day", async () => {
    (Order.aggregate as jest.Mock).mockResolvedValue([
      { _id: 1, orders: 2 },
      { _id: 2, orders: 3 },
    ]);

    const result = await repo.getOrdersThisWeek();

    expect(result).toEqual([
      { day: "Sun", orders: 2 },
      { day: "Mon", orders: 3 },
    ]);
  });

});