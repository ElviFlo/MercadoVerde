import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authGuard } from "../middlewares/AuthMiddleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login",    AuthController.login);
router.get("/me",        authGuard, (req, res) => res.json({ user: (req as any).user }));
router.get("/validate",  AuthController.validate);

export default router;
