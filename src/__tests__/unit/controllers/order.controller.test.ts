import { OrderController } from "../../../controllers/order.controller";
import Order from "../../../models/order.model";
import Payment from "../../../models/payment.model";
import Notification from "../../../models/notification.model";
import { transporter } from "../../../config/email";

jest.mock("../../../models/order.model");
jest.mock("../../../models/payment.model");
jest.mock("../../../models/notification.model");
jest.mock("../../../config/email", () => ({
  transporter: { sendMail: jest.fn() }
}));

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
describe("createOrder", () => {
  test("should create order successfully", async () => {
    const req: any = {
      user: { id: "user1" },
      body: {
        items: [{ name: "Shirt" }],
        totalAmount: 100,
        paymentMethod: "COD",
        address: "Kathmandu"
      }
    };

    const res = mockResponse();

    (Order.create as jest.Mock).mockResolvedValue({ _id: "order1" });
    (Payment.create as jest.Mock).mockResolvedValue({});

    await OrderController.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });
    test("should return 400 if required fields missing", async () => {
    const req: any = {
      user: { id: "user1" },
      body: { items: [], totalAmount: null }
    };

    const res = mockResponse();

    await OrderController.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
    test("should return 500 on DB error", async () => {
    const req: any = {
      user: { id: "user1" },
      body: {
        items: [{ name: "Shirt" }],
        totalAmount: 100,
        paymentMethod: "COD",
        address: "Kathmandu"
      }
    };

    const res = mockResponse();

    (Order.create as jest.Mock).mockRejectedValue(new Error("DB error"));

    await OrderController.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
describe("getOrderById", () => {
  test("should return order if found", async () => {
    const req: any = { params: { orderId: "1" } };
    const res = mockResponse();

    (Order.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue({ _id: "1" })
    });

    await OrderController.getOrderById(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  test("should return 404 if order not found", async () => {
    const req: any = { params: { orderId: "1" } };
    const res = mockResponse();

    (Order.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null)
    });

    await OrderController.getOrderById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
describe("requestCancel", () => {

  test("should return 404 if order not found", async () => {
    const req: any = { params: { orderId: "1" }, user: { id: "user1" } };
    const res = mockResponse();

    (Order.findOne as jest.Mock).mockResolvedValue(null);

    await OrderController.requestCancel(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("should return 400 if status not Processing", async () => {
    const req: any = { params: { orderId: "1" }, user: { id: "user1" } };
    const res = mockResponse();

    (Order.findOne as jest.Mock).mockResolvedValue({
      orderStatus: "Shipped"
    });

    await OrderController.requestCancel(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
describe("updateOrderStatus", () => {

  test("should return 404 if order not found", async () => {
    const req: any = {
      params: { orderId: "1" },
      body: { status: "Shipped" }
    };

    const res = mockResponse();

    (Order.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null)
    });

    await OrderController.updateOrderStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
    test("should send notification and email when shipped", async () => {
    const req: any = {
      params: { orderId: "1" },
      body: { status: "Shipped" }
    };

    const res = mockResponse();

    const mockOrder = {
      _id: "1",
      orderStatus: "Processing",
      save: jest.fn(),
      userId: { _id: "user1", email: "test@mail.com", name: "Ayusha" }
    };

    (Order.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockOrder)
    });

    await OrderController.updateOrderStatus(req, res);

    expect(Notification.create).toHaveBeenCalled();
    expect(transporter.sendMail).toHaveBeenCalled();
  });
});