"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_repository_impl_1 = require("../repositories/order.repository.impl");
const create_order_use_case_1 = require("../../application/use-cases/create-order.use-case");
const get_orders_use_case_1 = require("../../application/use-cases/get-orders.use-case");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const orderRepository = new order_repository_impl_1.InMemoryOrderRepository();
const createOrderUseCase = new create_order_use_case_1.CreateOrderUseCase(orderRepository);
const getOrdersUseCase = new get_orders_use_case_1.GetOrdersUseCase(orderRepository);
router.post("/", auth_middleware_1.authenticateToken, async (req, res) => {
    try {
        const order = await createOrderUseCase.execute(req.body);
        res.status(201).json(order);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get("/", auth_middleware_1.authenticateToken, async (_req, res) => {
    const orders = await getOrdersUseCase.execute();
    res.json(orders);
});
exports.default = router;
