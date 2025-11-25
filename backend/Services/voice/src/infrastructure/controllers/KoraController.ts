// src/infrastructure/controllers/KoraController.ts
import { Request, Response } from "express";
import { parseCommand } from "../services/NluParser";
import { ProductsService } from "../services/products.service";
import { CartService } from "../services/cart.service";
import { transcribeAudioFromBuffer } from "../services/transcribe.service";

export class KoraController {
  // -------- TEXTO: POST /api/kora/command --------
  async handleCommand(req: Request, res: Response) {
    try {
      const u = (req as any).user;
      if (!u) return res.status(401).json({ message: "Usuario no autenticado" });

      const userId = String(u.sub ?? u.id);
      const authHeader = req.headers.authorization as string | undefined;

      const { text } = req.body || {};
      if (!text || typeof text !== "string") {
        return res.status(400).json({ message: "text requerido" });
      }

      const parsed = parseCommand(text);

      if (parsed.intent === "forbidden") {
        return res
          .status(400)
          .json({ message: "Ese tipo de acción no está permitida por Kora" });
      }

      if (parsed.intent !== "add" || !parsed.productName) {
        return res.status(400).json({
          message: "No entendí qué producto agregar",
        });
      }

      const quantity = parsed.quantity ?? 1;
      const productQuery = parsed.productName;

      const found = await ProductsService.searchProducts(productQuery, authHeader);

      if (!found || found.length === 0) {
        return res.status(200).json({
          message: `No encontré el producto '${productQuery}' en el catálogo.`,
        });
      }

      const chosen = found[0];

      const cartResult = await CartService.addToCart(
        userId,
        chosen.id,
        quantity,
        authHeader
      );

      return res.status(200).json({
        message: `Agregué ${quantity} unidad(es) de '${chosen.name}' al carrito :)`,
        product: chosen,
        cart: cartResult,
      });
    } catch (err: any) {
      return res.status(500).json({
        message: "Error procesando comando",
        error: err?.message,
      });
    }
  }

  // -------- AUDIO: POST /api/kora/voice --------
  async handleVoiceCommand(req: Request, res: Response) {
    try {
      const file = (req as any).file;
      if (!file) return res.status(400).json({ message: "Falta archivo de audio" });

      // 🔥 Transcribir audio REAL
      const text = await transcribeAudioFromBuffer(file.buffer, file.originalname);

      // Reusar el comando normal
      (req as any).body = { text };
      return this.handleCommand(req, res);
    } catch (err: any) {
      return res.status(500).json({
        message: "Error procesando comando de voz",
        error: err?.message,
      });
    }
  }
}
