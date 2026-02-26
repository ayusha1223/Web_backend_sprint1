import { DashboardController } from "../../../../controllers/admin/dashboard.controller";
import { DashboardService } from "../../../../services/admin/dashboard.service";

jest.mock("../../../../services/admin/dashboard.service");

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("DashboardController", () => {

  let controller: DashboardController;

  beforeEach(() => {
    controller = new DashboardController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return dashboard stats successfully", async () => {
    const mockData = { users: 10, orders: 5 };

    (DashboardService.prototype.getDashboardStats as jest.Mock)
      .mockResolvedValue(mockData);

    const req: any = {};
    const res = mockResponse();

    await controller.getDashboard(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockData,
    });
  });

  test("should return 500 if service throws error", async () => {
    (DashboardService.prototype.getDashboardStats as jest.Mock)
      .mockRejectedValue(new Error("DB fail"));

    const req: any = {};
    const res = mockResponse();

    await controller.getDashboard(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Failed to load dashboard",
    });
  });

});