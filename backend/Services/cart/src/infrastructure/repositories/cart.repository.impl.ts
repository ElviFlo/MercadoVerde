// src/infrastructure/repositories/cart.repository.impl.ts

import { Injectable } from '@nestjs/common';
import {
  CartRepository,
  CartSummary,
} from './cart.repository';
import { CartItem } from '../../domain/entities/cart-item.entity';
import crypto from 'node:crypto';

@Injectable()
export class CartRepositoryImpl implements CartRepository {
  private items: CartItem[] = [];

  // ✅ GET resumen por usuario (usado por GetCartSummaryUseCase y el controller)
  async getSummaryByUser(userId: string): Promise<CartSummary> {
    const items = this.items.filter((i) => i.userId === userId);

    const count = items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

    return { items, count, subtotal };
  }

  // ✅ ADD item (usado por AddToCartUseCase)
  async addItem(
    userId: string,
    productId: string,
    quantity: number,
    unitPrice: number,
  ): Promise<CartItem> {
    const now = new Date();

    const cartId = `cart-${userId}`;

    const existing = this.items.find(
      (i) => i.userId === userId && i.productId === productId,
    );

    if (existing) {
      existing.quantity += quantity;
      existing.updatedAt = now;
      // opcional: actualizar precio a último unitPrice, según tu regla
      existing.price = unitPrice;
      return existing;
    }

    const item: CartItem = {
      id: crypto.randomUUID(),
      cartId,
      userId,
      productId,
      quantity,
      price: unitPrice,
      createdAt: now,
      updatedAt: now,
    };

    this.items.push(item);
    return item;
  }

  // ✅ REMOVE item (usado por RemoveFromCartUseCase)
  async removeItem(userId: string, productId: string): Promise<void> {
    this.items = this.items.filter(
      (i) => !(i.userId === userId && i.productId === productId),
    );
  }

  // ✅ CLEAR (usado por ClearCartUseCase)
  async clear(userId: string): Promise<void> {
    this.items = this.items.filter((i) => i.userId !== userId);
  }

  // ✅ DECREMENT (usado por DecrementItemUseCase)
  async decrementItem(userId: string, productId: string): Promise<void> {
    const item = this.items.find(
      (i) => i.userId === userId && i.productId === productId,
    );

    // Si no existe, la operación es idempotente: no hace nada.
    if (!item) return;

    // Regla de negocio: NO eliminar si está en 1, solo se deja igual.
    if (item.quantity <= 1) {
      return;
    }

    item.quantity -= 1;
    item.updatedAt = new Date();
  }
}
