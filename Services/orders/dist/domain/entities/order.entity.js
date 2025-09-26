"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    constructor(id, customerId, items, status = "PENDING", createdAt = new Date()) {
        this.id = id;
        this.customerId = customerId;
        this.items = items;
        this.status = status;
        this.createdAt = createdAt;
    }
}
exports.Order = Order;
