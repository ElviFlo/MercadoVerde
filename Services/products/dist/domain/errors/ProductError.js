"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductError = void 0;
class ProductError extends Error {
    constructor(message) {
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
exports.ProductError = ProductError;
//# sourceMappingURL=ProductError.js.map