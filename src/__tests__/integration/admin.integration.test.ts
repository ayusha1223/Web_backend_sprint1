import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import { connectDBTest } from "../../database";
import User from "../../models/user.model";

let adminToken: string;
let userId: string;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connectDBTest();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("ADMIN INTEGRATION TESTS", () => {

  /* ================= SETUP ADMIN ================= */

  it("1️⃣ should create normal user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin User",
        email: "admin@test.com",
        password: "123456",
        phone: "9999999999"
      });

    expect(res.statusCode).toBe(201);
  });

  it("2️⃣ should promote user to admin & login", async () => {
    const user = await User.findOne({ email: "admin@test.com" });
    user!.role = "admin";
    await user!.save();

    userId = user!._id.toString();

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test.com",
        password: "123456"
      });

    adminToken = login.body.token;

    expect(adminToken).toBeDefined();
  });

  /* ================= PROTECTION TESTS ================= */

  it("3️⃣ should block admin route without token", async () => {
    const res = await request(app)
      .get("/api/admin/users");

    expect(res.statusCode).toBe(401);
  });

  it("4️⃣ should block admin route with invalid token", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(401);
  });

  /* ================= GET USERS ================= */

  it("5️⃣ should get all users (pagination)", async () => {
    const res = await request(app)
      .get("/api/admin/users?page=1&limit=5")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.pagination).toBeDefined();
  });

  it("6️⃣ should get user by id", async () => {
    const res = await request(app)
      .get(`/api/admin/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("7️⃣ should return 404 for non-existing user", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/admin/users/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  /* ================= CREATE USER ================= */

  it("8️⃣ should create new user as admin", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "New User",
        email: "new@test.com",
        password: "123456",
        confirmPassword: "123456",
        phone: "8888888888",
        role: "user"
      });

    expect(res.statusCode).toBe(201);
  });

  it("9️⃣ should fail creating duplicate email", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Duplicate",
        email: "new@test.com",
        password: "123456",
        confirmPassword: "123456",
        phone: "7777777777",
        role: "user"
      });

    expect(res.statusCode).toBe(403);
  });

  /* ================= UPDATE USER ================= */

  it("🔟 should update user role", async () => {
    const user = await User.findOne({ email: "new@test.com" });

    const res = await request(app)
      .put(`/api/admin/users/${user!._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "admin" });

    expect(res.statusCode).toBe(200);
  });

  it("1️⃣1️⃣ should return 404 when updating non-existing user", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .put(`/api/admin/users/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "user" });

    expect(res.statusCode).toBe(404);
  });

  /* ================= DELETE USER ================= */

  it("1️⃣2️⃣ should delete user", async () => {
    const user = await User.findOne({ email: "new@test.com" });

    const res = await request(app)
      .delete(`/api/admin/users/${user!._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("1️⃣3️⃣ should return 404 when deleting non-existing user", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/admin/users/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

});