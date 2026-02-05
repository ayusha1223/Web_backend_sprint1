import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();

router.post("/esewa", PaymentController.initiateEsewa);
router.get("/success", PaymentController.paymentSuccess);
router.get("/failure", PaymentController.paymentFailure);

export default router;
