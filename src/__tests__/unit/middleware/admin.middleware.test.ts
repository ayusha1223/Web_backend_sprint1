import admin from "../../../middlewares/admin.middleware";

describe("Admin Middleware Unit Tests", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  // ================= UNAUTHORIZED =================

  it("should return 401 if user is not authenticated", () => {
    admin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized: User not authenticated",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // ================= FORBIDDEN =================

  it("should return 403 if user is not admin", () => {
    req.user = { role: "user" };

    admin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Forbidden: Admin access only",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // ================= SUCCESS =================

  it("should call next if user is admin", () => {
    req.user = { role: "admin" };

    admin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  // ================= INTERNAL ERROR =================

  it("should return 500 if unexpected error occurs", () => {
    // Force an error by making req.user throw
    Object.defineProperty(req, "user", {
      get() {
        throw new Error("Test error");
      },
    });

    admin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
    });
  });
});