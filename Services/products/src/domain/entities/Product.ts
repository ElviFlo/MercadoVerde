export class Product {
  constructor(
    public id: string,
    public name: string,
    public description: string | null,
    public price: number,
    public stock: number,
    public createdAt: Date = new Date(),
    public updatedAt?: Date
  ) {}
}
