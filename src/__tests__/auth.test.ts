import request from "supertest";

import mongoose from "mongoose";
import app from "../app";
import User from "../models/user.model";


let userToken: string;
let adminToken: string;
let userId: string;

/* ================= AUTH TESTS ================= */

describe("AUTH + ADMIN INTEGRATION TESTS", () => {

  /* ================= REGISTER ================= */

  it("1️⃣ should register user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@test.com",
        password: "123456",
        phone: "1111111111"
      });

    expect(res.statusCode).toBe(201);
  });

  it("2️⃣ should fail duplicate register", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@test.com",
        password: "123456",
        phone: "1111111111"
      });

    expect(res.statusCode).toBe(400);
  });

  it("3️⃣ should fail register with missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "missing@test.com"
      });

    expect(res.statusCode).toBe(400);
  });

  /* ================= LOGIN ================= */

  it("4️⃣ should login successfully", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    userToken = res.body.token;
  });

  it("5️⃣ should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@test.com",
        password: "wrongpass"
      });

    expect(res.statusCode).toBe(400);
  });

  it("6️⃣ should fail login with invalid user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nouser@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(400);
  });

  /* ================= PROFILE ================= */

  it("7️⃣ should get profile with token", async () => {
    const res = await request(app)
      .get("/api/auth/whoami")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("8️⃣ should not get profile without token", async () => {
    const res = await request(app)
      .get("/api/auth/whoami");

    expect(res.statusCode).toBe(401);
  });

  /* ================= FORGOT PASSWORD ================= */

  it("9️⃣ should generate forgot password token", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "test@test.com" });

    expect(res.statusCode).toBe(200);
  });

  it("🔟 should fail forgot password for invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "invalid@test.com" });

    expect(res.statusCode).toBe(404);
  });

  /* ================= RESET PASSWORD ================= */

  it("1️⃣1️⃣ should fail reset password with invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({
        token: "invalidtoken",
        newPassword: "newpass123"
      });

    expect(res.statusCode).toBe(400);
  });

  /* ================= ADMIN SETUP ================= */

  it("1️⃣2️⃣ should promote user to admin", async () => {
    const user = await User.findOne({ email: "test@test.com" });
    userId = user!._id.toString();

    user!.role = "admin";
    await user!.save();

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@test.com",
        password: "123456"
      });

    adminToken = login.body.token;
    expect(adminToken).toBeDefined();
  });

  /* ================= ADMIN ROUTES ================= */

  it("1️⃣3️⃣ should not access admin without token", async () => {
    const res = await request(app)
      .get("/api/admin/users");

    expect(res.statusCode).toBe(401);
  });

  it("1️⃣4️⃣ should get paginated users", async () => {
    const res = await request(app)
      .get("/api/admin/users?page=1&limit=5")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it("1️⃣5️⃣ should get user by id", async () => {
    const res = await request(app)
      .get(`/api/admin/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("1️⃣6️⃣ should return 404 for non-existing user", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/admin/users/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it("1️⃣7️⃣ should return error for invalid id format", async () => {
    const res = await request(app)
      .get(`/api/admin/users/invalidid`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it("1️⃣8️⃣ should update user role", async () => {
    const res = await request(app)
      .put(`/api/admin/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "user" });

    expect(res.statusCode).toBe(200);
  });

  it("1️⃣9️⃣ should delete user", async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("2️⃣0️⃣ should not delete non-existing user", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/admin/users/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  it("2️⃣1️⃣ should reject invalid JWT", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer invalidtoken`);

    expect(res.statusCode).toBe(401);
  });
  /* ================= EXTRA INTEGRATION TESTS ================= */

it("2️⃣2️⃣ should create user as admin", async () => {
  const res = await request(app)
    .post("/api/admin/users")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "New User",
      email: "newuser@test.com",
      password: "123456",
      confirmPassword: "123456",   // 🔥 REQUIRED
      phone: "9999999999",         // optional for DTO but safe for schema
      role: "user"
    });

  expect(res.statusCode).toBe(201);
});

it("2️⃣3️⃣ should fail create user without admin role", async () => {
  const login = await request(app)
    .post("/api/auth/login")
    .send({
      email: "newuser@test.com",
      password: "123456"
    });

  const normalToken = login.body.token;

  const res = await request(app)
    .post("/api/admin/users")
    .set("Authorization", `Bearer ${normalToken}`)
    .send({
      name: "Fail User",
      email: "fail@test.com",
      password: "123456",
      phone: "8888888888"
    });

  expect(res.statusCode).toBe(403);
});

it("2️⃣4️⃣ should fail update with invalid data", async () => {
  const res = await request(app)
    .put(`/api/admin/users/${userId}`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ role: "invalidRole" });

  expect(res.statusCode).toBeGreaterThanOrEqual(400);
});

it("2️⃣5️⃣ should handle pagination default values", async () => {
  const res = await request(app)
    .get("/api/admin/users")
    .set("Authorization", `Bearer ${adminToken}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.pagination).toBeDefined();
});

});

