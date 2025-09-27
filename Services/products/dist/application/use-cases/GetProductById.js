"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductById = void 0;
class GetProductById {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(id) {
        const p = await this.productRepository.findById(id);
        if (!p)
            throw new Error("Producto no encontrado");
        return p;
    }
}
exports.GetProductById = GetProductById;
//# sourceMappingURL=GetProductById.js.map