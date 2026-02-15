import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import auth from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";

const router = Router();

// 🔐 Only logged-in admins can access payments
router.use(auth);
router.use(admin);

// 🔥 Use static methods directly (NO instance, NO bind)
router.post("/", PaymentController.create);
router.get("/", PaymentController.getAll);
router.put("/:id", PaymentController.updateStatus);

export default router;
