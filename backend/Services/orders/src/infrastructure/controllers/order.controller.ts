<<<<<<< HEAD
// src/infrastructure/controllers/order.controller.ts
import { Request, Response } from "express";
import { CreateOrderUseCase } from "../../application/use-cases/create-order.use-case";
import { GetAllOrdersUseCase } from "../../application/use-cases/get-orders.use-case";
=======
import { Request, Response } from "express";
import { CreateOrder } from "../../application/use-cases/create-order.use-case";
import { OrderRepository } from "../repositories/order.repository";
import { CartService } from "../services/cart.client";
>>>>>>> c0d14b7ae15698fe898874b8489b0b4ec505114e

const orderRepository = new OrderRepository();
const cartService = new CartService();
const createOrderUC = new CreateOrder(orderRepository, cartService);

export class OrdersController {
  // 📌 Crear orden (cliente)
  async create(req: Request, res: Response) {
    try {
<<<<<<< HEAD
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
=======
      const u = (req as any).user;
      if (!u) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const authHeader = req.headers.authorization as string | undefined;
      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Falta header Authorization" });
      }
>>>>>>> c0d14b7ae15698fe898874b8489b0b4ec505114e

      const userId = String(u.sub ?? u.id);
      const userName = String(u.name ?? "");
      const userEmail = u.email as string | undefined;

      const order = await createOrderUC.execute({
        userId,
        userName,
        userEmail,
        authHeader,
      });

<<<<<<< HEAD
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
=======
      return res.status(201).json(order);
    } catch (err: any) {
      console.error("[OrdersController.create] error:", err?.message);
      return res.status(500).json({
        message: "Error creando la orden",
        error: err?.message,
      });
>>>>>>> c0d14b7ae15698fe898874b8489b0b4ec505114e
    }
  }

<<<<<<< HEAD
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
=======
  async getMine(req: Request, res: Response) {
    try {
      const u = (req as any).user;
      if (!u) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const userId = String(u.sub ?? u.id);
      const orders = await orderRepository.getByUser(userId);
      return res.status(200).json(orders);
    } catch (err: any) {
      console.error("[OrdersController.getMine] error:", err?.message);
      return res.status(500).json({
        message: "Error listando tus órdenes",
        error: err?.message,
      });
    }
  }

  async getAll(_req: Request, res: Response) {
    try {
      const orders = await orderRepository.listAll();
      return res.status(200).json(orders);
    } catch (err: any) {
      console.error("[OrdersController.getAll] error:", err?.message);
      return res.status(500).json({
        message: "Error listando órdenes",
        error: err?.message,
      });
    }
  }
>>>>>>> c0d14b7ae15698fe898874b8489b0b4ec505114e
}
