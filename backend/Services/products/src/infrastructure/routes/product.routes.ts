// Services/products/src/infrastructure/routes/product.routes.ts
import { Router } from "express";
import * as productController from "../controllers/productController";
import {
  verifyAccessToken,
  requireAdmin,
} from "../middlewares/AuthMiddleware";

const router = Router();

// LECTURA (📢 públicos: no requieren estar logueado)
router.get("/", productController.getAll);
router.get("/:id", productController.getById);

// MUTACIONES (solo admin, siguen protegidas)
router.post("/", verifyAccessToken, requireAdmin, productController.create);
router.put("/:id", verifyAccessToken, requireAdmin, productController.update);
router.delete("/:id", verifyAccessToken, requireAdmin, productController.remove);

// Stock reservation endpoints (internal use by orders)
router.post("/:id/reserve", productController.reserve);
router.post("/:id/release", productController.release);

export default router;
