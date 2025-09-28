import { Category } from "../../domain/Category";
import CategoryModel from "../../infrastructure/models/CategoryModel";

export class UpdateCategory {
  async execute(id: string, data: Category) {
    return await CategoryModel.findByIdAndUpdate(id, data, { new: true });
  }
}
