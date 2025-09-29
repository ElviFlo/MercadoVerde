import { parseCommand } from "../../infrastructure/services/NluParser";
import axios from "axios";
import { InMemoryAuditRepository } from "../../infrastructure/repositories/InMemoryAuditRepository";
import { AuditLog } from "../../domain/entities/AuditLog";
import { randomUUID } from "crypto";
import { similarity } from "../../infrastructure/utils/fuzzy";

const PRODUCTS_URL = process.env.PRODUCTS_URL ?? "http://localhost:3003";
const CART_URL = process.env.CART_URL ?? "http://localhost:3005";
const MIN_CONF = Number(process.env.MIN_CONFIDENCE ?? 0.55);

const auditRepo = new InMemoryAuditRepository();

export type ProcessResult = {
  status: "ok" | "ambiguous" | "rejected" | "error" | "needs_login";
  message: string;
  productId?: string;
  quantity?: number;
  candidates?: Array<{ id: string; name: string; score: number }>;
};

export async function processCommand(params: {
  text: string;
  userId?: string | null;
  source?: string | null;
  confidence?: number | null;
}): Promise<ProcessResult> {
  const { text, userId = null, source = null, confidence = null } = params;

  const log = new AuditLog(randomUUID(), userId, source, text, confidence ?? null, new Date().toISOString(), "error", {});
  try {
    if (confidence !== null && confidence < MIN_CONF) {
      log.result = "ambiguous";
      log.details = { reason: "low_confidence", min: MIN_CONF };
      await auditRepo.add(log);
      return { status: "ambiguous", message: "No se entendió con suficiente confianza. Por favor repite." };
    }

    const parsed = parseCommand(text);
    if (parsed.intent === "forbidden") {
      log.result = "rejected";
      log.details = { reason: "forbidden_intent" };
      await auditRepo.add(log);
      return { status: "rejected", message: "Kora solo puede agregar productos al carrito. Usa la app para otras acciones." };
    }
    if (parsed.intent !== "add") {
      log.result = "ambiguous";
      log.details = { reason: "intent_not_add", parsed };
      await auditRepo.add(log);
      return { status: "ambiguous", message: "No detecté una intención de agregar. Dime por ejemplo: 'agrega 2 manzanas'." };
    }

    if (!userId) {
      log.result = "needs_login";
      await auditRepo.add(log);
      return { status: "needs_login", message: "Necesitas iniciar sesión para que pueda agregar al carrito." };
    }

    const qty = parsed.quantity ?? 1;

    // Get products list
    const productsResp = await axios.get(`${PRODUCTS_URL}/products`).catch(_ => null);
    const products = productsResp?.data ?? [];
    if (!Array.isArray(products) || products.length === 0) {
      log.result = "error";
      log.details = { reason: "products_unavailable" };
      await auditRepo.add(log);
      return { status: "error", message: "No se pudo consultar el catálogo de productos." };
    }

    const candidates = products.map((p: any) => ({
      id: p.id ?? p._id ?? p.productId ?? "",
      name: p.name ?? p.nombre ?? p.title ?? "",
    })).map((p: any) => ({ ...p, score: similarity(p.name, parsed.productName ?? "") }));

    candidates.sort((a: any, b: any) => b.score - a.score);
    const top = candidates.slice(0, 5).filter((c: any) => c.score > 0.35);

    if (top.length === 0 || top[0].score < 0.5) {
      log.result = "ambiguous";
      log.details = { parsed, candidates: top.slice(0,3) };
      await auditRepo.add(log);
      return { status: "ambiguous", message: "No pude encontrar el producto con seguridad. ¿Puedes repetir con el nombre más claro?", candidates: top.map(c => ({ id: c.id, name: c.name, score: c.score })) };
    }

    if (top.length > 1 && (top[1].score > 0) && (top[0].score - top[1].score < 0.12)) {
      log.result = "ambiguous";
      log.details = { parsed, candidates: top.slice(0,3) };
      await auditRepo.add(log);
      return { status: "ambiguous", message: "Hay varios productos parecidos: " + top.slice(0,3).map(c => c.name).join(", ") + ". ¿Cuál quieres?", candidates: top.slice(0,3).map(c => ({ id: c.id, name: c.name, score: c.score })) };
    }

    const chosen = top[0];

    // Validate stock via product detail if endpoint available
    const productDetailResp = await axios.get(`${PRODUCTS_URL}/products/${chosen.id}`).catch(_ => null);
    const productDetail = productDetailResp?.data ?? chosen;
    const stock = typeof productDetail.stock === "number" ? productDetail.stock : null;
    if (stock !== null && stock < qty) {
      log.result = "rejected";
      log.details = { parsed, chosen, stock };
      await auditRepo.add(log);
      return { status: "rejected", message: `No hay suficiente stock de ${chosen.name}. Hay ${stock}.` };
    }

    // Add to cart
    const addResp = await axios.post(`${CART_URL}/cart/items`, { userId, productId: chosen.id, quantity: qty }).catch(e => {
      log.result = "error";
      log.details = { err: e?.response?.data ?? e.message, parsed, chosen };
      return null;
    });

    if (!addResp) {
      await auditRepo.add(log);
      return { status: "error", message: "No se pudo agregar al carrito por un error en el servicio cart." };
    }

    log.result = "accepted";
    log.details = { parsed, chosen, cartResponse: addResp.data };
    await auditRepo.add(log);

    return { status: "ok", message: `Agregué ${qty} x ${chosen.name} a tu carrito.`, productId: chosen.id, quantity: qty };

  } catch (err: any) {
    log.result = "error";
    log.details = { error: err.message || String(err) };
    await auditRepo.add(log);
    return { status: "error", message: "Ocurrió un error procesando el comando." };
  }
}

export const auditRepository = auditRepo;
