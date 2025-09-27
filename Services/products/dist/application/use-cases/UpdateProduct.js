"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProduct = void 0;
class UpdateProduct {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(data) {
        var _a, _b, _c, _d;
        const existing = await this.productRepository.findById(data.id);
        if (!existing)
            throw new Error("Producto no encontrado");
        existing.name = (_a = data.name) !== null && _a !== void 0 ? _a : existing.name;
        existing.description = (_b = data.description) !== null && _b !== void 0 ? _b : existing.description;
        existing.price = (_c = data.price) !== null && _c !== void 0 ? _c : existing.price;
        existing.stock = (_d = data.stock) !== null && _d !== void 0 ? _d : existing.stock;
        existing.updatedAt = new Date();
        return this.productRepository.update(existing);
    }
}
exports.UpdateProduct = UpdateProduct;
//# sourceMappingURL=UpdateProduct.js.map