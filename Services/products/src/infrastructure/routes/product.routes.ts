// Services/products/src/infrastructure/routes/product.routes.ts
import { Router } from "express";
import * as productController from "../controllers/productController";
import { authenticateToken } from "../middlewares/AuthMiddleware";

const router = Router();

// CRUD (crear, listar, obtener por id, actualizar, eliminar)
router.post("/", authenticateToken, productController.create);
router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.put("/:id", authenticateToken, productController.update);
router.delete("/:id", authenticateToken, productController.remove);

export default router;
