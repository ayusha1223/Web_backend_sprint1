import request from "supertest";
import express from "express";
import adminRouter from "../../../routes/admin.route";
import User from "../../../models/user.model";

/* ================= MOCKS ================= */

jest.mock("../../../middlewares/auth.middleware", () =>
  jest.fn((req: any, res: any, next: any) => {
    req.user = { id: "admin123" };
    next();
  })
);

jest.mock("../../../middlewares/admin.middleware", () =>
  jest.fn((req: any, res: any, next: any) => next())
);

jest.mock("../../../middlewares/upload.middleware", () => ({
  single: () => (req: any, res: any, next: any) => {
    // If test sets header, inject file
    if (req.headers["x-test-file"]) {
      req.file = { filename: "admin.jpg" };
    }
    next();
  },
}));

jest.mock("../../../controllers/admin/admin.controller", () => {
  return {
    AdminUserController: jest.fn().mockImplementation(() => ({
      createUser: jest.fn((req, res) =>
        res.status(201).json({ success: true })
      ),
      getAllUsers: jest.fn((req, res) =>
        res.status(200).json({ success: true })
      ),
      getUserById: jest.fn((req, res) =>
        res.status(200).json({ success: true })
      ),
      updateUser: jest.fn((req, res) =>
        res.status(200).json({ success: true })
      ),
      deleteUser: jest.fn((req, res) =>
        res.status(200).json({ success: true })
      ),
    })),
  };
});

jest.mock("../../../controllers/admin/dashboard.controller", () => {
  return {
    DashboardController: jest.fn().mockImplementation(() => ({
      getDashboard: jest.fn((req, res) =>
        res.status(200).json({ success: true })
      ),
    })),
  };
});

jest.mock("../../../models/user.model");

/* ================= TEST APP ================= */

const app = express();
app.use(express.json());
app.use("/api/admin", adminRouter);

describe("Admin Routes", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ================= PROFILE ================= */

  it("should update profile successfully", async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      name: "Old",
      save: jest.fn().mockResolvedValue(true),
    });

    const res = await request(app)
      .put("/api/admin/profile")
      .send({ name: "New Name" });

    expect(res.status).toBe(200);
  });

  it("should return 404 if admin not found", async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .put("/api/admin/profile")
      .send({ name: "New Name" });

    expect(res.status).toBe(404);
  });

  it("should handle profile update error", async () => {
    (User.findById as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .put("/api/admin/profile")
      .send({ name: "New Name" });

    expect(res.status).toBe(500);
  });
  it("should update profile with image", async () => {
  (User.findById as jest.Mock).mockResolvedValue({
    name: "Old",
    image: "",
    save: jest.fn().mockResolvedValue(true),
  });

  const res = await request(app)
    .put("/api/admin/profile")
    .set("x-test-file", "true") // triggers image branch
    .send({ name: "New Name" });

  expect(res.status).toBe(200);
});

  /* ================= DASHBOARD ================= */

  it("should get dashboard", async () => {
    const res = await request(app).get("/api/admin/dashboard");
    expect(res.status).toBe(200);
  });

  /* ================= USERS ROUTES ================= */

  it("should create user", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .send({ name: "Test" });

    expect(res.status).toBe(201);
  });

  it("should get all users", async () => {
    const res = await request(app).get("/api/admin/users");
    expect(res.status).toBe(200);
  });

  it("should get single user", async () => {
    const res = await request(app).get("/api/admin/users/1");
    expect(res.status).toBe(200);
  });

  it("should update user", async () => {
    const res = await request(app)
      .put("/api/admin/users/1")
      .send({ name: "Updated" });

    expect(res.status).toBe(200);
  });

  it("should delete user", async () => {
    const res = await request(app)
      .delete("/api/admin/users/1");

    expect(res.status).toBe(200);
  });

});