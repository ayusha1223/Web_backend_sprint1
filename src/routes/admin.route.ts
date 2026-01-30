import express from "express";
import { upload } from "../middleware/upload.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";
import * as AdminController from "../controllers/admin.controller";

const router = express.Router();

router.post(
  "/users",
  authMiddleware,
  isAdmin,
  upload.single("image"),
  AdminController.createUser
);

router.get("/users", authMiddleware, isAdmin, AdminController.getUsers);

router.get("/users/:id", authMiddleware, isAdmin, AdminController.getUser);

router.put(
  "/users/:id",
  authMiddleware,
  isAdmin,
  upload.single("image"),
  AdminController.updateUser
);

router.delete(
  "/users/:id",
  authMiddleware,
  isAdmin,
  AdminController.deleteUser
);

export default router;
