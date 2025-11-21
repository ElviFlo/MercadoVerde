export class OrderItem {
  constructor(
    public productId: string,
    public productName: string,
    public unitPrice: number,
    public quantity: number,
  ) {
    if (!productId) {
      throw new Error('productId is required');
    }
    if (!productName) {
      throw new Error('productName is required');
    }
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