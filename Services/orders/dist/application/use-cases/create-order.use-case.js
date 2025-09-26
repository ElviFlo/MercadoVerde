"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderUseCase = void 0;
const order_entity_1 = require("../../domain/entities/order.entity");
const order_item_entity_1 = require("../../domain/entities/order-item.entity");
const crypto_1 = require("crypto");
class CreateOrderUseCase {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async execute(data) {
        const items = data.items.map((i) => new order_item_entity_1.OrderItem(i.productId, i.quantity, i.price));
        const order = new order_entity_1.Order((0, crypto_1.randomUUID)(), data.customerId, items);
        return this.orderRepository.create(order);
    }
}
exports.CreateOrderUseCase = CreateOrderUseCase;
