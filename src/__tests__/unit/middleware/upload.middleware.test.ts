describe("Upload Middleware", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  /* ================= FOLDER DOES NOT EXIST ================= */

  it("should create uploads folder if it does not exist", () => {
    jest.doMock("fs", () => ({
      existsSync: jest.fn().mockReturnValue(false),
      mkdirSync: jest.fn(),
    }));

    jest.doMock("multer", () => {
      const diskStorage = jest.fn(() => ({}));
      const multerFn = jest.fn(() => ({}));
      (multerFn as any).diskStorage = diskStorage;
      return multerFn;
    });

    const fs = require("fs");

    require("../../../middlewares/upload.middleware");

    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.mkdirSync).toHaveBeenCalledWith(
      expect.any(String),
      { recursive: true }
    );
  });

  /* ================= FOLDER EXISTS ================= */

  it("should not create folder if already exists", () => {
    jest.doMock("fs", () => ({
      existsSync: jest.fn().mockReturnValue(true),
      mkdirSync: jest.fn(),
    }));

    jest.doMock("multer", () => {
      const diskStorage = jest.fn(() => ({}));
      const multerFn = jest.fn(() => ({}));
      (multerFn as any).diskStorage = diskStorage;
      return multerFn;
    });

    const fs = require("fs");

    require("../../../middlewares/upload.middleware");

    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });

  /* ================= STORAGE CONFIG ================= */

  it("should configure diskStorage correctly", () => {
    jest.doMock("fs", () => ({
      existsSync: jest.fn().mockReturnValue(true),
      mkdirSync: jest.fn(),
    }));

    const diskStorageMock = jest.fn((config) => config);

    jest.doMock("multer", () => {
      const multerFn = jest.fn(() => ({}));
      (multerFn as any).diskStorage = diskStorageMock;
      return multerFn;
    });

    require("../../../middlewares/upload.middleware");

    expect(diskStorageMock).toHaveBeenCalled();

    const config = diskStorageMock.mock.calls[0][0];

    const destCb = jest.fn();
    config.destination({}, {}, destCb);
    expect(destCb).toHaveBeenCalled();

    const fileCb = jest.fn();
    config.filename({}, {}, fileCb);
    expect(fileCb).toHaveBeenCalledWith(
      null,
      expect.stringContaining(".jpg")
    );
  });

  /* ================= MULTER INIT ================= */

  it("should initialize multer with storage", () => {
    jest.doMock("fs", () => ({
      existsSync: jest.fn().mockReturnValue(true),
      mkdirSync: jest.fn(),
    }));

    const multerMock = jest.fn();

    jest.doMock("multer", () => {
      const diskStorage = jest.fn(() => ({}));
      (multerMock as any).diskStorage = diskStorage;
      return multerMock;
    });

    require("../../../middlewares/upload.middleware");

    expect(multerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        storage: expect.any(Object),
      })
    );
  });
});