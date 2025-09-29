import CategoryModel from "../../infrastructure/CategoryModel";

export class DeleteCategory {
  async execute(id: string) {
    return await CategoryModel.findByIdAndDelete(id);
  }
}
