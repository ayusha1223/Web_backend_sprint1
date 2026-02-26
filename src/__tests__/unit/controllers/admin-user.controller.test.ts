jest.mock("../../../models/order.model");
jest.mock("../../../models/payment.model");
jest.mock("bcryptjs");

import bcrypt from "bcryptjs";
import Order from "../../../models/order.model";
import Payment from "../../../models/payment.model";
import { AdminUserController } from "../../../controllers/admin/admin.controller";


describe("AdminUserController Unit Tests", () => {
  let controller: AdminUserController;
  let mockService: any;
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockService = {
      createUser: jest.fn(),
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    controller = new AdminUserController(mockService);

    req = {
      body: {},
      params: {},
      query: {},
      file: undefined,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // ================= CREATE USER =================

  it("should create user successfully", async () => {
    req.body = { name: "Test", email: "test@test.com", password: "123456" };
    mockService.createUser.mockResolvedValue({ email: "test@test.com" });

    await controller.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should handle create error", async () => {
    mockService.createUser.mockRejectedValue({ statusCode: 400, message: "Fail" });

    await controller.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ================= GET ALL USERS =================

  it("should return paginated users", async () => {
    req.query = { page: "1", limit: "5" };
    mockService.getAllUsers.mockResolvedValue({
      users: [],
      pagination: {},
    });

    await controller.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ================= GET USER BY ID =================

  it("should return user with orders and payments", async () => {
    req.params.id = "123";
    mockService.getUserById.mockResolvedValue({ _id: "123" });

    (Order.find as any).mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    (Payment.find as any).mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    await controller.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 if user not found", async () => {
    req.params.id = "123";
    mockService.getUserById.mockResolvedValue(null);

    await controller.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ================= UPDATE USER =================

  it("should update user successfully", async () => {
    req.params.id = "123";
    req.body = { name: "Updated" };
    mockService.updateUser.mockResolvedValue({ name: "Updated" });

    await controller.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should hash password if provided", async () => {
    req.params.id = "123";
    req.body = { password: "newpass" };
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
    mockService.updateUser.mockResolvedValue({});

    await controller.updateUser(req, res);

    expect(bcrypt.hash).toHaveBeenCalled();
  });

  // ================= DELETE USER =================

  it("should delete user successfully", async () => {
    req.params.id = "123";
    mockService.deleteUser.mockResolvedValue(true);

    await controller.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 if delete fails", async () => {
    req.params.id = "123";
    mockService.deleteUser.mockResolvedValue(null);

    await controller.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});