import { PaymentController } from "../../../controllers/payment.controller";
import Payment from "../../../models/payment.model";
import Order from "../../../models/order.model";

jest.mock("../../../models/payment.model");
jest.mock("../../../models/order.model");

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("PaymentController", () => {

  /* ================= CREATE ================= */

  describe("create", () => {

    test("should create payment successfully", async () => {
      const req: any = {
        body: {
          orderId: "order1",
          userId: "user1",
          amount: 100,
          method: "COD",
        }
      };

      const res = mockResponse();

      (Payment.create as jest.Mock).mockResolvedValue({ _id: "payment1" });

      await PaymentController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    test("should return 400 if missing required fields", async () => {
      const req: any = { body: { orderId: "1" } };
      const res = mockResponse();

      await PaymentController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("should return 400 on DB error", async () => {
      const req: any = {
        body: {
          orderId: "1",
          userId: "1",
          amount: 100,
          method: "COD"
        }
      };

      const res = mockResponse();

      (Payment.create as jest.Mock).mockRejectedValue(new Error("DB error"));

      await PaymentController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

  });


  /* ================= GET ALL ================= */

  describe("getAll", () => {

    test("should return all payments", async () => {
      const req: any = {};
      const res = mockResponse();

      (Payment.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue([])
          })
        })
      });

      await PaymentController.getAll(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    test("should return 500 on error", async () => {
      const req: any = {};
      const res = mockResponse();

      (Payment.find as jest.Mock).mockImplementation(() => {
        throw new Error("DB fail");
      });

      await PaymentController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

  });


  /* ================= UPDATE STATUS ================= */

  describe("updateStatus", () => {

    test("should return 400 for invalid status", async () => {
      const req: any = {
        body: { status: "INVALID" },
        params: { id: "1" }
      };
      const res = mockResponse();

      await PaymentController.updateStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("should return 404 if payment not found", async () => {
      const req: any = {
        body: { status: "Paid" },
        params: { id: "1" }
      };
      const res = mockResponse();

      (Payment.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await PaymentController.updateStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    test("should update payment and sync order", async () => {
      const req: any = {
        body: { status: "Paid" },
        params: { id: "1" }
      };
      const res = mockResponse();

      (Payment.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        orderId: "order1"
      });

      (Order.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

      await PaymentController.updateStatus(req, res);

      expect(Order.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    test("should return 400 on update error", async () => {
      const req: any = {
        body: { status: "Paid" },
        params: { id: "1" }
      };
      const res = mockResponse();

      (Payment.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error());

      await PaymentController.updateStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

  });


  /* ================= GET BY ID ================= */

  describe("getById", () => {

    test("should return payment if found", async () => {
      const req: any = { params: { id: "1" } };
      const res = mockResponse();

      (Payment.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue({ _id: "1" })
        })
      });

      await PaymentController.getById(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    test("should return 404 if payment not found", async () => {
      const req: any = { params: { id: "1" } };
      const res = mockResponse();

      (Payment.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        })
      });

      await PaymentController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    test("should return 500 on error", async () => {
      const req: any = { params: { id: "1" } };
      const res = mockResponse();

      (Payment.findById as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      await PaymentController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

  });

});