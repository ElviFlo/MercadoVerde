// Services/orders/src/application/use-cases/get-all-orders.usecase.ts
import type { OrderRepository } from "../../infrastructure/repositories/order.repository";

export class GetAllOrdersUseCase {
  constructor(private readonly orderRepo: OrderRepository) {}

  async execute() {
    // aquí podrías aplicar filtros si quisieras
    return this.orderRepo.findAllWithItems();
  }
}
