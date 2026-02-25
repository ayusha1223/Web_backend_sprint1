import { Request, Response } from "express";
import { registerDto, loginDto } from "../dtos/auth.dto";
import { AuthService } from "../services/auth.services";
import User from "../models/user.model";
import Order from "../models/order.model";
import Payment from "../models/payment.model";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { sendResetEmail } from "../services/email.service";

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
  static async getMe(req: any, res: any) {
  const userId = req.user.id; // from JWT middleware
  const user = await AuthService.getCurrentUser(userId);
  res.json(user);
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
  static async forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await user.save();

    const resetLink = `http://localhost:3000/reset/${token}`;

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Send email
    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Reset link sent to email",
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

static async resetPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

  // 🆕 GET /api/auth/profile  (sir-style addition)
  // 🆕 GET /api/auth/whoami
static async getProfile(req: any, res: Response) {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    // 👤 User info
    const user = await User.findById(userId).select("-password");

    // 🛍 Orders of this user
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    // 💳 Payments of this user
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Full profile fetched successfully",
      data: {
        user,
        orders,
        payments
      }
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
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updateData: any = {};

    /* ================= NAME ================= */
    if (req.body.name) {
      updateData.name = req.body.name;
    }

    /* ================= PHONE ================= */
    if (req.body.phone) {
      updateData.phone = req.body.phone;
    }

    /* ================= PASSWORD ================= */
    if (req.body.newPassword) {
      updateData.password = await bcrypt.hash(req.body.newPassword, 10);
    }

    console.log("REQ FILE:", req.file);

    /* ================= IMAGE ================= */
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    /* ================= NOTIFICATIONS ================= */
    if (req.body.notifications) {
      try {
        updateData.notifications = JSON.parse(req.body.notifications);
      } catch (error) {
        return res.status(400).json({
          message: "Invalid notifications format",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });

  } catch (err: any) {
    console.error("PROFILE UPDATE ERROR:", err);
    return res.status(400).json({ message: err.message });
  }
}
}
