import { Request, Response } from "express";
import z from "zod";
import { AdminCreateUserDTO, UpdateUserDTO } from "../../dtos/user.dto";
import { AdminUserService } from "../../services/admin/user.service";
import Order from "../../models/order.model";
import Payment from "../../models/payment.model";

export class AdminUserController {
  constructor(
    private adminUserService = new AdminUserService()
  ) {}

  /* ===============================
     CREATE USER
     POST /api/admin/users
  =============================== */
  async createUser(req: Request, res: Response) {
    try {
      const parsedData = AdminCreateUserDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const userData = parsedData.data;

      // Attach uploaded image
      if (req.file) {
        userData.imageUrl = `/uploads/${req.file.filename}`;
      }

      const newUser = await this.adminUserService.createUser(userData);

      return res.status(201).json({
        success: true,
        message: "User Created Successfully",
        data: newUser,
      });

    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  /* ===============================
     GET ALL USERS (Pagination)
     GET /api/admin/users
  =============================== */
  async getAllUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const result = await this.adminUserService.getAllUsers(page, limit);

      return res.status(200).json({
        success: true,
        message: "Users Retrieved Successfully",
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

  /* ===============================
     GET SINGLE USER
     GET /api/admin/users/:id
  =============================== */
  async getUserById(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      const user = await this.adminUserService.getUserById(userId);

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
        message: "User Retrieved Successfully",
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

  /* ===============================
     UPDATE USER
     PUT /api/admin/users/:id
  =============================== */
  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      const updateData: any = {};

      if (req.body.name) updateData.name = req.body.name;
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.role) updateData.role = req.body.role;
      if (req.body.phone) updateData.phone = req.body.phone;

      // Hash password only if provided
      if (req.body.password && req.body.password.trim() !== "") {
        const bcrypt = require("bcryptjs");
        updateData.password = await bcrypt.hash(req.body.password, 10);
      }

      // Attach new image
      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await this.adminUserService.updateUser(
        userId,
        updateData
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        data: updatedUser,
      });

    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  /* ===============================
     DELETE USER
     DELETE /api/admin/users/:id
  =============================== */
  async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      const deleted = await this.adminUserService.deleteUser(userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
      });

    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}