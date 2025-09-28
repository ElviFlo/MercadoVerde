import CategoryModel from "../../infrastructure/models/CategoryModel";

export class DeleteCategory {
  async execute(id: string) {
    return await CategoryModel.findByIdAndDelete(id);
  }
}
