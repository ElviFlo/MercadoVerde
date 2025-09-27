export class ProductError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductError';
  }

  static notFound() {
    return new ProductError('Producto no encontrado.');
  }

  static invalidData() {
    return new ProductError('Datos de producto inválidos.');
  }
}
