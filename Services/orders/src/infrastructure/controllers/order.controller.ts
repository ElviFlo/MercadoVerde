import { Request, Response, Router } from "express";
import { InMemoryOrderRepository } from "../repositories/order.repository.impl";
import { CreateOrderUseCase } from "../../application/use-cases/create-order.use-case";
import { GetOrdersUseCase } from "../../application/use-cases/get-orders.use-case";

const router = Router();
const orderRepository = new InMemoryOrderRepository();
const createOrderUseCase = new CreateOrderUseCase(orderRepository);
const getOrdersUseCase = new GetOrdersUseCase(orderRepository);

router.post("/", async (req: Request, res: Response) => {
  try {
    const order = await createOrderUseCase.execute(req.body);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  const orders = await getOrdersUseCase.execute();
  res.json(orders);
});

export default router;
