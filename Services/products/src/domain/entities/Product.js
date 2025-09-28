"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
var Product = /** @class */ (function () {
    function Product(id, name, description, price, stock, createdAt, updatedAt) {
        if (createdAt === void 0) { createdAt = new Date(); }
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    return Product;
}());
exports.Product = Product;
