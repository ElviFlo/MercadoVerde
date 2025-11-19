import { OrderItem } from './order-item.entity';

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED';
export type PaymentMethod = 'CARD' | 'CASH' | 'TRANSFER';

export interface Customer {
  name: string;
  email: string;
}

export class Order {
  constructor(
    public readonly id: string,
    public customer: Customer,
    public items: OrderItem[],
    public note?: string,
    public payment?: { method: PaymentMethod; transactionId?: string },
    public status: OrderStatus = 'PENDING',
    public readonly createdAt: Date = new Date(),
  ) {
    if (!id) throw new Error('id is required');
    if (!customer?.name || !customer?.email) {
      throw new Error('customer name and email are required');
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('order must have at least one item');
    }
  }

  get total(): number {
    return this.items.reduce((acc, it) => acc + it.subtotal, 0);
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
  }

  removeItem(productId: string): void {
    const idx = this.items.findIndex(i => i.productId === productId);
    if (idx >= 0) this.items.splice(idx, 1);
  }

  updateStatus(next: OrderStatus): void {
    this.status = next;
  }
}
