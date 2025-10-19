// Services/products/src/infrastructure/controllers/productController.ts
import { Request, Response } from "express";
import { ProductRepository } from "../../domain/repositories/IProductRepository";
import { CreateProduct } from "../../application/use-cases/CreateProduct";
import { GetAllProducts } from "../../application/use-cases/GetAllProducts";
import { GetProductById } from "../../application/use-cases/GetProductById";
import { UpdateProduct } from "../../application/use-cases/UpdateProduct";
import { DeleteProduct } from "../../application/use-cases/DeleteProduct";

// Instanciamos el repo en memoria (puedes cambiarlo luego a Postgres)
const repo = new ProductRepository();
const createUC = new CreateProduct(repo);
const getAllUC = new GetAllProducts(repo);
const getByIdUC = new GetProductById(repo);
const updateUC = new UpdateProduct(repo);
const deleteUC = new DeleteProduct(repo);

/**
 * ✅ Helper para determinar el actor (email o sub) desde el JWT.
 * Prefiere email si está presente; si no, usa sub. Si ninguno existe, usa "unknown".
 */
function getActor(req: Request): string {
  return req.user?.email || String(req.user?.sub || "unknown");
}

export async function create(req: Request, res: Response) {
  try {
    // Extraemos los datos del body
    const { name, description, price, categoryId } = req.body;

    // ✅ Agregamos quién creó el producto desde el JWT
    const createdBy = getActor(req);

    // Pasamos todos los datos al caso de uso
    const product = await createUC.execute({
      name,
      description,
      price,
      categoryId,
      createdBy, // 👈 Nuevo campo que llegará al repositorio
    });

    res.status(201).json(product);
  } catch (err: any) {
    console.error("[createProduct] Error:", err);
    res.status(400).json({ message: err.message });
  }
}

export async function getAll(_req: Request, res: Response) {
  const products = await getAllUC.execute();
  res.json(products);
}

export async function getById(req: Request, res: Response) {
  try {
    const product = await getByIdUC.execute(req.params.id);
    res.json(product);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const dto = { id: req.params.id, ...req.body };

    // (Opcional) podrías agregar quién actualizó si agregas un campo updatedBy en tu modelo:
    // dto.updatedBy = getActor(req);

    const product = await updateUC.execute(dto);
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await deleteUC.execute(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}
