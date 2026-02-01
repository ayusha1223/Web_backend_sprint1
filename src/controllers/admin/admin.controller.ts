import { Request, Response, NextFunction } from "express";
import z from "zod";
import {
  CreateUserDTO,
  UpdateUserDTO
} from "../../dtos/user.dto";
import { AdminUserService } from "../../services/admin/user.service";


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
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await adminUserService.getAllUsers();
      return res.status(200).json({
        success: true,
        message: "All Users Retrieved",
        data: users,
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

      return res.status(200).json({
        success: true,
        message: "Single User Retrieved",
        data: user,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // PUT /api/admin/users/:id
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;

      const parsedData = UpdateUserDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      if (req.file) {
        parsedData.data.imageUrl = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await adminUserService.updateUser(
        userId,
        parsedData.data
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
