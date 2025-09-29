import { wordsToNumber } from "../utils/wordsToNumber";

export type Parsed = {
  intent: "add" | "unknown" | "forbidden";
  quantity?: number;
  productName?: string;
  raw: string;
};

const addWords = ["agrega", "añade", "pon", "mete", "agregar", "añadir"];
const forbiddenWords = ["quitar", "elimina", "pagar", "paga", "cobrar", "cambiar", "modificar", "checkout", "pago"];

export function parseCommand(text: string): Parsed {
  const raw = (text || "").trim().toLowerCase();

  for (const fw of forbiddenWords) {
    if (raw.includes(fw)) return { intent: "forbidden", raw };
  }

  let foundAdd = false;
  for (const w of addWords) {
    if (raw.startsWith(w + " ") || raw.includes(" " + w + " ") || raw === w) {
      foundAdd = true;
      break;
    }
  }

  if (!foundAdd) return { intent: "unknown", raw };

  // Remove leading verb
  let after = raw;
  for (const w of addWords) {
    if (after.startsWith(w + " ")) {
      after = after.slice(w.length).trim();
      break;
    } else if (after === w) {
      after = "";
      break;
    }
  }

  const tokens = after.split(/\s+/).filter(Boolean);
  let quantity: number | undefined;
  let productName = after;

  if (tokens.length) {
    const first = tokens[0].replace(/[.,]/g, "");
    const n = Number(first);
    if (!isNaN(n) && n > 0) {
      quantity = Math.trunc(n);
      productName = tokens.slice(1).join(" ");
    } else {
      const w2n = wordsToNumber(first);
      if (w2n && w2n > 0) {
        quantity = w2n;
        productName = tokens.slice(1).join(" ");
      } else if (["un", "una", "uno"].includes(first)) {
        quantity = 1;
        productName = tokens.slice(1).join(" ");
      } else {
        productName = after;
      }
    }
  }

  if (!productName || productName.trim() === "") return { intent: "unknown", raw };

  return { intent: "add", quantity, productName: productName.trim(), raw };
}
