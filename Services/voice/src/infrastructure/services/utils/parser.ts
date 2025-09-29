// Services/voice/src/infrastructure/services/utils/parser.ts
type ParseResult = { quantity?: number; productName?: string };

const SPANISH_NUMBERS: Record<string, number> = {
  'uno': 1, 'una': 1, 'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
  'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9, 'diez': 10
};

function extractNumber(text: string): number | undefined {
  // busca dígitos explícitos
  const digit = text.match(/\b(\d{1,3})\b/);
  if (digit) return parseInt(digit[1], 10);

  // busca palabras numéricas básicas
  for (const [word, n] of Object.entries(SPANISH_NUMBERS)) {
    const re = new RegExp(`\\b${word}\\b`, 'i');
    if (re.test(text)) return n;
  }

  // busca 'medio' => 1 (opcional, ajustar si quieres soportar fracciones)
  if (/\bmedio\b/i.test(text)) return 1;

  return undefined;
}

export function resolveProductByName(text: string): ParseResult {
  if (!text || !text.trim()) return {};

  const normalized = text.toLowerCase();

  // 1) extraer cantidad (si hay)
  const qty = extractNumber(normalized);

  // 2) quitar palabras de activación y verbs comunes
  let cleaned = normalized.replace(/\b(ey kora|kora|agrega|añade|pon|por favor|porfa|al carrito|a la cesta|a mi carrito|agregar)\b/gi, ' ');

  // 3) quitar números ya detectados y palabras vacías
  cleaned = cleaned.replace(/\b(\d{1,3})\b/g, ' ').replace(/\b(un|una|el|la|los|las|de|del|con|y)\b/gi, ' ').trim();

  // 4) heurística simple: tomar las últimas 3 palabras como nombre de producto
  const words = cleaned.split(/\s+/).filter(Boolean);
  const productName = words.length === 0 ? undefined : words.slice(-3).join(' ');

  return { quantity: qty, productName };
}
