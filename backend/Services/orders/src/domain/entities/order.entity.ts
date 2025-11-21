import { OrderItem } from './order-item.entity';

export type OrderStatus = 'PAID';
export type PaymentMethod = 'CARD' | 'CASH' | 'TRANSFER';

export interface OrderCustomer {
  id: string;
  name: string;
  email?: string | null;
}

export class Order {
  constructor(
    public readonly id: string,
    public readonly cartId: string,
    public readonly customer: OrderCustomer,
    public readonly items: OrderItem[],
    public readonly total: number,
    public readonly totalItems: number,

    public status: OrderStatus = 'PAID',
    public readonly createdAt: Date = new Date(),
  ) {
    if (!id) throw new Error('id is required');
    if (!cartId) throw new Error('cartId is required');

    if (!customer?.id || !customer?.name) {
      throw new Error('customer id and name are required');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('order must have at least one item');
    }

    if (!Number.isFinite(total) || total < 0) {
      throw new Error('total must be a non-negative number');
    }

    if (!Number.isInteger(totalItems) || totalItems <= 0) {
      throw new Error('totalItems must be a positive integer');
    }
  }
}
