import { Request, Response } from "express";
import { CreateOrder } from "../../application/use-cases/create-order.use-case";
import { OrderRepository } from "../repositories/order.repository";
import { CartService } from "../services/cart.client";

const orderRepository = new OrderRepository();
const cartService = new CartService();
const createOrderUC = new CreateOrder(orderRepository, cartService);

export class OrdersController {
  // 📌 Crear orden (cliente)
  async create(req: Request, res: Response) {
    try {
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

      const userId = String(u.sub ?? u.id);
      const userName = String(u.name ?? "");
      const userEmail = u.email as string | undefined;

      const order = await createOrderUC.execute({
        userId,
        userName,
        userEmail,
        authHeader,
      });

      return res.status(201).json(order);
    } catch (err: any) {
      console.error("[OrdersController.create] error:", err?.message);
      return res.status(500).json({
        message: "Error creando la orden",
        error: err?.message,
      });
    }
  }

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
}
