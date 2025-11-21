import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import {
  verifyAccessToken,
  requireAdmin,
  requireClient,
} from "../middlewares/auth.middleware";

export const orderRoutes = (controller: OrderController) => {
  const router = Router();

  router.post(
    "/",
    verifyAccessToken,
    requireClient,
    controller.create, 
  );

  router.get(
    "/",
    verifyAccessToken,
    requireAdmin,
    controller.getAll,
  );

  return router;
};
