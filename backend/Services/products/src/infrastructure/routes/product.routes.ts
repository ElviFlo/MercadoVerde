// Services/products/src/infrastructure/routes/product.routes.ts
import { Router } from "express";
import * as productController from "../controllers/productController";
import {
  verifyAccessToken,
  requireAdmin,
  allowAnyAuthenticated,
} from "../middlewares/AuthMiddleware";

const router = Router();

// LECTURA (admin o client autenticado)
router.get(
  "/",
  verifyAccessToken,
  allowAnyAuthenticated,
  productController.getAll,
);
router.get(
  "/:id",
  verifyAccessToken,
  allowAnyAuthenticated,
  productController.getById,
);

// MUTACIONES (solo admin)
router.post("/", verifyAccessToken, requireAdmin, productController.create);
router.put("/:id", verifyAccessToken, requireAdmin, productController.update);
router.delete(
  "/:id",
  verifyAccessToken,
  requireAdmin,
  productController.remove,
);

// Stock reservation endpoints (internal use by orders)
router.post("/:id/reserve", productController.reserve);
router.post("/:id/release", productController.release);

export default router;
