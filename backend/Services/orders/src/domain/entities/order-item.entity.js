"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = void 0;
var OrderItem = /** @class */ (function () {
    function OrderItem(productId, quantity, unitPrice) {
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        if (!productId)
            throw new Error('productId is required');
        if (!Number.isFinite(quantity) || quantity <= 0) {
            throw new Error('quantity must be a positive number');
        }
        if (!Number.isFinite(unitPrice) || unitPrice < 0) {
            throw new Error('unitPrice must be a non-negative number');
        }
    }
    Object.defineProperty(OrderItem.prototype, "subtotal", {
        get: function () {
            return this.quantity * this.unitPrice;
        },
        enumerable: false,
        configurable: true
    });
    return OrderItem;
}());
exports.OrderItem = OrderItem;
