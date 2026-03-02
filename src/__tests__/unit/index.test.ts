describe("Server Bootstrap (index.ts)", () => {

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete process.env.PORT;
  });

  it("should use .env.test when NODE_ENV is test", async () => {
    process.env.NODE_ENV = "test";

    const configSpy = jest.spyOn(require("dotenv"), "config");

    jest.doMock("../../database", () => ({
      connectDB: jest.fn(async () => {}),
    }));

    jest.doMock("../../app", () => ({
      __esModule: true,
      default: {
        listen: jest.fn((port: any, cb?: () => void) => {
          if (cb) cb();
        }),
      },
    }));

    await import("../../index");

    expect(configSpy).toHaveBeenCalledWith(
      expect.objectContaining({ path: ".env.test" })
    );
  });

  it("should use .env when NODE_ENV is not test", async () => {
    process.env.NODE_ENV = "development";

    const configSpy = jest.spyOn(require("dotenv"), "config");

    jest.doMock("../../database", () => ({
      connectDB: jest.fn(async () => {}),
    }));

    jest.doMock("../../app", () => ({
      __esModule: true,
      default: {
        listen: jest.fn((port: any, cb?: () => void) => {
          if (cb) cb();
        }),
      },
    }));

    await import("../../index");

    expect(configSpy).toHaveBeenCalledWith(
      expect.objectContaining({ path: ".env" })
    );
  });

  it("should connect to DB and start server", async () => {
    process.env.NODE_ENV = "test";

    const connectMock = jest.fn(async () => {});
    const listenMock = jest.fn((port: any, cb?: () => void) => {
      if (cb) cb();
    });

    jest.doMock("../../database", () => ({
      connectDB: connectMock,
    }));

    jest.doMock("../../app", () => ({
      __esModule: true,
      default: {
        listen: listenMock,
      },
    }));

    const consoleSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});

    await import("../../index");

    expect(connectMock).toHaveBeenCalled();
    expect(listenMock).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should use default port 5050 if PORT is not set", async () => {
    process.env.NODE_ENV = "test";
    delete process.env.PORT;

    const connectMock = jest.fn(async () => {});
    const listenMock = jest.fn((port: any, cb?: () => void) => {
      if (cb) cb();
    });

    jest.doMock("../../database", () => ({
      connectDB: connectMock,
    }));

    jest.doMock("../../app", () => ({
      __esModule: true,
      default: {
        listen: listenMock,
      },
    }));

    await import("../../index");

    const calledPort = listenMock.mock.calls[0][0];

    // PORT can be number or string, so check loosely
    expect(Number(calledPort)).toBe(5050);
  });

  it("should use custom PORT when provided", async () => {
    process.env.NODE_ENV = "test";
    process.env.PORT = "9000";

    const connectMock = jest.fn(async () => {});
    const listenMock = jest.fn((port: any, cb?: () => void) => {
      if (cb) cb();
    });

    jest.doMock("../../database", () => ({
      connectDB: connectMock,
    }));

    jest.doMock("../../app", () => ({
      __esModule: true,
      default: {
        listen: listenMock,
      },
    }));

    await import("../../index");

    expect(listenMock).toHaveBeenCalledWith("9000", expect.any(Function));
  });

});