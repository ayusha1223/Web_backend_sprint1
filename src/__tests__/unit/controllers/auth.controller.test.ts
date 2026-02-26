// 🔥 MOCK DTO FIRST (VERY IMPORTANT)
jest.mock("../../../dtos/auth.dto", () => ({
  registerDto: {
    parse: jest.fn((data) => data),
  },
  loginDto: {
    parse: jest.fn((data) => data),
  },
}));

jest.mock("../../../services/auth.services");
jest.mock("../../../models/user.model");
jest.mock("../../../models/order.model");
jest.mock("../../../models/payment.model");
jest.mock("bcryptjs");
jest.mock("nodemailer");
jest.mock("crypto");

import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

import { AuthController } from "../../../controllers/auth.controller";
import { AuthService } from "../../../services/auth.services";
import User from "../../../models/user.model";
import Order from "../../../models/order.model";
import Payment from "../../../models/payment.model";

describe("AuthController Unit Tests", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      user: { id: "123" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // ================= REGISTER =================

  it("should register successfully", async () => {
    (AuthService.register as jest.Mock).mockResolvedValue({ id: "1" });

    req.body = { email: "test@test.com", password: "123456" };

    await AuthController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: "1" });
  });

  it("should return 400 on register error", async () => {
    (AuthService.register as jest.Mock).mockRejectedValue(new Error("Fail"));

    await AuthController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ================= LOGIN =================

  it("should login successfully", async () => {
    (AuthService.login as jest.Mock).mockResolvedValue({ token: "abc" });

    req.body = { email: "test@test.com", password: "123456" };

    await AuthController.login(req, res);

    expect(res.json).toHaveBeenCalledWith({ token: "abc" });
  });

  it("should return 400 on login error", async () => {
    (AuthService.login as jest.Mock).mockRejectedValue(new Error("Fail"));

    await AuthController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ================= FORGOT PASSWORD =================

  it("should return 404 if user not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    req.body = { email: "none@test.com" };

    await AuthController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should send reset email successfully", async () => {
    const saveMock = jest.fn();

    (User.findOne as jest.Mock).mockResolvedValue({
      email: "test@test.com",
      save: saveMock,
    });

    (crypto.randomBytes as jest.Mock).mockReturnValue({
      toString: () => "token123",
    });

    const sendMailMock = jest.fn().mockResolvedValue(true);

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    req.body = { email: "test@test.com" };

    await AuthController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ================= RESET PASSWORD =================

  it("should return 400 if token invalid", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    req.body = { token: "bad", newPassword: "123" };

    await AuthController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should reset password successfully", async () => {
    const saveMock = jest.fn();

    (User.findOne as jest.Mock).mockResolvedValue({
      save: saveMock,
    });

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");

    req.body = { token: "good", newPassword: "123" };

    await AuthController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ================= GET PROFILE =================

  it("should return full profile", async () => {
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({}),
    });

    (Order.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    (Payment.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    await AuthController.getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ================= UPDATE PROFILE =================

  it("should return 401 if user not authenticated", async () => {
    req.user = undefined;

    await AuthController.updateProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should update profile successfully", async () => {
    (User.findByIdAndUpdate as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({}),
    });

    req.body = { name: "Updated" };

    await AuthController.updateProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});