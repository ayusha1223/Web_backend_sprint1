import request from "supertest";
import express from "express";
import notificationRouter from "../../../routes/notification.route";
import Notification from "../../../models/notification.model";

/* ================= MOCK AUTH ================= */

jest.mock("../../../middlewares/auth.middleware", () =>
  jest.fn((req: any, res: any, next: any) => {
    req.user = { id: "user123" };
    next();
  })
);

/* ================= MOCK MODEL ================= */

jest.mock("../../../models/notification.model");

/* ================= TEST APP ================= */

const app = express();
app.use(express.json());
app.use("/api/notifications", notificationRouter);

describe("Notification Routes", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ================= GET NOTIFICATIONS ================= */

  it("should get user notifications", async () => {
    (Notification.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        { message: "Test notification" }
      ]),
    });

    const res = await request(app)
      .get("/api/notifications");

    expect(Notification.find).toHaveBeenCalledWith({
      userId: "user123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  /* ================= MARK AS READ ================= */

  it("should mark notification as read", async () => {
    (Notification.findByIdAndUpdate as jest.Mock).mockResolvedValue(true);

    const res = await request(app)
      .patch("/api/notifications/abc123/read");

    expect(Notification.findByIdAndUpdate).toHaveBeenCalledWith(
      "abc123",
      { isRead: true }
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

});