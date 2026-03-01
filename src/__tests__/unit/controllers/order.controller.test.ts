// ================= MOCK EXTERNAL SERVICES =================

// Must be BEFORE imports
jest.mock("../../../services/email.service", () => ({
  sendOrderEmail: jest.fn().mockResolvedValue(true),
}));

jest.mock("../../../models/notification.model", () => ({
  create: jest.fn().mockResolvedValue(true),
}));

// ================= IMPORTS =================

import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";

import app from "../../../app";
import User from "../../../models/user.model";
import Order from "../../../models/order.model";
import * as emailService from "../../../services/email.service";

let mongoServer: MongoMemoryServer;
let userToken: string;
let adminToken: string;
let userId: string;
let adminId: string;

// ================= SETUP =================

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Create normal user
  const user = await User.create({
    name: "Test User",
    email: "user@test.com",
    password: "123456",
    role: "user",
  });

  userId = user._id.toString();

  userToken = jwt.sign(
    { id: userId, role: "user" },
    process.env.JWT_SECRET || "testsecret"
  );

  // Create admin
  const admin = await User.create({
    name: "Admin User",
    email: "admin@test.com",
    password: "123456",
    role: "admin",
  });

  adminId = admin._id.toString();

  adminToken = jwt.sign(
    { id: adminId, role: "admin" },
    process.env.JWT_SECRET || "testsecret"
  );
});

afterEach(async () => {
  await Order.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// ================= TESTS =================

describe("Order Integration Tests", () => {

  // 🔹 CREATE ORDER SUCCESS
  it("should create order successfully", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        items: [{ qty: 2, price: 100 }],
        totalAmount: 200,
        paymentMethod: "COD",
        address: {
          name: "Ayusha",
          phone: "9800000000",
          address: "Kathmandu",
          city: "Kathmandu",
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    const orders = await Order.find();
    expect(orders.length).toBe(1);
  });

  // 🔹 CREATE ORDER FAIL
  it("should return 400 if required fields missing", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        items: [],
        totalAmount: 0,
      });

    expect(res.status).toBe(400);
  });

  // 🔹 GET MY ORDERS
  it("should get my orders", async () => {
    await Order.create({
      userId,
      items: [{ qty: 1, price: 100 }],
      totalAmount: 100,
    });

    const res = await request(app)
      .get("/api/orders/my-orders")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.orders.length).toBe(1);
  });

  // 🔹 ADMIN GET ALL
  it("admin should get all orders", async () => {
    await Order.create({
      userId,
      items: [{ qty: 1, price: 100 }],
      totalAmount: 100,
    });

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });

  // 🔹 REQUEST CANCEL SUCCESS
  it("user should request cancel", async () => {
    const order = await Order.create({
      userId,
      items: [{ qty: 1, price: 100 }],
      totalAmount: 100,
      orderStatus: "Processing",
    });

    const res = await request(app)
      .patch(`/api/orders/${order._id}/cancel-request`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
  });

  // 🔹 REQUEST CANCEL NOT FOUND
  it("should return 404 if cancel order not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/api/orders/${fakeId}/cancel-request`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(404);
  });

  // 🔹 REQUEST CANCEL NOT PROCESSING
  it("should return 400 if order not processing", async () => {
    const order = await Order.create({
      userId,
      items: [{ qty: 1, price: 100 }],
      totalAmount: 100,
      orderStatus: "Delivered",
    });

    const res = await request(app)
      .patch(`/api/orders/${order._id}/cancel-request`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(400);
  });

  // 🔹 UPDATE STATUS SUCCESS
  it("admin should update order status", async () => {
    const order = await Order.create({
      userId,
      items: [{ qty: 1, price: 100 }],
      totalAmount: 100,
    });

    const res = await request(app)
      .patch(`/api/orders/admin/${order._id}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "Shipped" });

    expect(res.status).toBe(200);
  });

  // 🔹 UPDATE STATUS NOT FOUND
  it("should return 404 when updating non-existing order", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .patch(`/api/orders/admin/${fakeId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "Shipped" });

    expect(res.status).toBe(404);
  });

  // 🔹 GET SINGLE ORDER
  it("should get single order", async () => {
    const order = await Order.create({
      userId,
      items: [{ qty: 1, price: 100 }],
      totalAmount: 100,
    });

    const res = await request(app)
      .get(`/api/orders/${order._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });

  // 🔹 GET SINGLE ORDER NOT FOUND
  it("should return 404 if order not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/orders/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
it("should hit createOrder catch block", async () => {
  const spy = jest.spyOn(Order, "create")
    .mockRejectedValueOnce(new Error("DB Error"));

  const res = await request(app)
    .post("/api/orders")
    .set("Authorization", `Bearer ${userToken}`)
    .send({
      items: [{ qty: 1, price: 100 }],
      totalAmount: 100,
    });

  expect(res.status).toBe(500);

  spy.mockRestore();
});
it("should hit getAllOrders catch block", async () => {
  const spy = jest.spyOn(Order, "countDocuments")
    jest.spyOn(Order, "find").mockReturnValueOnce({
  sort: jest.fn().mockRejectedValueOnce(new Error("DB Error"))
} as any);

  const res = await request(app)
    .get("/api/orders")
    .set("Authorization", `Bearer ${adminToken}`);

  expect(res.status).toBe(500);

  spy.mockRestore();
});
it("should hit getMyOrders catch block", async () => {

  jest.spyOn(Order, "find").mockReturnValueOnce({
    sort: jest.fn().mockRejectedValueOnce(new Error("DB Error"))
  } as any);

  const res = await request(app)
    .get("/api/orders/my-orders")
    .set("Authorization", `Bearer ${userToken}`);

  expect(res.status).toBe(500);
});
it("should hit requestCancel catch block", async () => {
  const spy = jest.spyOn(Order, "findOne")
    .mockRejectedValueOnce(new Error("DB Error"));

  const res = await request(app)
    .patch(`/api/orders/${new mongoose.Types.ObjectId()}/cancel-request`)
    .set("Authorization", `Bearer ${userToken}`);

  expect(res.status).toBe(500);

  spy.mockRestore();
});
it("should hit updateOrderStatus catch block", async () => {

  jest.spyOn(Order, "findById").mockReturnValueOnce({
    populate: jest.fn().mockRejectedValueOnce(new Error("DB Error"))
  } as any);

  const res = await request(app)
    .patch(`/api/orders/admin/${new mongoose.Types.ObjectId()}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ status: "Shipped" });

  expect(res.status).toBe(500);
});
it("should hit getOrderById catch block", async () => {

  jest.spyOn(Order, "findById").mockReturnValueOnce({
    populate: jest.fn().mockRejectedValueOnce(new Error("DB Error"))
  } as any);

  const res = await request(app)
    .get(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .set("Authorization", `Bearer ${adminToken}`);

  expect(res.status).toBe(500);
});
it("should handle email failure gracefully", async () => {

  const emailSpy = jest.spyOn(emailService, "sendOrderEmail")
    .mockRejectedValueOnce(new Error("Email failed"));

  const order = await Order.create({
    userId,
    items: [{ qty: 1, price: 100 }],
    totalAmount: 100,
  });

  const res = await request(app)
    .patch(`/api/orders/admin/${order._id}/status`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ status: "Shipped" });

  expect(res.status).toBe(200);

  emailSpy.mockRestore();
});
});