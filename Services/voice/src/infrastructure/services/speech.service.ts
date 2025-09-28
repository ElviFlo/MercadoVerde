// Services/voice/src/infrastructure/services/speech.service.ts
import prisma from '../repositories/db'; // ajusta la ruta si tu db.ts está en otra ubicación
import { resolveProductByName } from './utils/parser';
import type { ParseResult } from './utils/parser';

type ProcessResult =
  | { success: true; product: any; addedQuantity: number; rawResponse?: any }
  | { success: false; reason: string };

const DEFAULT_PRODUCTS_URL = process.env.PRODUCTS_URL ?? 'http://products:3003';
const DEFAULT_CART_URL = process.env.CART_URL ?? 'http://cart:3002/api/cart';
const CONF_THRESHOLD = Number(process.env.VOICE_CONF_THRESHOLD ?? 0.6);

// helper: get a fetch function (uses global.fetch if available, otherwise dynamic import node-fetch)
async function getFetch() {
  if (typeof (globalThis as any).fetch === 'function') return (globalThis as any).fetch.bind(globalThis);
  // dynamic import to avoid ESM/CJS issues if node-fetch isn't installed
  try {
    // node-fetch v2 default export is a function; v3 is ESM — dynamic import handles both if installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nf = await import('node-fetch');
    return (nf.default ?? nf) as unknown as typeof fetch;
  } catch {
    throw new Error('No fetch available. Install node-fetch (npm i node-fetch@2) or use Node 18+');
  }
}

export class SpeechService {
  async handleTranscript(transcript: string, confidence = 1, source?: string): Promise<ProcessResult> {
    const t = (transcript ?? '').trim();
    if (!t) return { success: false, reason: 'Empty transcript' };

    // 1) basic intent detection + forbidden intent check
    const text = t.toLowerCase();
    const isAdd = /\b(agrega|añade|pon|añadir|añádeme|poner)\b/.test(text);
    const isForbidden = /\b(quita|elimina|borra|paga|pagar|cambia|cambiar)\b/.test(text);

    // create a base log entry object (we'll enrich before saving)
    const baseLog = {
      transcript: t,
      language: 'es',
      confidence,
      activation: 'kora',
      intent: isAdd ? 'add_to_cart' : (isForbidden ? 'forbidden' : 'unknown'),
      result: 'pending',
      createdAt: new Date()
    };

    // 2) reject forbidden intents immediately
    if (isForbidden) {
      await prisma.voiceIntentsLog.create({ data: { ...baseLog, result: 'rejected_forbidden' } });
      return { success: false, reason: 'Por voz solo se permite añadir productos al carrito.' };
    }

    // 3) low confidence guard
    if (confidence < CONF_THRESHOLD) {
      await prisma.voiceIntentsLog.create({ data: { ...baseLog, result: 'rejected_low_confidence' } });
      return { success: false, reason: 'Confianza baja — repite el comando o usa el botón.' };
    }

    // 4) parse quantity + product name
    const parsed: ParseResult = resolveProductByName(text);
    if (!parsed.productName) {
      await prisma.voiceIntentsLog.create({ data: { ...baseLog, result: 'rejected_no_product' } });
      return { success: false, reason: 'No pude identificar el producto. ¿Cuál producto quieres añadir?' };
    }

    // 5) resolve product via products service (search endpoint expected)
    try {
      const fetchFn = await getFetch();
      const searchUrl = `${DEFAULT_PRODUCTS_URL}/products/search?q=${encodeURIComponent(parsed.productName)}`;
      const res = await fetchFn(searchUrl, { method: 'GET' });
      if (!res.ok) {
        await prisma.voiceIntentsLog.create({ data: { ...baseLog, result: 'product_search_error' } });
        return { success: false, reason: 'Error buscando el producto.' };
      }
      const candidates = await res.json();
      if (!Array.isArray(candidates) || candidates.length === 0) {
        await prisma.voiceIntentsLog.create({ data: { ...baseLog, result: 'product_not_found' } });
        return { success: false, reason: 'No encontré el producto buscado.' };
      }

      // pick best candidate (MVP: first)
      const product = candidates[0];

      // 6) check stock (assume product has `stock` numeric)
      const qty = parsed.quantity ?? 1;
      if (typeof product.stock === 'number' && product.stock < qty) {
        await prisma.voiceIntentsLog.create({ data: { ...baseLog, result: 'out_of_stock' } });
        return { success: false, reason: 'Stock insuficiente para la cantidad solicitada.' };
      }

      // 7) call cart microservice to add item
      // NOTE: cart endpoint in this project uses /api prefix
      const cartUserId = parsed['userId'] ?? 1; // MVP: you must supply mapping from voice user -> numeric userId (or extract from auth)
      const cartUrl = `${DEFAULT_CART_URL}/${cartUserId}/items`;
      const addResp = await fetchFn(cartUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: qty, price: product.price })
      });

      const addBody = await addResp.json().catch(() => null);
      if (!addResp.ok) {
        await prisma.voiceIntentsLog.create({ data: { ...baseLog, result: 'cart_add_error' } });
        return { success: false, reason: 'No fue posible añadir al carrito.' };
      }

      // 8) success: log and return
      await prisma.voiceIntentsLog.create({
        data: {
          ...baseLog,
          result: 'added',
          // store some structured info in the DB if needed (prisma schema limited: store as text fields maybe)
        }
      });

      return { success: true, product, addedQuantity: qty, rawResponse: addBody };
    } catch (err: any) {
      console.error('speech.service error:', err && err.stack ? err.stack : err);
      await prisma.voiceIntentsLog.create({ data: { ...baseLog, result: 'internal_error' } });
      return { success: false, reason: 'Error interno al procesar la voz.' };
    }
  }
}
