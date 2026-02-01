import { Request, Response } from "express";
import { registerDto, loginDto } from "../dtos/auth.dto";
import { AuthService } from "../services/auth.services";
import User from "../models/user.model";

/**
 * ⚠️ IMPORTANT
 * - register & login are KEPT AS-IS (your existing working code)
 * - ONLY profile-related logic is added
 */

export class AuthController {

  // ✅ KEEP AS IT IS (DO NOT CHANGE)
  static async register(req: Request, res: Response) {
    try {
      const data = registerDto.parse(req.body);
      const user = await AuthService.register(data);
      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  // ✅ KEEP AS IT IS (DO NOT CHANGE)
  static async login(req: Request, res: Response) {
    try {
      const data = loginDto.parse(req.body);
      const result = await AuthService.login(data);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  // 🆕 GET /api/auth/profile  (sir-style addition)
  static async getProfile(req: any, res: Response) {
    try {
      const userId = req.user?.id || req.user?._id;

      if (!userId) {
        return res.status(400).json({ message: "User not authenticated" });
      }

      const user = await User.findById(userId).select("-password");

      return res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data: user,
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  // 🆕 PUT /api/auth/profile  (sir-style addition + multer)
  static async updateProfile(req: any, res: Response) {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const updateData: any = {};

    if (req.body.name) {
      updateData.name = req.body.name;
    }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}
}
