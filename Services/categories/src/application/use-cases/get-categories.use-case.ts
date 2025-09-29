import CategoryModel from "../../infrastructure/CategoryModel";

export class GetCategories {
  async execute() {
    return await CategoryModel.find();
  }
}
