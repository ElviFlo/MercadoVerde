import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import {
  verifyAccessToken,
  requireAdmin,
  requireClient,
} from "../middlewares/AuthMiddleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login/client", AuthController.login);
router.post("/login/admin", AuthController.loginAdmin);
router.get("/validate", verifyAccessToken, AuthController.validate);

// pruebas de autorización
router.get("/me/admin", verifyAccessToken, requireAdmin, (req, res) => {
  res.json({ message: "OK admin", user: (req as any).user });
});
router.get("/me/client", verifyAccessToken, requireClient, (req, res) => {
  res.json({ message: "OK client", user: (req as any).user });
});

export default router;
