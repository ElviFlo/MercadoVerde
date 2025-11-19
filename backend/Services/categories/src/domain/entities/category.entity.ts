export class Category {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public parentId: string | null = null,
    public active: boolean = true,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
