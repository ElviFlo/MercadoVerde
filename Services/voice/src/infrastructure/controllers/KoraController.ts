import { Router, Request, Response } from "express";
import { processCommand, auditRepository } from "../../application/use-cases/ProcessCommand";
import { verifyAccessToken, requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

/**
 * POST /voice/command
 * Acceso: client o admin (JWT)
 * body: { text: string, userId?: string, confidence?: number, source?: string }
 */
router.post("/command", verifyAccessToken, async (req: Request, res: Response) => {
  const { text, confidence, source } = req.body ?? {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ message: "Se requiere 'text' con la transcripción." });
  }

  // El userId lo tomamos del token; si quieres permitir override, coméntalo.
  const tokenUserId = (req as any).user?.sub as string | undefined;

  const result = await processCommand({
    text,
    userId: tokenUserId ?? null,
    source: typeof source === "string" ? source : null,
    confidence: typeof confidence === "number" ? confidence : null,
  });

  switch (result.status) {
    case "ok":
      return res.json({ status: "ok", message: result.message, productId: result.productId, quantity: result.quantity });
    case "ambiguous":
      return res.status(422).json({ status: "ambiguous", message: result.message, candidates: result.candidates ?? [] });
    case "rejected":
      return res.status(403).json({ status: "rejected", message: result.message });
    case "needs_login":
      return res.status(401).json({ status: "needs_login", message: result.message });
    case "error":
    default:
      return res.status(500).json({ status: "error", message: result.message });
  }
});

/**
 * GET /voice/logs
 * Acceso: solo admin
 */
// router.get("/logs", verifyAccessToken, requireAdmin, async (_req: Request, res: Response) => {
//   const logs = await auditRepository.list();
//   res.json(logs);
// });

export default router;
