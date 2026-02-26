import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import { connectDB } from "../../database";

describe("Protected Route Integration - /api/auth/whoami", () => {
  let token: string;

  beforeAll(async () => {
    await connectDB();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // 🔐 1️⃣ Missing Token
  it("should return 401 if no token provided", async () => {
    const res = await request(app).get("/api/auth/whoami");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("success", false);
  });

  // 🔐 2️⃣ Invalid Token
  it("should return 401 for invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/whoami")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(401);
  });

  // ✅ 3️⃣ Valid Token
  it("should return user profile for valid token", async () => {
    // Register user
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "whoami@test.com",
      phone: "9800000000",
      password: "123456",
    });

    // Login user
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "whoami@test.com",
      password: "123456",
    });

    token = loginRes.body.token;

    const res = await request(app)
      .get("/api/auth/whoami")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.data).toHaveProperty("user");
    expect(res.body.data.user.email).toBe("whoami@test.com");
  });
});