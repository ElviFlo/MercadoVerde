import { Router } from "express";
import { OrdersController } from "../controllers/order.controller";
import {
  verifyAccessToken,
  requireAdmin,
  requireClient,
  requireAdminOrOwner,
} from "../middlewares/auth.middleware";

const router = Router();

router.post("/", verifyAccessToken, requireClient, OrdersController.create);
router.get(
  "/mine",
  verifyAccessToken,
  requireClient,
  OrdersController.listMine,
);
router.get("/", verifyAccessToken, requireAdmin, OrdersController.listAll);
router.get(
  "/:id",
  verifyAccessToken,
  requireAdminOrOwner(),
  OrdersController.getById,
);

export default router;
