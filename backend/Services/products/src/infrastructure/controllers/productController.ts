// src/infrastructure/controllers/productController.ts

import { Request, Response } from "express";

import { GetAllProducts } from "../../application/use-cases/GetAllProducts";
import { GetProductById } from "../../application/use-cases/GetProductById";
import { CreateProduct } from "../../application/use-cases/CreateProduct";
import { UpdateProduct } from "../../application/use-cases/UpdateProduct";
import { DeleteProduct } from "../../application/use-cases/DeleteProduct";
import { CreateProductDTO } from "../../application/dtos/CreateProductDTO";

import { PrismaProductRepository } from "../repositories/product.repository";
import { ProductRepository } from "../../domain/repositories/IProductRepository";

// ========================
// Instancias (repo real)
// ========================
const repo: ProductRepository = new PrismaProductRepository();

const getAllUC = new GetAllProducts(repo);
const getByIdUC = new GetProductById(repo);
const createUC = new CreateProduct(repo);
const updateUC = new UpdateProduct(repo);
const deleteUC = new DeleteProduct(repo);

// ========================
// Handlers
// ========================

export async function getAll(req: Request, res: Response) {
  const q = String(req.query.q ?? "").trim().toLowerCase();

  const products = await getAllUC.execute();

  if (!q) {
    return res.json(products);
  }

  const filtered = products.filter((p: any) => {
    const name = (p.name ?? "").toLowerCase();
    const desc = (p.description ?? "").toLowerCase();
    return name.includes(q) || desc.includes(q);
  });

  return res.json(filtered);
}

export async function getById(req: Request, res: Response) {
  const id = req.params.id as string;
  const p = await getByIdUC.execute(id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  return res.json(p);
}

export async function create(req: Request, res: Response) {
  const body = req.body as CreateProductDTO;

  if (!body.name || typeof body.name !== "string") {
    return res.status(400).json({ message: "name is required" });
  }

  if (body.price === undefined || body.price === null) {
    return res.status(400).json({ message: "price is required" });
  }

  // Normalizar imageUrl (placeholder si viene vacío)
  const normalizedImageUrl =
    typeof body.imageUrl === "string" && body.imageUrl.trim() !== ""
      ? body.imageUrl.trim()
      : "/plants/plant-placeholder.png";

  const dto: CreateProductDTO = {
    name: body.name,
    description: body.description ?? null,
    price: body.price,
    stock: body.stock ?? 0,
    type: body.type ?? "indoor",
    imageUrl: normalizedImageUrl,
  };

  const created = await createUC.execute(dto);
  res.status(201).json(created);
}

export async function update(req: Request, res: Response) {
  const id = req.params.id as string;
  const body = req.body as Partial<CreateProductDTO>;

  // La lógica de normalización (precio, imageUrl, etc.) ya está en el use-case
  const updated = await updateUC.execute({ id, ...body });
  if (!updated) return res.status(404).json({ message: "Product not found" });
  res.json(updated);
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id as string;

  try {
    const deleted = await deleteUC.execute(id);

    if (!deleted) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.status(200).send();
  } catch (err) {
    console.error("Error eliminando producto:", err);
    return res.status(500).json({ message: "Error eliminando producto" });
  }
}

// POST /products/:id/reserve  { quantity }
export async function reserve(req: Request, res: Response) {
  const id = req.params.id as string;
  const qty = Number(req.body?.quantity ?? 0);
  if (!(qty > 0))
    return res.status(400).json({ message: "quantity inválido" });

  const p = await getByIdUC.execute(id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  if ((p.stock ?? 0) < qty)
    return res.status(400).json({ message: "stock insuficiente" });

  const updated = await updateUC.execute({ id, stock: (p.stock ?? 0) - qty });
  return res.json({ ok: true, remaining: updated?.stock ?? 0 });
}

// POST /products/:id/release  { quantity }
export async function release(req: Request, res: Response) {
  const id = req.params.id as string;
  const qty = Number(req.body?.quantity ?? 0);
  if (!(qty > 0))
    return res.status(400).json({ message: "quantity inválido" });

  const p = await getByIdUC.execute(id);
  if (!p) return res.status(404).json({ message: "Product not found" });

  const updated = await updateUC.execute({ id, stock: (p.stock ?? 0) + qty });
  return res.json({ ok: true, remaining: updated?.stock ?? 0 });
}
