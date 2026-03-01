import mongoose from "mongoose";
import { connectDB, connectDBTest } from "../../../database";

jest.mock("mongoose", () => ({
  connection: {
    readyState: 0,
  },
  connect: jest.fn(),
}));

describe("Database Connection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ================= connectDB ================= */

  it("should return early if already connected", async () => {
    (mongoose.connection as any).readyState = 1;

    await connectDB();

    expect(mongoose.connect).not.toHaveBeenCalled();
  });

  it("should connect successfully", async () => {
    (mongoose.connection as any).readyState = 0;
    (mongoose.connect as jest.Mock).mockResolvedValue(undefined);

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith("Connected to MongoDB");

    logSpy.mockRestore();
  });

  it("should exit process if error and not test env", async () => {
    process.env.NODE_ENV = "development";

    (mongoose.connection as any).readyState = 0;
    (mongoose.connect as jest.Mock).mockRejectedValue(new Error("DB fail"));

    const exitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await connectDB();

    expect(errorSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("should throw error in test environment", async () => {
    process.env.NODE_ENV = "test";

    (mongoose.connection as any).readyState = 0;
    (mongoose.connect as jest.Mock).mockRejectedValue(new Error("DB fail"));

    await expect(connectDB()).rejects.toThrow("DB fail");
  });

  /* ================= connectDBTest ================= */

  it("connectDBTest should return early if already connected", async () => {
    (mongoose.connection as any).readyState = 1;

    await connectDBTest();

    expect(mongoose.connect).not.toHaveBeenCalled();
  });

  it("connectDBTest should connect successfully", async () => {
    (mongoose.connection as any).readyState = 0;
    (mongoose.connect as jest.Mock).mockResolvedValue(undefined);

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await connectDBTest();

    expect(mongoose.connect).toHaveBeenCalledWith(
      "mongodb://127.0.0.1:27017/naayu_test_db"
    );

    logSpy.mockRestore();
  });

  it("connectDBTest should catch error", async () => {
    (mongoose.connection as any).readyState = 0;
    (mongoose.connect as jest.Mock).mockRejectedValue(new Error("fail"));

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await connectDBTest();

    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});