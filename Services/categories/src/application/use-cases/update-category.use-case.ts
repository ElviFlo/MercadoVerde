import CategoryModel from "../../infrastructure/CategoryModel";

// Category interface
interface Category {
  nombre: string;
  descripcion?: string;
  id?: string;
}

export class UpdateCategory {
  async execute(id: string, data: Category) {
    return await CategoryModel.findByIdAndUpdate(id, data, { new: true });
  }
}
