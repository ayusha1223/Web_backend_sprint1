import { jest } from "@jest/globals";

/* ================= MOCK MIDDLEWARES ================= */

jest.mock("../../middlewares/auth.middleware", () =>
  jest.fn((req: any, res: any, next: any) => {
    req.user = { id: "123" };
    next();
  })
);

jest.mock("../../middlewares/admin.middleware", () =>
  jest.fn((req: any, res: any, next: any) => next())
);

jest.mock("../../middlewares/upload.middleware", () => ({
  single: () => (req: any, res: any, next: any) => next(),
}));

/* ================= MOCK CONTROLLERS ================= */

jest.mock("../../controllers/admin/admin.controller", () => ({
  AdminUserController: jest.fn().mockImplementation(() => ({
   createUser: jest.fn((req: any, res: any) =>
  res.json({ success: true, message: "User created" })
),

getAllUsers: jest.fn((req: any, res: any) =>
  res.json({ success: true, data: [] })
),

getUserById: jest.fn((req: any, res: any) =>
  res.json({ success: true, data: { id: req.params.id } })
),

updateUser: jest.fn((req: any, res: any) =>
  res.json({ success: true, message: "User updated" })
),

deleteUser: jest.fn((req: any, res: any) =>
  res.json({ success: true, message: "User deleted" })
),
  })),
}));

jest.mock("../../controllers/admin/dashboard.controller", () => ({
  DashboardController: jest.fn().mockImplementation(() => ({
    getDashboard: jest.fn((req: any, res: any) =>
  res.json({ success: true, stats: {} })
),
  })),
}));

/* ================= MOCK USER MODEL (IMPORTANT FIX) ================= */

jest.mock("../../models/user.model", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}));

/* ================= IMPORT AFTER MOCKS ================= */

import request from "supertest";
import express from "express";
import router from "../../routes/admin.route";
import User from "../../models/user.model";

const mockedUser = User as jest.Mocked<typeof User>;

describe("Admin Route Integration", () => {
  const app = express();
  app.use(express.json());
  app.use("/api/admin", router);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ================= PROFILE ================= */

  it("should return 404 if admin not found", async () => {
    mockedUser.findById.mockResolvedValue(null as any);

    const res = await request(app)
      .put("/api/admin/profile")
      .send({ name: "Test" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Admin not found");
  });

  it("should update profile successfully", async () => {
    const saveMock = jest.fn();

    mockedUser.findById.mockResolvedValue({
      name: "Old",
      save: saveMock,
    } as any);

    const res = await request(app)
      .put("/api/admin/profile")
      .send({ name: "New Name" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(saveMock).toHaveBeenCalled();
  });

  /* ================= DASHBOARD ================= */

  it("should return dashboard data", async () => {
    const res = await request(app).get("/api/admin/dashboard");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  /* ================= USERS ================= */

  it("should create user", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .send({ name: "Test" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User created");
  });

  it("should get all users", async () => {
    const res = await request(app).get("/api/admin/users");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should get single user", async () => {
    const res = await request(app).get("/api/admin/users/55");

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe("55");
  });

  it("should update user", async () => {
    const res = await request(app)
      .put("/api/admin/users/55")
      .send({ name: "Updated" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User updated");
  });

  it("should delete user", async () => {
    const res = await request(app).delete("/api/admin/users/55");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted");
  });
});