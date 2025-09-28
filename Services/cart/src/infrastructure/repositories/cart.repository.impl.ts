import prisma from '../db';
import { ICartRepository } from './cart.repository';

export class CartRepositoryImpl implements ICartRepository {
  async getCartByUserId(userId: number) {
    return prisma.cart.findFirst({
      where: { userId },
      include: { items: true }
    });
  }

  async addItemToCart(userId: number, productId: number, quantity: number, price: number) {
    let cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          items: { create: [{ productId, quantity, price }] }
        },
        include: { items: true }
      });
      return cart;
    }

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity }
      });
    }

    return prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity, price }
    });
  }

  async removeItem(itemId: string) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  }
}
