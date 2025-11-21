import { IOrderRepository } from '../../domain/repositories/order.repository';
import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { CartClient } from '../../infrastructure/services/cart.client';

const randomId = () => Math.random().toString(36).slice(2);

interface CreateOrderDTO {
  cartId: string;
  userName: string;
}

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly cartClient: CartClient,
  ) {}

  async execute({ cartId, userName }: CreateOrderDTO): Promise<Order> {
    const cart = await this.cartClient.getCartById(cartId);

    if (!cart) {
      throw new Error(`Cart with id ${cartId} not found`);
    }

    const items = cart.items.map(
      (i) =>
        new OrderItem(
          i.product.id,
          i.product.name,
          i.product.price,
          i.quantity,
        ),
    );

    const total = cart.total;
    const totalItems = cart.totalItems;

    const order = new Order(
      `order_${randomId()}`,
      cart.id,
      {
        id: cart.userId,
        name: userName ?? 'Unknown',
      },
      items,
      total,
      totalItems,
      'PAID',
      new Date(),
    );

    return this.orderRepository.create(order);
  }
}
