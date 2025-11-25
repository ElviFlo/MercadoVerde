// src/infrastructure/controllers/order.controller.ts
import { Request, Response } from "express";
import { CreateOrderUseCase } from "../../application/use-cases/create-order.use-case";
import { GetAllOrdersUseCase } from "../../application/use-cases/get-orders.use-case";

export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrdersUseCase: GetAllOrdersUseCase,
  ) {}

  // POST /orders
  create = async (req: Request, res: Response) => {
    try {
      const { cartId } = req.body;

      if (!cartId) {
        return res.status(400).json({ message: "cartId is required" });
      }

      const user = (req as any).user;

      if (!user || !user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // nombre visible en la orden (si no hay name, usamos email)
      const userName: string | undefined = user.name ?? user.email ?? "Unknown";

      const order = await this.createOrderUseCase.execute({
        cartId,
        userName,
      });

      // 🔁 Mapeamos la entidad de dominio a un DTO estable para el frontend
      const response = {
        id: order.id,
        status: order.status,
        total: order.total,
        totalItems: order.totalItems,
        createdAt: order.createdAt, // se serializa como ISO string
        customerName: order.customer.name,
        items: order.items.map((it) => ({
          productId: it.productId,
          name: it.productName,
          unitPrice: it.unitPrice,
          quantity: it.quantity,
          subtotal: it.subtotal,
        })),
      };

      return res.status(201).json(response);
    } catch (e) {
      console.error("[orders] Error creating order:", e);
      return res.status(500).json({ message: (e as Error).message });
    }
  };

  // GET /orders  -> órdenes del usuario logueado
  getAll = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;

      if (!user || !user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const orders = await this.getOrdersUseCase.execute(user.id);

      const response = orders.map((order) => ({
        id: order.id,
        status: order.status,
        total: order.total,
        totalItems: order.totalItems,
        createdAt: order.createdAt,
        customerName: order.customer.name,
        items: order.items.map((it) => ({
          productId: it.productId,
          name: it.productName,
          unitPrice: it.unitPrice,
          quantity: it.quantity,
          subtotal: it.subtotal,
        })),
      }));

      return res.json(response);
    } catch (e) {
      console.error("[orders] Error loading orders:", e);
      return res.status(500).json({ message: (e as Error).message });
    }
  };
}
