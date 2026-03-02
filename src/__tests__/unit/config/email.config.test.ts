describe("Email Transporter Config", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.EMAIL_USER = "test@gmail.com";
    process.env.EMAIL_PASS = "password123";
  });

  it("should create transporter with correct config", async () => {
    const createTransportMock = jest.fn(() => ({
      sendMail: jest.fn(),
    }));

    jest.doMock("nodemailer", () => ({
      createTransport: createTransportMock,
    }));

    // Import AFTER mocking
    await import("../../../config/email");

    expect(createTransportMock).toHaveBeenCalledWith({
      service: "gmail",
      auth: {
        user: "test@gmail.com",
        pass: "password123",
      },
    });
  });
});