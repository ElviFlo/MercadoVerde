// src/application/use-cases/ProcessCommand.ts
import axios from "axios";
import { wordsToNumber } from "../../infrastructure/utils/wordsToNumber";
import { AuditLog } from "../../domain/entities/AuditLog";

const CART_BASE_URL = process.env.CART_URL ?? "http://cart:3005";
const PRODUCTS_BASE_URL = process.env.PRODUCTS_URL ?? "http://products:3003";

function normalizar(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// muy simple: "cafes" -> "cafe", "molidos" -> "molido"
function singular(word: string): string {
  const w = normalizar(word);
  if (w.endsWith("s")) return w.slice(0, -1);
  return w;
}

export class ProcessCommand {
  async execute(text: string, jwtToken: string): Promise<any> {
    const originalText = text.toLowerCase().trim();
    console.log(`🎙️ Comando: "${originalText}"`);

    // 1️⃣ Prohibir acciones que no soporta Kora
    const forbidden = ["eliminar", "quitar", "borrar", "cambiar"];
    if (forbidden.some((w) => originalText.includes(w))) {
      return {
        message: "Por ahora solo puedo agregar productos al carrito 😊",
      };
    }

    // 2️⃣ Extraer cantidad
    const qtyRegex =
      /\b(cero|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|\d+)\b/;

    const qtyMatch = originalText.match(qtyRegex);
    const quantity = qtyMatch ? wordsToNumber(qtyMatch[0]) : 1;

    // 3️⃣ Limpiar texto para obtener el producto
    let cleaned = originalText
      .replace(
        /\b(agrega|añade|agregar|añadir|compra|comprar|quiero|pon|pone|mete|ponme|meteme|al|carrito|por|favor|porfa)\b/g,
        ""
      )
      .replace(qtyRegex, "")
      .trim();

    cleaned = normalizar(cleaned);

    if (!cleaned || cleaned.length < 2) {
      return {
        message: "No entendí qué producto quieres agregar. ¿Puedes repetirlo?",
      };
    }

    console.log(`🧩 Producto interpretado: "${cleaned}"`);

    // Separamos en palabras para comparar una por una
    const cleanedWords = cleaned
      .split(/\s+/)
      .filter((w) => w.length > 1)
      .map(singular);

    // 4️⃣ Obtener todos los productos desde el microservicio Products
    let products: any[] = [];
    try {
      const resp = await axios.get(`${PRODUCTS_BASE_URL}/products`, {
        headers: {
          // IMPORTANTE: Products también requiere JWT
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      products = resp.data;
    } catch (err: any) {
      console.error("❌ Error pidiendo Products:", err.response?.data || err);
      return {
        message:
          "No pude consultar el catálogo de productos. Intenta más tarde.",
      };
    }

    if (!Array.isArray(products)) {
      return { message: "Error: Products devolvió un formato inválido." };
    }

    // 5️⃣ Intentar buscar coincidencia tolerante (singular/plural)
    const product =
      products.find((p) => {
        const nameNorm = normalizar(p.name ?? "");
        return cleanedWords.every((word) => nameNorm.includes(word));
      }) || // si no matchea todo, probamos con al menos una palabra
      products.find((p) => {
        const nameNorm = normalizar(p.name ?? "");
        return cleanedWords.some((word) => nameNorm.includes(word));
      });

    if (!product) {
      return {
        message: `No encontré el producto "${cleaned}" en el catálogo.`,
      };
    }

    console.log(`✅ Producto encontrado: ${product.name} (${product.id})`);

    // 6️⃣ Enviar a cart
    try {
      const resp = await axios.post(
        `${CART_BASE_URL}/cart/items`,
        {
          productId: product.id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log("🛒 Respuesta cart:", resp.data);

      return {
        message: `Agregué ${quantity} unidad(es) de "${product.name}" al carrito 🛒`,
      };
    } catch (error: any) {
      console.error(
        "❌ Error comunicando con cart:",
        error.response?.status,
        error.response?.data
      );
      return {
        message:
          "No pude agregar el producto al carrito. Intenta de nuevo más tarde.",
      };
    }
  }

  private async logAttempt(command: string, status: string) {
    const log = new AuditLog(command, status, new Date());
    console.log(`🧾 [Kora Log] ${status.toUpperCase()} → "${command}"`);
  }
}
