import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import upload from "../middlewares/upload.middleware";
import auth from "../middlewares/auth.middleware";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

// ✅ KEEP AS-IS (DO NOT TOUCH)
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// 🆕 GET logged-in user profile (sir-style)
router.get(
  "/whoami",
  authMiddleware,
  AuthController.getProfile
);

// 🆕 UPDATE logged-in user profile (sir-style + multer)
router.put(
  "/update-profile",
  authMiddleware,
  upload.single("image"),
  AuthController.updateProfile
);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

export default router;
