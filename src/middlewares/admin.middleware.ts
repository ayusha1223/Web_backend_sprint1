import { Request, Response, NextFunction } from "express";

const admin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default admin;
