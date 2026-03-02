import { AdminUserController } from "../../../../controllers/admin/admin.controller";
import { AdminUserService } from "../../../../services/admin/user.service";
import Order from "../../../../models/order.model";
import Payment from "../../../../models/payment.model";
import bcrypt from "bcryptjs";

jest.mock("../../../../services/admin/user.service");
jest.mock("../../../../models/order.model");
jest.mock("../../../../models/payment.model");
jest.mock("bcryptjs");

describe("AdminUserController - FULL COVERAGE", () => {
  let controller: AdminUserController;
  let serviceMock: jest.Mocked<AdminUserService>;
  let req: any;
  let res: any;

  beforeEach(() => {
    serviceMock = new AdminUserService() as jest.Mocked<AdminUserService>;
    controller = new AdminUserController(serviceMock);

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

    jest.clearAllMocks();
  });

  /* ================= CREATE USER ================= */

  it("should return 400 if validation fails", async () => {
    req.body = {}; // invalid

    await controller.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should attach image if provided", async () => {
    req.body = {
      name: "Test",
      email: "test@test.com",
      password: "123456",
      role: "user",
    };

    req.file = { filename: "img.jpg" };

    serviceMock.createUser.mockResolvedValue({ id: "1" } as any);

    await controller.createUser(req, res);

    expect(serviceMock.createUser).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should handle service error in createUser", async () => {
    req.body = {
      name: "Test",
      email: "test@test.com",
      password: "123456",
      role: "user",
    };

    serviceMock.createUser.mockRejectedValue({
      statusCode: 500,
      message: "Service error",
    });

    await controller.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
  it("should create user without image", async () => {
  req.body = {
    name: "Test",
    email: "test@test.com",
    password: "123456",
    role: "user",
  };

  req.file = undefined;

  serviceMock.createUser.mockResolvedValue({ id: "1" } as any);

  await controller.createUser(req, res);

  expect(serviceMock.createUser).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(201);
});

  /* ================= GET ALL USERS ================= */

  it("should return users with pagination", async () => {
    serviceMock.getAllUsers.mockResolvedValue({
      users: [],
      pagination: {},
    } as any);

    await controller.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should handle error in getAllUsers", async () => {
    serviceMock.getAllUsers.mockRejectedValue({
      statusCode: 500,
      message: "Error",
    });

    await controller.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
  
it("should use default pagination when no query provided", async () => {
  req.query = {};

  serviceMock.getAllUsers.mockResolvedValue({
    users: [],
    pagination: {},
  } as any);

  await controller.getAllUsers(req, res);

  expect(serviceMock.getAllUsers).toHaveBeenCalledWith(1, 5);
  expect(res.status).toHaveBeenCalledWith(200);
});

  /* ================= GET USER BY ID ================= */

  it("should return 404 if user not found", async () => {
    req.params.id = "1";
    serviceMock.getUserById.mockResolvedValue(null);

    await controller.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return user with orders and payments", async () => {
    req.params.id = "1";

    serviceMock.getUserById.mockResolvedValue({ id: "1" } as any);

    (Order.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    (Payment.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    await controller.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should handle error in getUserById", async () => {
    req.params.id = "1";

    serviceMock.getUserById.mockRejectedValue({
      statusCode: 500,
      message: "Error",
    });

    await controller.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
  it("should handle error if Order.find fails", async () => {
  req.params.id = "1";

  serviceMock.getUserById.mockResolvedValue({ id: "1" } as any);

  (Order.find as jest.Mock).mockImplementation(() => ({
    sort: jest.fn().mockRejectedValue({
      statusCode: 500,
      message: "Order error",
    }),
  }));

  await controller.getUserById(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
});
it("should handle error if Payment.find fails", async () => {
  req.params.id = "1";

  serviceMock.getUserById.mockResolvedValue({ id: "1" } as any);

  (Order.find as jest.Mock).mockReturnValue({
    sort: jest.fn().mockResolvedValue([]),
  });

  (Payment.find as jest.Mock).mockImplementation(() => ({
    sort: jest.fn().mockRejectedValue({
      statusCode: 500,
      message: "Payment error",
    }),
  }));

  await controller.getUserById(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
});

  /* ================= UPDATE USER ================= */

  it("should hash password if provided", async () => {
    req.params.id = "1";
    req.body.password = "123";

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");

    serviceMock.updateUser.mockResolvedValue({ id: "1" } as any);

    await controller.updateUser(req, res);

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should attach image in updateUser", async () => {
    req.params.id = "1";
    req.file = { filename: "img.jpg" };

    serviceMock.updateUser.mockResolvedValue({ id: "1" } as any);

    await controller.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 404 if user not found in updateUser", async () => {
    req.params.id = "1";

    serviceMock.updateUser.mockResolvedValue(null);

    await controller.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should handle error in updateUser", async () => {
    req.params.id = "1";

    serviceMock.updateUser.mockRejectedValue({
      statusCode: 500,
      message: "Error",
    });

    await controller.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
  it("should update without hashing if no password provided", async () => {
  req.params.id = "1";
  req.body = { name: "Updated Name" };

  serviceMock.updateUser.mockResolvedValue({ id: "1" } as any);

  await controller.updateUser(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
});
it("should NOT hash when password is empty string", async () => {
  req.params.id = "1";
  req.body.password = "";

  serviceMock.updateUser.mockResolvedValue({ id: "1" } as any);

  await controller.updateUser(req, res);

  expect(bcrypt.hash).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
});

  /* ================= DELETE USER ================= */

  it("should return 404 if deleteUser fails", async () => {
    req.params.id = "1";

    serviceMock.deleteUser.mockResolvedValue(null);

    await controller.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should delete user successfully", async () => {
    req.params.id = "1";

    serviceMock.deleteUser.mockResolvedValue(true as any);

    await controller.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should handle error in deleteUser", async () => {
    req.params.id = "1";

    serviceMock.deleteUser.mockRejectedValue({
      statusCode: 500,
      message: "Error",
    });

    await controller.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});