// Services/orders/src/main.ts
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import { orderRoutes } from "./infrastructure/routes/order.routes";
import { setupSwagger } from "./infrastructure/swagger/order.swagger";
import { OrderController } from "./infrastructure/controllers/order.controller";
import { CreateOrderUseCase } from "./application/use-cases/create-order.use-case";
import { GetAllOrdersUseCase } from "./application/use-cases/get-orders.use-case";
import { orderRepository as inMemoryOrderRepository } from "./infrastructure/repositories/order.repository.impl";
import { CartClient } from "./infrastructure/services/cart.client";

const app = express();
const PORT = Number(process.env.PORT ?? 3002);

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, service: "orders" });
});

setupSwagger(app);

const cartClient = new CartClient();

const createOrderUseCase = new CreateOrderUseCase(
  inMemoryOrderRepository,
  cartClient,
);

const getAllOrdersUseCase = new GetAllOrdersUseCase(inMemoryOrderRepository);

const orderController = new OrderController(
  createOrderUseCase,
  getAllOrdersUseCase,
);

const ordersRouter = orderRoutes(orderController);

app.use("/orders", ordersRouter);

app.use((_req, res) => res.status(404).json({ message: "Not found" }));

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[orders] Error:", err);
  res
    .status(err?.status || 500)
    .json({ message: err?.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(
    `🟢 Orders service running on http://localhost:${PORT}/docs/ with Swagger`,
  );
});