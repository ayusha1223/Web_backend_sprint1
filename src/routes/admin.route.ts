import { Router } from "express";
import { AdminUserController } from "../controllers/admin/admin.controller";
import auth from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";
import upload from "../middlewares/upload.middleware";
import { DashboardController } from "../controllers/admin/dashboard.controller";



const router = Router();
const adminUserController = new AdminUserController();
const dashboardController = new DashboardController();

// 🔐 Apply middlewares once (sir-style)
router.use(auth);
router.use(admin);

// POST /api/admin/users
router.post(
  "/users",
  upload.single("image"),
  adminUserController.createUser.bind(adminUserController)
);
// GET /api/admin/dashboard
router.get(
  "/dashboard",
  dashboardController.getDashboard.bind(dashboardController)
);


// GET /api/admin/users
router.get(
  "/users",
  adminUserController.getAllUsers.bind(adminUserController)
);

// GET /api/admin/users/:id
router.get(
  "/users/:id",
  adminUserController.getUserById.bind(adminUserController)
);

// PUT /api/admin/users/:id
router.put(
  "/users/:id",
  upload.single("image"),
  adminUserController.updateUser.bind(adminUserController)
);

// DELETE /api/admin/users/:id
router.delete(
  "/users/:id",
  adminUserController.deleteUser.bind(adminUserController)
);

export default router;
