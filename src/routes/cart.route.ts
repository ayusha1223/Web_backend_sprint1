import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import authMiddleware from "../middlewares/auth.middleware";


const router = Router();

router.get("/", authMiddleware, CartController.getCart);
router.post("/", authMiddleware, CartController.saveCart);

export default router;
