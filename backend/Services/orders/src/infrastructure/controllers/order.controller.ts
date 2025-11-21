import { Request, Response } from 'express';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { GetAllOrdersUseCase } from '../../application/use-cases/get-orders.use-case';

export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrdersUseCase: GetAllOrdersUseCase,
  ) {}

  // POST /orders
  create = async (req: Request, res: Response) => {
    try {
      const { cartId } = req.body;

      if (!cartId) {
        return res.status(400).json({ message: 'cartId is required' });
      }

      const user = (req as any).user;
      const userName = user?.name;

      const order = await this.createOrderUseCase.execute({
        cartId,
        userName,
      });

      return res.status(201).json(order);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: (e as Error).message });
    }
  };

  getAll = async (_req: Request, res: Response) => {
    const orders = await this.getOrdersUseCase.execute();
    return res.json(orders);
  };
}
