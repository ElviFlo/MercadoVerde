import { Router, Request, Response } from "express";
import { processCommand, auditRepository } from "../../application/use-cases/ProcessCommand";
import { getUserIdFromRequest } from "../auth/getUserId";

const router = Router();

/** NLP: /kora/command y /voice/command */
router.post("/command", async (req: Request, res: Response) => {
  const { text, confidence, source } = req.body ?? {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ message: "Se requiere 'text' con la transcripción." });
  }

  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ status: "needs_login", message: "Necesitas iniciar sesión para ejecutar comandos." });
  }

  const result = await processCommand({
    text,
    userId,
    source: typeof source === "string" ? source : "kora",
    confidence: typeof confidence === "number" ? confidence : null,
  });

  switch (result.status) {
    case "ok":
      return res.json({ status: "ok", message: result.message, productId: result.productId, quantity: result.quantity });
    case "ambiguous":
      return res.status(422).json({ status: "ambiguous", message: result.message, candidates: result.candidates ?? [] });
    case "rejected":
      return res.status(403).json({ status: "rejected", message: result.message });
    default:
      return res.status(500).json({ status: "error", message: result.message });
  }
});

/** Atajo DTO: /kora/add-to-cart y /voice/add-to-cart */
router.post("/add-to-cart", async (req: Request, res: Response) => {
  const { productId, quantity, inputText } = req.body ?? {};
  if ((typeof productId !== "string" && typeof productId !== "number") || typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ message: "Body inválido: requiere productId (string|number) y quantity (>0)" });
  }

  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ status: "needs_login", message: "Necesitas iniciar sesión para agregar al carrito." });
  }

  const text =
    typeof inputText === "string" && inputText.trim()
      ? inputText
      : `agrega ${quantity} del producto ${productId} al carrito`;

  const result = await processCommand({
    text,
    userId,
    source: "api",
    confidence: null,
  });

  switch (result.status) {
    case "ok":
      return res.status(200).json({ ok: true, message: result.message, productId: result.productId, quantity: result.quantity });
    case "ambiguous":
      return res.status(422).json({ status: "ambiguous", message: result.message, candidates: result.candidates ?? [] });
    case "rejected":
      return res.status(403).json({ status: "rejected", message: result.message });
    default:
      return res.status(500).json({ status: "error", message: result.message });
  }
});

/** Debug */
router.get("/logs", async (_req: Request, res: Response) => {
  const logs = await auditRepository.list();
  res.json(logs);
});

export default router;
