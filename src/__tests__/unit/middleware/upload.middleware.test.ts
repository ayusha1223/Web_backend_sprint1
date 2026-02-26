describe("upload.middleware", () => {

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should create uploads folder if not exists", () => {
    jest.doMock("fs", () => ({
      existsSync: jest.fn().mockReturnValue(false),
      mkdirSync: jest.fn(),
    }));

    const fs = require("fs");

    require("../../../middlewares/upload.middleware");

    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.mkdirSync).toHaveBeenCalled();
  });

  test("should NOT create folder if already exists", () => {
    jest.doMock("fs", () => ({
      existsSync: jest.fn().mockReturnValue(true),
      mkdirSync: jest.fn(),
    }));

    const fs = require("fs");

    require("../../../middlewares/upload.middleware");

    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });

});