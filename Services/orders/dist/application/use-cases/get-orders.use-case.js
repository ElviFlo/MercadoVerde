"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrdersUseCase = void 0;
class GetOrdersUseCase {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async execute() {
        return this.orderRepository.findAll();
    }
}
exports.GetOrdersUseCase = GetOrdersUseCase;
