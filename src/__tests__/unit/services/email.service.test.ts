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
});