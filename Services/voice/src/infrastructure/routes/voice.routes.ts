import { Router, Request, Response } from "express";
import { processCommand, auditRepository } from "../../application/use-cases/ProcessCommand";
import { CartClient } from "../clients/cart.client";

const router = Router();
const cart = new CartClient();

/** POST /voice/add-to-cart  (requiere JWT en Authorization) */
router.post("/voice/add-to-cart", async (req: Request, res: Response) => {
  const { productId, quantity, inputText } = req.body ?? {};
  const authHeader = req.headers["authorization"] as string | undefined;

  // Si viene inputText, parseamos; si viene productId/quantity, lo usamos directo
  let pid = productId;
  let qty = quantity;

  if (inputText && (!pid || !qty)) {
    const r = await processCommand({ text: String(inputText), userId: null, source: "api", confidence: null, authHeader });
    if (r.status !== "ok") return res.status(r.status === "ambiguous" ? 422 : r.status === "needs_login" ? 401 : r.status === "rejected" ? 404 : 500).json(r);
    pid = r.productId;
    qty = r.quantity;
  }

  if (pid === undefined || qty === undefined) {
    return res.status(400).json({ message: "Se requieren productId y quantity, o bien inputText" });
  }

  try {
    const items = await cart.addItem({ productId: pid, quantity: Number(qty), authHeader });
    return res.json({ ok: true, message: "Producto agregado al carrito", items });
  } catch (err: any) {
    const msg = String(err?.message || err);
    const code = /401/.test(msg) ? 401 : /404/.test(msg) ? 404 : 500;
    return res.status(code).json({ message: msg.includes("not found") ? "Producto no encontrado" : "Error en Voice Service" });
  }
});

/** POST /kora/command  (voz->texto) */
router.post("/kora/command", async (req: Request, res: Response) => {
  const { text, userId, confidence, source } = req.body ?? {};
  if (!text || typeof text !== "string") return res.status(400).json({ message: "Se requiere 'text' con la transcripción." });
  const authHeader = req.headers["authorization"] as string | undefined;

  const result = await processCommand({ text, userId: userId ?? null, source: source ?? null, confidence: typeof confidence === "number" ? confidence : null, authHeader });

  switch (result.status) {
    case "ok":         return res.json(result);
    case "ambiguous":  return res.status(422).json(result);
    case "rejected":   return res.status(403).json(result);
    case "needs_login":return res.status(401).json(result);
    default:           return res.status(500).json(result);
  }
});

/** DEBUG: logs (proteger en prod) */
router.get("/kora/logs", (_req, res) => res.json(auditRepository.list()));

export default router;
