jest.mock("jsonwebtoken");

import jwt from "jsonwebtoken";
import auth from "../../../middlewares/auth.middleware";

describe("Auth Middleware Unit Tests", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    process.env.JWT_SECRET = "testsecret";
  });

  // ================= TOKEN MISSING =================

  it("should return 401 if token is missing", () => {
    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized: Token missing or invalid",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // ================= INVALID FORMAT =================

  it("should return 401 if token format is invalid", () => {
    req.headers.authorization = "InvalidTokenFormat";

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  // ================= INVALID TOKEN =================

  it("should return 401 if jwt verification fails", () => {
    req.headers.authorization = "Bearer invalidtoken";
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized: Invalid token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // ================= VALID TOKEN =================

  it("should attach user and call next if token is valid", () => {
    req.headers.authorization = "Bearer validtoken";

    (jwt.verify as jest.Mock).mockReturnValue({
      id: "123",
      role: "admin",
    });

    auth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "validtoken",
      process.env.JWT_SECRET
    );

    expect(req.user).toEqual({
      id: "123",
      role: "admin",
    });

    expect(next).toHaveBeenCalled();
  });

  // ================= ROLE USER =================

  it("should attach user with role user", () => {
    req.headers.authorization = "Bearer validtoken";

    (jwt.verify as jest.Mock).mockReturnValue({
      id: "456",
      role: "user",
    });

    auth(req, res, next);

    expect(req.user).toEqual({
      id: "456",
      role: "user",
    });

    expect(next).toHaveBeenCalled();
  });
});