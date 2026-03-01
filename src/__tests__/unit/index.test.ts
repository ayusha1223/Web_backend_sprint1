import { jest } from "@jest/globals";

jest.mock("../../database", () => ({
 connectDB: jest.fn().mockImplementation(async () => {}),
}));

jest.mock("../../app", () => ({
  __esModule: true,
  default: {
    listen: jest.fn((port: number, cb?: () => void) => {
      if (cb) cb();
    }),
  },
}));

describe("Server Bootstrap (index.ts)", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should connect to DB and start server", async () => {
    const consoleSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    // Import AFTER mocks
    await import("../../index");

    const { connectDB } = await import("../../database");
    const app = await import("../../app");

    expect(connectDB).toHaveBeenCalled();
    expect(app.default.listen).toHaveBeenCalled();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Server running on port")
    );

    consoleSpy.mockRestore();
  });
});