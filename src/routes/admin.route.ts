import { Router, Request, Response } from "express";
import { AdminUserController } from "../controllers/admin/admin.controller";
import { DashboardController } from "../controllers/admin/dashboard.controller";
import auth from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";
import upload from "../middlewares/upload.middleware";
import User from "../models/user.model"; // ✅ IMPORTANT

const router = Router();
const adminUserController = new AdminUserController();
const dashboardController = new DashboardController();

/* 🔐 Apply middlewares globally */
router.use(auth);
router.use(admin);

/* ===============================
   ADMIN SELF PROFILE UPDATE
   PUT /api/admin/profile
================================ */
router.put(
  "/profile",
  upload.single("image"),
  async (req: any, res: Response) => {
    try {
      const adminId = req.user.id; // From auth middleware
      const { name } = req.body;
      const image = req.file;

      const adminUser = await User.findById(adminId);

      if (!adminUser) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      // Update fields
      if (name) adminUser.name = name;
      if (image) {
        adminUser.image = `/uploads/${image.filename}`;
      }

      await adminUser.save();

      return res.json({
        success: true,
        message: "Profile updated successfully",
        data: adminUser,
      });
    } catch (error) {
      console.error("Admin profile update error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

/* ===============================
   DASHBOARD
   GET /api/admin/dashboard
================================ */
router.get(
  "/dashboard",
  dashboardController.getDashboard.bind(dashboardController)
);

/* ===============================
   CREATE USER
   POST /api/admin/users
================================ */
router.post(
  "/users",
  upload.single("image"),
  adminUserController.createUser.bind(adminUserController)
);

/* ===============================
   GET ALL USERS
================================ */
router.get(
  "/users",
  adminUserController.getAllUsers.bind(adminUserController)
);

/* ===============================
   GET SINGLE USER
================================ */
router.get(
  "/users/:id",
  adminUserController.getUserById.bind(adminUserController)
);
router.put(
  "/users/:id",
  upload.single("image"),
  adminUserController.updateUser.bind(adminUserController)
);

/* ===============================
   DELETE USER
================================ */
router.delete(
  "/users/:id",
  adminUserController.deleteUser.bind(adminUserController)
);

export default router;