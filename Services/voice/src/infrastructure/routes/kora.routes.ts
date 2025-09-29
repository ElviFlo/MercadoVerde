import { Router } from "express";
import koraController from "../controllers/KoraController";

const router = Router();
router.use("/", koraController);
export default router;
