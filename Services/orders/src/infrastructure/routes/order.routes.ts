// Services/orders/src/infrastructure/routes/order.routes.ts
import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

const router = Router();

router.get("/orders", OrderController.getAll);
router.get("/orders/:id", OrderController.getById);
router.post("/orders", OrderController.create);
router.put("/orders/:id/status", OrderController.updateStatus);
router.delete("/orders/:id", OrderController.delete);

export default router;
