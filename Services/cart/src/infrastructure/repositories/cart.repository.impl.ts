import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { CartItem } from '../../domain/entities/cart-item.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class CartRepositoryImpl implements CartRepository {
  private items: CartItem[] = [];

  async addItem(userId: string, productId: string, quantity: number, price: number): Promise<CartItem> {
    const now = new Date();

    // si ya existe el mismo producto en el carrito del usuario, acumula la cantidad
    const idx = this.items.findIndex(i => i.userId === userId && i.productId === productId);
    if (idx >= 0) {
      const it = this.items[idx];
      const updated: CartItem = { ...it, quantity: it.quantity + quantity, price, updatedAt: now };
      this.items[idx] = updated;
      return updated;
    }

    const created: CartItem = {
      id: randomUUID(),
      userId,
      productId,     // UUID string
      quantity,
      price,
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(created);
    return created;
  }

  async getItems(userId: string): Promise<CartItem[]> {
    return this.items.filter(i => i.userId === userId);
  }

  async removeItem(userId: string, productId: string): Promise<void> {
    this.items = this.items.filter(i => !(i.userId === userId && i.productId === productId));
  }

  async clear(userId: string): Promise<void> {
    this.items = this.items.filter(i => i.userId !== userId);
  }
}
