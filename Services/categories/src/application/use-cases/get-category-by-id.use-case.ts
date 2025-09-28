import CategoryModel from "../../infrastructure/models/CategoryModel";

export class GetCategoryById {
  async execute(id: string) {
    return await CategoryModel.findById(id);
  }
}
