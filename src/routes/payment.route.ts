import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import auth from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";

const router = Router();
const controller = new PaymentController();

router.use(auth);
router.use(admin);

router.post("/", controller.create.bind(controller));
router.get("/", controller.getAll.bind(controller));
router.put("/:id", controller.updateStatus.bind(controller));

export default router;
