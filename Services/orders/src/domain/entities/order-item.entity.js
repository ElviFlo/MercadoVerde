"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = void 0;
var OrderItem = /** @class */ (function () {
    function OrderItem(productId, quantity, price) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }
    return OrderItem;
}());
exports.OrderItem = OrderItem;
