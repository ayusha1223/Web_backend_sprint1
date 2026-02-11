import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import auth from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";
import upload from "../middlewares/upload.middleware";

const router = Router();
const controller = new ProductController();

router.use(auth);
router.use(admin);

// POST create product
router.post(
  "/",
  upload.array("images", 5),
  controller.create.bind(controller)
);

// GET all
router.get("/", controller.getAll.bind(controller));

// PUT update
router.put("/:id", controller.update.bind(controller));

// DELETE
router.delete("/:id", controller.delete.bind(controller));

export default router;
