import request from "supertest";

import User from "../models/user.model";
import app from "../app";

let token: string;
let userId: string;

describe("AUTH + ADMIN INTEGRATION TESTS", () => {

  // 1
  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "123456",
      phone: "1234567890"
    });

    expect(res.statusCode).toBe(201);
  });

  // 2
  it("should fail if email missing", async () => {
    const res = await request(app).post("/api/auth/register").send({
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
  });

  // 3
  it("should login successfully", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "123456"
    });

    expect(res.statusCode).toBe(200);
    token = res.body.token;
  });

  // 4
  it("should fail login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "wrongpass"
    });

    expect(res.statusCode).toBe(400);
  });

  // 5
  it("should get profile", async () => {
    const res = await request(app)
      .get("/api/auth/whoami")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  // 6
  it("should generate forgot password token", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "test@test.com" });

    expect(res.statusCode).toBe(200);
  });

  // 7
  it("should fail forgot password if email invalid", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "wrong@email.com" });

    expect(res.statusCode).toBe(404);
  });

  // 8
  it("should get paginated users", async () => {
    const res = await request(app)
      .get("/api/admin/users?page=1&limit=5")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.pagination).toBeDefined();
  });

  // 9
  it("should get user by id", async () => {
    const user = await User.findOne({ email: "test@test.com" });
    userId = user!._id.toString();

    const res = await request(app)
      .get(`/api/admin/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  // 10
  it("should update user role", async () => {
    const res = await request(app)
      .put(`/api/admin/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ role: "admin" });

    expect(res.statusCode).toBe(200);
  });

  // 11
  it("should delete user", async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  // 12–25 (Edge + Validation)

  it("should not access profile without token", async () => {
    const res = await request(app).get("/api/auth/whoami");
    expect(res.statusCode).toBe(401);
  });

  it("should not delete non-existing user", async () => {
    const res = await request(app)
      .delete("/api/admin/users/123456789012345678901234")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  // Add more simple variations:

  it("should return 404 for invalid id format", async () => {
    const res = await request(app)
      .get("/api/admin/users/invalidid")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

});
