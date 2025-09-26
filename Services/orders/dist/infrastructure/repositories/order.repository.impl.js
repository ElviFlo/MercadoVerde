"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryOrderRepository = void 0;
class InMemoryOrderRepository {
    constructor() {
        this.orders = [];
    }
    async create(order) {
        this.orders.push(order);
        return order;
    }
    async findAll() {
        return this.orders;
    }
}
exports.InMemoryOrderRepository = InMemoryOrderRepository;
