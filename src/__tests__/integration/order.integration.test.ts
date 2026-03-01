import request from "supertest";
import mongoose from "mongoose";
/* 🔥 FORCE MOCK EMAIL SERVICE */
jest.mock("../../services/email.service", () => ({
  __esModule: true,
  sendOrderEmail: jest.fn().mockResolvedValue(true),
  sendResetEmail: jest.fn().mockResolvedValue(true),
}));
import app from "../../app";
import { connectDBTest } from "../../database";
import User from "../../models/user.model";
import Order from "../../models/order.model";

let userToken: string;
let adminToken: string;
let orderId: string;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connectDBTest();
});

describe("ORDER INTEGRATION TESTS", () => {

  /* ================= SETUP USERS ================= */

  it("1️⃣ should create normal user", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Order User",
        email: "orderuser@test.com",
        password: "123456",
        phone: "9999999999"
      });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "orderuser@test.com",
        password: "123456"
      });

    userToken = login.body.token;
    expect(userToken).toBeDefined();
  });

  it("2️⃣ should create admin user", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Order Admin",
        email: "orderadmin@test.com",
        password: "123456",
        phone: "8888888888"
      });

    const user = await User.findOne({ email: "orderadmin@test.com" });
    user!.role = "admin";
    await user!.save();

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "orderadmin@test.com",
        password: "123456"
      });

    adminToken = login.body.token;
    expect(adminToken).toBeDefined();
  });

  /* ================= CREATE ORDER ================= */

  it("3️⃣ should fail create order without token", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({});

    expect(res.statusCode).toBe(401);
  });

  it("4️⃣ should fail create order with missing fields", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        items: [],
        totalAmount: 0
      });

    expect(res.statusCode).toBe(400);
  });

  it("5️⃣ should create order successfully (COD)", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        items: [
          {
            img: "img.jpg",
            qty: 2,
            price: 100,
            size: "M"
          }
        ],
        totalAmount: 200,
        paymentMethod: "COD",
        address: {
          name: "Test",
          phone: "123456",
          address: "Kathmandu",
          city: "Kathmandu"
        }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.paymentStatus).toBe("Pending");

    orderId = res.body.data._id;
  });

  /* ================= GET MY ORDERS ================= */

  it("6️⃣ should get my orders", async () => {
    const res = await request(app)
      .get("/api/orders/my-orders")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.orders.length).toBeGreaterThanOrEqual(1);
  });

  /* ================= CANCEL REQUEST ================= */

  it("7️⃣ should request cancel (Processing only)", async () => {
    const res = await request(app)
      .patch(`/api/orders/${orderId}/cancel-request`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("8️⃣ should fail cancel if already requested", async () => {
    const res = await request(app)
      .patch(`/api/orders/${orderId}/cancel-request`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(400);
  });

  /* ================= ADMIN VIEW ================= */

  it("9️⃣ should block get all orders without admin", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("🔟 should allow admin to get all orders", async () => {
    const res = await request(app)
      .get("/api/orders?page=1&limit=5")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.pagination).toBeDefined();
  });

  /* ================= UPDATE STATUS ================= */

  it("1️⃣1️⃣ admin should update order status to Shipped", async () => {
    const res = await request(app)
      .patch(`/api/orders/admin/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "Shipped" });

    expect(res.statusCode).toBe(200);
  });

  /* ================= GET SINGLE ORDER ================= */

  it("1️⃣2️⃣ should get single order", async () => {
    const res = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("1️⃣3️⃣ should return 404 for non-existing order", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/orders/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

});