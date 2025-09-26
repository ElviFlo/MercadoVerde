"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
var Order = /** @class */ (function () {
    function Order(id, customerId, items, status, createdAt) {
        if (status === void 0) { status = "PENDING"; }
        if (createdAt === void 0) { createdAt = new Date(); }
        this.id = id;
        this.customerId = customerId;
        this.items = items;
        this.status = status;
        this.createdAt = createdAt;
    }
    return Order;
}());
exports.Order = Order;
