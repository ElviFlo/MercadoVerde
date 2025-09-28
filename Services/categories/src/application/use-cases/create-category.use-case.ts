import { Category } from "../../domain/Category";
import CategoryModel from "../../infrastructure/models/CategoryModel";

export class CreateCategory {
  async execute(data: Category) {
    const categoria = new CategoryModel(data);
    return await categoria.save();
  }
}
