"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Services/products/src/infrastructure/routes/product.routes.ts
var express_1 = require("express");
var productController = require("../controllers/productController");
var AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
var router = (0, express_1.Router)();
// LECTURA (admin o client autenticado)
router.get("/", AuthMiddleware_1.verifyAccessToken, AuthMiddleware_1.allowAnyAuthenticated, productController.getAll);
router.get("/:id", AuthMiddleware_1.verifyAccessToken, AuthMiddleware_1.allowAnyAuthenticated, productController.getById);
// MUTACIONES (solo admin)
router.post("/", AuthMiddleware_1.verifyAccessToken, AuthMiddleware_1.requireAdmin, productController.create);
router.put("/:id", AuthMiddleware_1.verifyAccessToken, AuthMiddleware_1.requireAdmin, productController.update);
router.delete("/:id", AuthMiddleware_1.verifyAccessToken, AuthMiddleware_1.requireAdmin, productController.remove);
// Stock reservation endpoints (internal use by orders)
router.post("/:id/reserve", productController.reserve);
router.post("/:id/release", productController.release);
exports.default = router;
