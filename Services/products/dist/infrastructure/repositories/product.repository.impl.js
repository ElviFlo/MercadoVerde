"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryProductRepository = void 0;
class InMemoryProductRepository {
    constructor() {
        this.products = new Map();
    }
    async create(product) {
        this.products.set(product.id, product);
        return product;
    }
    async findAll() {
        return Array.from(this.products.values());
    }
    async findById(id) {
        var _a;
        return (_a = this.products.get(id)) !== null && _a !== void 0 ? _a : null;
    }
    async update(product) {
        this.products.set(product.id, product);
        return product;
    }
    async delete(id) {
        this.products.delete(id);
    }
}
exports.InMemoryProductRepository = InMemoryProductRepository;
//# sourceMappingURL=product.repository.impl.js.map