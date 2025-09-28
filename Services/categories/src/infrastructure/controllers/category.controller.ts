import { Request, Response } from "express";
import { CreateCategory } from "../../application/use-cases/create-category.use-case";
import { GetCategories } from "../../application/use-cases/get-categories.use-case";
import { GetCategoryById } from "../../application/use-cases/get-category-by-id.use-case";
import { UpdateCategory } from "../../application/use-cases/update-category.use-case";
import { DeleteCategory } from "../../application/use-cases/delete-category.use-case";

export class CategoryController {
  async create(req: Request, res: Response) {
    try {
      const useCase = new CreateCategory();
      const categoria = await useCase.execute(req.body);
      res.status(201).json(categoria);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async getAll(_req: Request, res: Response) {
    const useCase = new GetCategories();
    res.json(await useCase.execute());
  }

  async getById(req: Request, res: Response) {
    const useCase = new GetCategoryById();
    const categoria = await useCase.execute(req.params.id);
    categoria ? res.json(categoria) : res.status(404).json({ msg: "No encontrada" });
  }

  async update(req: Request, res: Response) {
    const useCase = new UpdateCategory();
    const categoria = await useCase.execute(req.params.id, req.body);
    categoria ? res.json(categoria) : res.status(404).json({ msg: "No encontrada" });
  }

  async delete(req: Request, res: Response) {
    const useCase = new DeleteCategory();
    const categoria = await useCase.execute(req.params.id);
    categoria ? res.json({ msg: "Eliminada" }) : res.status(404).json({ msg: "No encontrada" });
  }
}
