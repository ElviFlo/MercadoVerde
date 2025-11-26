// src/application/use-cases/get-orders.use-case.ts
import { OrderRepository } from "../../infrastructure/repositories/order.repository";

export class GetOrders {
  constructor(private readonly orderRepo: OrderRepository) {}

  async getMine(userId: string) {
    return this.orderRepo.getByUser(userId);
  }

  async getAll() {
    return this.orderRepo.listAll();
  }
}
