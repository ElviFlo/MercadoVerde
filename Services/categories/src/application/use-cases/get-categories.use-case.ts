import CategoryModel from "../../infrastructure/models/CategoryModel";

export class GetCategories {
  async execute() {
    return await CategoryModel.find();
  }
}
