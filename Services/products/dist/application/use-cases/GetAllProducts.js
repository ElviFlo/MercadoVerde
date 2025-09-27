"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllProducts = void 0;
class GetAllProducts {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute() {
        return this.productRepository.findAll();
    }
}
exports.GetAllProducts = GetAllProducts;
//# sourceMappingURL=GetAllProducts.js.map