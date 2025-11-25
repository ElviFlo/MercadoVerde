// src/infrastructure/routes/order.routes.ts
import { Router } from "express";
import { OrdersController } from "../controllers/order.controller";
import {
  verifyAccessToken,
  requireAdmin,
  requireClient,
} from "../middlewares/auth.middleware";

export const orderRoutes = (controller: OrdersController) => {
  const router = Router();

  // Cliente crea orden
  router.post(
    "/",
    verifyAccessToken,
    requireClient,
    controller.create,
  );

  // Cliente lista sus órdenes
  router.get(
    "/mine",
    verifyAccessToken,
    requireClient,
    controller.getMine,
  );

  // Admin lista todas
  router.get(
    "/",
    verifyAccessToken,
    requireAdmin,
    controller.getAll,
  );

  return router;
};
