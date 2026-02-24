import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

/* =========================================
   Extend Express Request Interface
========================================= */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "admin" | "user";
      };
    }
  }
}

/* =========================================
   Auth Middleware
========================================= */
const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔒 Check token format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    // 🔐 Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload & { id: string; role: "admin" | "user" };

    // ✅ Attach user safely
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
  }
};

export default auth;