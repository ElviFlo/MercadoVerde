import { CartClient } from "../../infrastructure/clients/cart.client";

// Audit de juguete (en memoria)
type Audit = { ts: string; text: string; userId: string | null; source: string | null; quantity?: number; productId?: string | number; status: string; message: string };
class AuditRepository {
  private rows: Audit[] = [];
  add(row: Audit) { this.rows.push(row); }
  list() { return [...this.rows].slice(-100); }
}
export const auditRepository = new AuditRepository();

export type KoraResult =
  | { status: "ok"; message: string; productId: string | number; quantity: number }
  | { status: "ambiguous"; message: string; candidates: string[] }
  | { status: "rejected"; message: string }
  | { status: "needs_login"; message: string }
  | { status: "error"; message: string };

const numberWords: Record<string, number> = { uno:1, dos:2, tres:3, cuatro:4, cinco:5, seis:6, siete:7, ocho:8, nueve:9, diez:10 };

function parseTextToCommand(text: string): { productId?: string | number; quantity?: number } {
  const t = text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  // Busca "agrega(n) X (un|dos|3) (de)? (producto|id) Y" o "agrega 2 cafes id 1"
  const idMatch = t.match(/(?:id|producto)\s*([a-z0-9-]+)/i);
  const qtyWord = t.match(/\b(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b/);
  const qtyNum = t.match(/\b([1-9]|10)\b/);
  const quantity = qtyNum ? Number(qtyNum[1]) : (qtyWord ? numberWords[qtyWord[1]] : undefined);

  let productId: string | number | undefined = idMatch?.[1];
  if (productId && /^\d+$/.test(productId)) productId = Number(productId);

  return { productId, quantity };
}

const cart = new CartClient();

export async function processCommand(input: {
  text: string;
  userId: string | null;
  source: string | null;
  confidence: number | null;
  authHeader?: string;
}): Promise<KoraResult> {
  try {
    const { productId, quantity } = parseTextToCommand(input.text);

    if (!productId || !quantity) {
      auditRepository.add({ ts: new Date().toISOString(), text: input.text, userId: input.userId, source: input.source, status: "ambiguous", message: "Faltan datos" });
      return { status: "ambiguous", message: "Especifica producto (id) y cantidad", candidates: [] };
    }

    const items = await cart.addItem({ productId, quantity, authHeader: input.authHeader });
    auditRepository.add({ ts: new Date().toISOString(), text: input.text, userId: input.userId, source: input.source, status: "ok", message: "Agregado", productId, quantity });
    return { status: "ok", message: `Se agregaron ${quantity} unidades del producto ${productId}`, productId, quantity };
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (/401|needs_login/i.test(msg)) {
      auditRepository.add({ ts: new Date().toISOString(), text: input.text, userId: input.userId, source: input.source, status: "needs_login", message: msg });
      return { status: "needs_login", message: "Necesitas iniciar sesión" };
    }
    auditRepository.add({ ts: new Date().toISOString(), text: input.text, userId: input.userId, source: input.source, status: "error", message: msg });
    if (/404|not found/i.test(msg)) return { status: "rejected", message: "Producto no encontrado" };
    return { status: "error", message: "No se pudo procesar el comando" };
  }
}
