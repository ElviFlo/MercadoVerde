// src/infrastructure/repositories/cart.repository.impl.ts
import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { CartItem } from '../../domain/entities/cart-item.entity';
import crypto from 'node:crypto';

@Injectable()
export class CartRepositoryImpl implements CartRepository {
  private items: CartItem[] = [];

  async addItem(
    userId: string,
    productId: string,
    quantity: number,
    price: number,
  ): Promise<CartItem> {
    const now = new Date();
    const existing = this.items.find(
      (i) => i.userId === userId && i.productId === productId,
    );

    if (existing) {
      existing.quantity += quantity;
      existing.updatedAt = now;
      return existing;
    }

    const item: CartItem = {
      id: crypto.randomUUID(),
      userId,
      productId,
      quantity,
      price,
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(item);
    return item;
  }

  async getByUser(userId: string): Promise<CartItem[]> {
    return this.items.filter((i) => i.userId === userId);
  }

  async removeItem(userId: string, productId: string): Promise<void> {
    this.items = this.items.filter(
      (i) => !(i.userId === userId && i.productId === productId),
    );
  }

  async clear(userId: string): Promise<void> {
    this.items = this.items.filter((i) => i.userId !== userId);
  }
}
