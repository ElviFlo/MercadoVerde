import CategoryModel from "../../infrastructure/CategoryModel";

// Category interface
interface Category {
  nombre: string;
  descripcion?: string;
  id?: string;
}

export class CreateCategory {
  async execute(data: Category) {
    const categoria = new CategoryModel(data);
    return await categoria.save();
  }
}
