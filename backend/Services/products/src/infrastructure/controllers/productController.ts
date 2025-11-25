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

  // 1) Obtenemos todos los productos usando el use-case
  const products = await getAllUC.execute();

  // 2) Si no hay query, devolvemos todo
  if (!q) {
    return res.json(products);
  }

  // 3) Filtro simple en memoria por nombre o descripción
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
  const body = req.body as Omit<CreateProductDTO, "createdBy"> & {
    productCategoryId?: string | null;
    categoryId?: string | null;
    type?: string;
    imageUrl?: string | null;
  };

  // 🔹 Validación mínima para type (lo necesitas siempre)
  if (!body.type || typeof body.type !== "string") {
    return res.status(400).json({ message: "type is required" });
  }

  // Normalizamos el ID de categoría desde el body
  const productCategoryId =
    (body as any).productCategoryId ?? (body as any).categoryId ?? null;

  // 🔹 Default para imageUrl si no viene o viene vacío
  const normalizedImageUrl =
    body.imageUrl && body.imageUrl.trim() !== ""
      ? body.imageUrl
      : "/plants/plant-placeholder.png";

  const dto: CreateProductDTO = {
    name: body.name,
    description: (body as any).description ?? null,
    price: (body as any).price,

    // rellenamos ambos campos del DTO, pero internamente usaremos productCategoryId
    productCategoryId,
    categoryId: productCategoryId,

    createdBy: (req as any).user?.email ?? "unknown",
    active: (body as any).active,
    stock: (body as any).stock,

    // 🔹 Nuevos campos
    type: body.type,
    imageUrl: normalizedImageUrl,
  };

  const created = await createUC.execute(dto);
  res.status(201).json(created);
}

export async function update(req: Request, res: Response) {
  const id = req.params.id as string;
  const body = req.body as any;

  // Normalizar categoría también en update
  const mapped: any = {
    ...body,
  };

  if (mapped.productCategoryId == null && mapped.categoryId != null) {
    mapped.productCategoryId = mapped.categoryId;
  } else if (mapped.productCategoryId != null && mapped.categoryId == null) {
    mapped.categoryId = mapped.productCategoryId;
  }

  // 🔹 Normalizar imageUrl también aquí: si viene string vacío, usamos placeholder
  if (mapped.imageUrl !== undefined) {
    mapped.imageUrl =
      typeof mapped.imageUrl === "string" &&
      mapped.imageUrl.trim() === ""
        ? "/plants/plant-placeholder.png"
        : mapped.imageUrl;
  }

  const updated = await updateUC.execute({ id, ...mapped });
  if (!updated) return res.status(404).json({ message: "Product not found" });
  res.json(updated);
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id as string;

  try {
    const deleted = await deleteUC.execute(id);

    if (!deleted) {
      // producto no existe -> 404
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // se eliminó correctamente -> 200 (tu código actual usa 200, lo mantengo)
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

  // Decrement stock
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
