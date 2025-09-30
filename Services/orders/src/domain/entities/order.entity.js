"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
var Order = /** @class */ (function () {
    function Order(id, customer, items, note, payment, status, createdAt) {
        if (status === void 0) { status = 'PENDING'; }
        if (createdAt === void 0) { createdAt = new Date(); }
        this.id = id;
        this.customer = customer;
        this.items = items;
        this.note = note;
        this.payment = payment;
        this.status = status;
        this.createdAt = createdAt;
        if (!id)
            throw new Error('id is required');
        if (!(customer === null || customer === void 0 ? void 0 : customer.name) || !(customer === null || customer === void 0 ? void 0 : customer.email)) {
            throw new Error('customer name and email are required');
        }
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('order must have at least one item');
        }
    }
    Object.defineProperty(Order.prototype, "total", {
        get: function () {
            return this.items.reduce(function (acc, it) { return acc + it.subtotal; }, 0);
        },
        enumerable: false,
        configurable: true
    });
    Order.prototype.addItem = function (item) {
        this.items.push(item);
    };
    Order.prototype.removeItem = function (productId) {
        var idx = this.items.findIndex(function (i) { return i.productId === productId; });
        if (idx >= 0)
            this.items.splice(idx, 1);
    };
    Order.prototype.updateStatus = function (next) {
        this.status = next;
    };
    return Order;
}());
exports.Order = Order;
