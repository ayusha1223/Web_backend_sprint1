jest.mock("nodemailer", () => ({
  createTransport: jest.fn(),
}));

import nodemailer from "nodemailer";
import { sendResetEmail } from "../../../services/email.service";

describe("email.service", () => {
  const sendMailMock = jest.fn();

  beforeEach(() => {
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send reset email successfully", async () => {
    sendMailMock.mockResolvedValue(true);

    await sendResetEmail("test@test.com", "http://reset-link");

    expect(sendMailMock).toHaveBeenCalled();
  });

  it("should throw error if sendMail fails", async () => {
    sendMailMock.mockRejectedValue(new Error("Mail failed"));

    await expect(
      sendResetEmail("test@test.com", "http://reset-link")
    ).rejects.toThrow("Mail failed");
  });
  it("should send order email successfully", async () => {
  sendMailMock.mockResolvedValue(true);

  const { sendOrderEmail } = await import("../../../services/email.service");

  await sendOrderEmail(
    "test@test.com",
    "Ayusha",
    "Your order is confirmed",
    "ORD123"
  );

  expect(sendMailMock).toHaveBeenCalledWith(
    expect.objectContaining({
      to: "test@test.com",
      subject: "Order Update - Naayu Attire",
    })
  );
});
it("should throw error if order email fails", async () => {
  sendMailMock.mockRejectedValue(new Error("Order mail failed"));

  const { sendOrderEmail } = await import("../../../services/email.service");

  await expect(
    sendOrderEmail(
      "test@test.com",
      "Ayusha",
      "Order failed",
      "ORD123"
    )
  ).rejects.toThrow("Order mail failed");
});
it("should create transporter with gmail service", async () => {
  sendMailMock.mockResolvedValue(true);

  await sendResetEmail("test@test.com", "link");

  expect(nodemailer.createTransport).toHaveBeenCalledWith(
    expect.objectContaining({
      service: "gmail",
    })
  );
});
});