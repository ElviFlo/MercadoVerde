import { OrderItem } from "./order-item.entity";

export class Order {
  constructor(
    public id: string,
    public customerId: string,
    public items: OrderItem[],
    public status: string = "PENDING",
    public createdAt: Date = new Date()
  ) {}
}
