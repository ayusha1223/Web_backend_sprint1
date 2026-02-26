import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import auth from "../middlewares/auth.middleware";
import admin from "../middlewares/admin.middleware";
import upload from "../middlewares/upload.middleware";

const router = Router();
const controller = new ProductController();

/* ================= PUBLIC ROUTES ================= */

// GET all products
router.get("/", controller.getAll.bind(controller));

// GET by category
router.get(
  "/category/:category",
  controller.getByCategory.bind(controller)
);

/* ================= ADMIN ROUTES ================= */

// POST create product
router.post(
  "/",
  auth,
  admin,
  upload.array("images", 5),
  controller.create.bind(controller)
);

// PUT update
router.put(
  "/:id",
  auth,
  admin,
  controller.update.bind(controller)
);

// DELETE
router.delete(
  "/:id",
  auth,
  admin,
  controller.delete.bind(controller)
);

export default router;