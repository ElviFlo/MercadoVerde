import { Request, Response } from "express";
import { OrderRepository } from "../repositories/order.repository";

const repo = new OrderRepository();

export const OrdersController = {
  // CLIENT: crear orden
  async create(req: Request, res: Response) {
    try {
      const u = (req as any).user!;
      const userId = String(u.sub ?? u.id);
      const authHeader = req.headers.authorization as string | undefined;

      const items = req.body?.items as Array<{
        productId: string;   // en tu schema de orders es String
        quantity: number;
      }>;

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "items[] requerido" });
      }

      const order = await repo.createOrder(userId, items, authHeader);
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
    const u = (req as any).user!;
    const userId = String(u.sub ?? u.id);
    const orders = await repo.getByUser(userId);
    return res.json(orders);
  },

  // CLIENT: detalle de una orden propia
  async getByIdClient(req: Request, res: Response) {
    const id = String(req.params.id);
    const u = (req as any).user!;
    const order = await repo.getByUser(u.sub ?? u.id)
      .then((orders)=>orders.find(o=>String(o.id)===id));
    if (!order) return res.status(404).json({ message: "No encontrada o no autorizada" });
    return res.json(order);
  },

  // ADMIN: detalle de cualquier orden
  async getByIdAdmin(req: Request, res: Response) {
    const id = String(req.params.id);
    const order = await repo.getById(id);
    if (!order) return res.status(404).json({ message: "No encontrada" });
    return res.json(order);
  },
};
