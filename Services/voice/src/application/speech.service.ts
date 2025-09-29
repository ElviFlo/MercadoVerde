import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../db';
import { CartService } from './cart.service'; // Puedes reutilizar tu CartService si existe

@Injectable()
export class SpeechService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly cartService: CartService, // inyección opcional según tu arquitectura
  ) {}

  async processCommand(transcript: string, language: string) {
    // Aquí iría lógica de NLP mínima
    // Ejemplo simple: "agrega 2 manzanas"
    const regex = /agrega (\d+) (\w+)/i;
    const match = transcript.match(regex);

    if (!match) {
      return { ok: false, message: 'No entendí la solicitud.' };
    }

    const quantity = parseInt(match[1], 10);
    const productName = match[2];

    // Verificar producto en DB
    const product = await this.prisma.product.findFirst({
      where: { name: productName },
    });

    if (!product) {
      return { ok: false, message: 'Producto no encontrado.' };
    }

    // Aquí se podría llamar a cartService.addItem(userId, product.id, quantity)
    return {
      ok: true,
      message: `Se añadieron ${quantity} ${productName}(s) al carrito.`,
    };
  }
}
