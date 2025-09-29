import { IOrderRepository } from '../../domain/repositories/order.repository';
import { Order, OrderStatus } from '../../domain/entities/order.entity';

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  /**
   * Cambia el estado de una orden existente
   * @param id Identificador único de la orden
   * @param status Nuevo estado de la orden: 'PENDING' | 'PAID' | 'CANCELLED'
   * @returns Orden actualizada con el nuevo estado
   */
  async execute(id: string, status: OrderStatus): Promise<Order> {
    // 1. Buscar la orden en el repositorio
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }

    // 2. Validar el nuevo estado
    const validStatuses: OrderStatus[] = ['PENDING', 'PAID', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    // 3. Actualizar estado
    order.status = status;

    // 4. Guardar cambios en el repositorio
    const updated = await this.orderRepository.update(order);

    return updated;
  }
}
