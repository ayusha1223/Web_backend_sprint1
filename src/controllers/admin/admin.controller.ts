import { Request, Response, NextFunction } from "express";
import z from "zod";
import {
  CreateUserDTO,
  UpdateUserDTO
} from "../../dtos/user.dto";
import { AdminUserService } from "../../services/admin/user.service";
import Order from "../../models/order.model";
import Payment from "../../models/payment.model";


const adminUserService = new AdminUserService();

export class AdminUserController {

  // POST /api/admin/users
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = CreateUserDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      if (req.file) {
        parsedData.data.imageUrl = `/uploads/${req.file.filename}`;
      }

      const userData = parsedData.data;
      const newUser = await adminUserService.createUser(userData);

      return res.status(201).json({
        success: true,
        message: "User Created",
        data: newUser,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // GET /api/admin/users
  // GET /api/admin/users
async getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const result = await adminUserService.getAllUsers(page, limit);

    return res.status(200).json({
      success: true,
      message: "All Users Retrieved",
      data: result.users,
      pagination: result.pagination,
    });

  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

  // GET /api/admin/users/:id
  async getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id;

    const user = await adminUserService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Single User Retrieved",
      data: {
        user,
        orders,
        payments,
      },
    });

  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}
  // PUT /api/admin/users/:id
  // PUT /api/admin/users/:id
async updateUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;

    const updateData: any = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      phone: req.body.phone,
    };

    // Password (only if provided and not empty)
    if (req.body.password && req.body.password.trim() !== "") {
      const bcrypt = require("bcryptjs");
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    // Image
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    console.log("REQ BODY:", req.body);
console.log("REQ FILE:", req.file);

    const updatedUser = await adminUserService.updateUser(
      userId,
      updateData
    );

    return res.status(200).json({
      success: true,
      message: "User Updated",
      data: updatedUser,
    });

  } catch (error: any) {
    return res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

  // DELETE /api/admin/users/:id
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const deleted = await adminUserService.deleteUser(userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User Deleted",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
