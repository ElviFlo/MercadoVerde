import { CartRepositoryImpl } from '../../infrastructure/repositories/cart.repository.impl';

export class RemoveFromCartUseCase {
  constructor(private repo = new CartRepositoryImpl()) {}

  async execute(itemId: string) {
    return this.repo.removeItem(itemId);
  }
}
