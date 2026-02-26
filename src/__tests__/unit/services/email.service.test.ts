import nodemailer from "nodemailer";
import { sendResetEmail } from "../../../services/email.service";

jest.mock("nodemailer");

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

  test("should send reset email successfully", async () => {
    sendMailMock.mockResolvedValue(true);

    await sendResetEmail("test@test.com", "http://reset-link");

    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "test@test.com",
        subject: "Password Reset Request",
      })
    );
  });

  test("should throw error if sendMail fails", async () => {
    sendMailMock.mockRejectedValue(new Error("Mail failed"));

    await expect(
      sendResetEmail("test@test.com", "http://reset-link")
    ).rejects.toThrow("Mail failed");
  });

});