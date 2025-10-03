import { Router, Request, Response } from "express";
import InMemoryProductRepository from "../repositories/product.repository.impl";
import { CreateProduct } from "../../application/use-cases/CreateProduct";

const repo = new InMemoryProductRepository();
const createUC = new CreateProduct(repo);
const router = Router();

router.get("/products", async (_req: Request, res: Response) => {
  const items = await repo.findAll();
  res.json(items);
});

router.get("/products/:id", async (req, res) => {
  const item = await repo.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "No encontrado" });
  res.json(item);
});

router.post("/products", async (req, res) => {
  const { name, price, description, stock } = req.body ?? {};
  if (typeof name !== "string" || typeof price !== "number") {
    return res.status(400).json({ message: "name (string) y price (number) son requeridos" });
  }
  const created = await createUC.execute({ name, price, description, stock });
  res.status(201).json(created);
});

router.put("/products/:id", async (req, res) => {
  const updated = await repo.update(req.params.id, req.body ?? {});
  if (!updated) return res.status(404).json({ message: "No encontrado" });
  res.json(updated);
});

router.delete("/products/:id", async (req, res) => {
  const ok = await repo.delete(req.params.id);
  if (!ok) return res.status(404).json({ message: "No encontrado" });
  res.status(204).send();
});

export default router;
