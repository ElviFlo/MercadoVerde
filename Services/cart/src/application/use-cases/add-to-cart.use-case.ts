import { CartRepositoryImpl } from '../../infrastructure/repositories/cart.repository.impl';

export class AddToCartUseCase {
  constructor(private repo = new CartRepositoryImpl()) {}

  async execute(userId: number, productId: number, quantity: number, price: number) {
    return this.repo.addItemToCart(userId, productId, quantity, price);
  }
}
