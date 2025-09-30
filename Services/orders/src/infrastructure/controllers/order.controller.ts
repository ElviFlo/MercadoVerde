import { Request, Response } from "express";
import { OrderRepository } from "../repositories/order.repository";

const repo = new OrderRepository();

export const OrdersController = {
  // CLIENT: crear orden
  async create(req: Request, res: Response) {
    try {
      const u = req.user!;
      const userId = Number(u.sub);
      const items = req.body?.items as {
        productId: number;
        quantity: number;
      }[];
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "items[] requerido" });
      }
      const order = await repo.createFromItems(userId, items);
      return res.status(201).json(order);
    } catch (e: any) {
      return res
        .status(400)
        .json({ message: e?.message ?? "No se pudo crear la orden" });
    }
  },

  // ADMIN: listar todas
  async listAll(_req: Request, res: Response) {
    const orders = await repo.listAll();
    return res.json(orders);
  },

  // CLIENT: listar mis órdenes
  async listMine(req: Request, res: Response) {
    const u = req.user!;
    const orders = await repo.listByUser(Number(u.sub));
    return res.json(orders);
  },

  // ADMIN o DUEÑO: detalle
  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!Number.isFinite(id))
      return res.status(400).json({ message: "id inválido" });

    const order = await repo.getById(id);
    if (!order) return res.status(404).json({ message: "No encontrada" });

    const u = req.user!;
    const isAdmin = u.role === "admin";
    const isOwner = String(order.userId) === String(u.sub);
    if (!isAdmin && !isOwner)
      return res.status(403).json({ message: "No autorizado" });

    return res.json(order);
  },
};
