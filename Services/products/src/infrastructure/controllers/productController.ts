import { Request, Response } from "express";

import { GetAllProducts } from "../../application/use-cases/GetAllProducts";
import { GetProductById } from "../../application/use-cases/GetProductById";
import { CreateProduct } from "../../application/use-cases/CreateProduct";
import { UpdateProduct } from "../../application/use-cases/UpdateProduct";
import { DeleteProduct } from "../../application/use-cases/DeleteProduct";
import { CreateProductDTO } from "../../application/dtos/CreateProductDTO";
import { InMemoryProductRepository } from "../repositories/product.repository.impl";

// Simple wiring for the demo: construct repo + use-cases here. In a real app you'd use DI.
const repo = new InMemoryProductRepository();
const getAllUC = new GetAllProducts(repo as any);
const getByIdUC = new GetProductById(repo as any);
const createUC = new CreateProduct(repo as any);
const updateUC = new UpdateProduct(repo as any);
const deleteUC = new DeleteProduct(repo as any);

export async function getAll(_req: Request, res: Response) {
  const products = await getAllUC.execute();
  res.json(products);
}

export async function getById(req: Request, res: Response) {
  const id = req.params.id as string;
  const p = await getByIdUC.execute(id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  return res.json(p);
}

export async function create(req: Request, res: Response) {
  const body = req.body as Omit<CreateProductDTO, "createdBy">;
  const dto: CreateProductDTO = {
    name: body.name,
    description: (body as any).description ?? null,
    price: (body as any).price,
    categoryId: (body as any).categoryId ?? null,
    createdBy: (req as any).user?.email ?? "unknown",
    active: (body as any).active,
    stock: (body as any).stock,
  };
  const created = await createUC.execute(dto);
  res.status(201).json(created);
}

export async function update(req: Request, res: Response) {
  const id = req.params.id as string;
  const body = req.body as any;
  const updated = await updateUC.execute({ id, ...body });
  if (!updated) return res.status(404).json({ message: "Product not found" });
  res.json(updated);
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id as string;
  const ok = await deleteUC.execute(id);
  res.json({ ok });
}
