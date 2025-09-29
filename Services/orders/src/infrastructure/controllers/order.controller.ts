import { Request, Response } from "express";
import { GetAllOrdersUseCase } from "../../application/use-cases/get-orders.use-case";
import { GetOrderByIdUseCase } from "../../application/use-cases/get-order-by-id.use-case";
import { CreateOrderUseCase } from "../../application/use-cases/create-order.use-case";
import { UpdateOrderStatusUseCase } from "../../application/use-cases/update-order-status.use-case";
import { DeleteOrderUseCase } from "../../application/use-cases/delete-order.use-case";
import { orderRepository } from "../repositories/order.repository.impl";
import { OrderStatus } from "../../domain/entities/order.entity";

// Instancias de casos de uso
const getAllUC  = new GetAllOrdersUseCase(orderRepository);
const getByIdUC = new GetOrderByIdUseCase(orderRepository);
const createUC  = new CreateOrderUseCase(orderRepository);
const updateUC  = new UpdateOrderStatusUseCase(orderRepository);
const deleteUC  = new DeleteOrderUseCase(orderRepository);

export const OrderController = {
  async getAll(_req: Request, res: Response) {
    try {
      const orders = await getAllUC.execute();
      return res.json(orders);
    } catch (err: any) {
      return res.status(err?.status || 500).json({ message: err?.message || "Internal Server Error" });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await getByIdUC.execute(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      return res.json(order);
    } catch (err: any) {
      return res.status(err?.status || 500).json({ message: err?.message || "Internal Server Error" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      // Validaciones rápidas (útiles para mejores mensajes)
      const { customer, items } = req.body || {};
      if (!customer?.name || !customer?.email) {
        return res.status(400).json({ message: "customer name and email are required" });
      }
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "items must be a non-empty array" });
      }

      const created = await createUC.execute(req.body);
      return res.status(201).json(created);
    } catch (err: any) {
      return res.status(err?.status || 500).json({ message: err?.message || "Internal Server Error" });
    }
  },

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body as { status: OrderStatus };

      const allowed: OrderStatus[] = ["PENDING", "PAID", "CANCELLED"];
      if (!allowed.includes(status)) {
        return res.status(400).json({ message: "status must be one of PENDING | PAID | CANCELLED" });
      }

      // Firma del use case: execute(id: string, status: OrderStatus)
      const updated = await updateUC.execute(id, status);
      return res.json(updated);
    } catch (err: any) {
      return res.status(err?.status || 500).json({ message: err?.message || "Internal Server Error" });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await deleteUC.execute(id);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(err?.status || 500).json({ message: err?.message || "Internal Server Error" });
    }
  },
};
