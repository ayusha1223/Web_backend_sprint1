import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config";

// ✅ Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // ✅ KEEP (your code depends on this)
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
  }
};

export default auth;
