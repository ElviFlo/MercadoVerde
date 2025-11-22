// src/infrastructure/routes/kora.routes.ts
import { Router } from "express";
import multer from "multer";
import { KoraController } from "../controllers/KoraController";
import { verifyAccessToken } from "../middlewares/auth.middleware";

const router = Router();
const controller = new KoraController();
const upload = multer();

// ----- TEXTO -----
router.post("/command", verifyAccessToken, (req, res) =>
  controller.handleCommand(req, res)
);

// ----- AUDIO -----
router.post(
  "/voice",
  verifyAccessToken,
  upload.single("audio"), // campo "audio" en el form-data
  (req, res) => controller.handleVoiceCommand(req, res)
);

export default router;
