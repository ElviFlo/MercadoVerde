import CategoryModel from "../../infrastructure/CategoryModel";

export class GetCategoryById {
  async execute(id: string) {
    return await CategoryModel.findById(id);
  }
}
