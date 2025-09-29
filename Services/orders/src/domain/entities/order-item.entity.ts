export class OrderItem {
  constructor(
    public productId: string,
    public quantity: number,
    public unitPrice: number,
  ) {
    if (!productId) throw new Error('productId is required');
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error('quantity must be a positive number');
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new Error('unitPrice must be a non-negative number');
    }
  }

  get subtotal(): number {
    return this.quantity * this.unitPrice;
  }
}
