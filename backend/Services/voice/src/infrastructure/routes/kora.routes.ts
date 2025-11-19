import { Router } from "express";
import { KoraController } from "../controllers/KoraController";
import { verifyAccessToken } from "../middlewares/auth.middleware";

const router = Router();
const controller = new KoraController();

// Protegido con JWT
router.post("/command", verifyAccessToken, (req, res) =>
  controller.handleCommand(req, res)
);

export default router;
