import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  AuthController.updateProfile
);


export default router;
