"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProduct = void 0;
const Product_1 = require("../../domain/entities/Product");
const crypto_1 = require("crypto");
class CreateProduct {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(data) {
        var _a, _b;
        const id = (0, crypto_1.randomUUID)();
        const product = new Product_1.Product(id, data.name, (_a = data.description) !== null && _a !== void 0 ? _a : null, data.price, (_b = data.stock) !== null && _b !== void 0 ? _b : 0, new Date());
        return this.productRepository.create(product);
    }
}
exports.CreateProduct = CreateProduct;
//# sourceMappingURL=CreateProduct.js.map