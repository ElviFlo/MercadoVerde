import { Router } from "express";
import koraController from "../controllers/KoraController";

const router = Router();
// Monta todas las rutas del controller bajo este router
router.use("/", koraController);

export default router;
