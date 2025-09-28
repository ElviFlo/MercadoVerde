import { Request, Response, Router } from "express";
import { InMemoryProductRepository } from "../repositories/product.repository.impl";
import { CreateProduct } from "../../application/use-cases/CreateProduct";
import { GetAllProducts } from "../../application/use-cases/GetAllProducts";
import { GetProductById } from "../../application/use-cases/GetProductById";
import { UpdateProduct } from "../../application/use-cases/UpdateProduct";
import { DeleteProduct } from "../../application/use-cases/DeleteProduct";
import { authenticateToken } from "../middlewares/AuthMiddleware";



// Repo + casos de uso
const repo = new InMemoryProductRepository();
const createProduct = new CreateProduct(repo);
const getAllProducts = new GetAllProducts(repo);
const getByIdUseCase = new GetProductById(repo);
const updateProduct = new UpdateProduct(repo);
const deleteProduct = new DeleteProduct(repo);

/** Helper: extrae el userId del payload del JWT */
function getUserIdFromReq(req: Request): string | undefined {
  const u: any = (req as any).user;
  return u?.sub ?? u?.id ?? u?.userId ?? u?.username; // adapta a tu payload real
}



export const create = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body ?? {};
    if (!name || price === undefined || price === null || isNaN(Number(price))) {
      return res.status(400).json({ message: "name y price son requeridos (price debe ser numérico)" });
    }
    const createdBy = getUserIdFromReq(req) ?? "unknown";
    const dto = {
      name: String(name).trim(),
      description: description != null ? String(description) : undefined,
      price: Number(price),
      createdBy,
    };
    const product = await createProduct.execute(dto);
    return res.status(201).json(product);
  } catch (err: any) {
    return res.status(400).json({ message: err?.message || "Bad request" });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  const products = await getAllProducts.execute();
  return res.json(products);
};

export const getById = async (req: Request, res: Response) => {
  try {
    const product = await getByIdUseCase.execute(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    return res.json(product);
  } catch (err: any) {
    return res.status(404).json({ message: err?.message || "Producto no encontrado" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body ?? {};
    const dto: any = { id: req.params.id };
    if (name !== undefined) dto.name = String(name).trim();
    if (description !== undefined) dto.description = description != null ? String(description) : null;
    if (price !== undefined) {
      if (isNaN(Number(price))) {
        return res.status(400).json({ message: "price debe ser numérico" });
      }
      dto.price = Number(price);
    }
    const product = await updateProduct.execute(dto);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    return res.json(product);
  } catch (err: any) {
    return res.status(400).json({ message: err?.message || "Bad request" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await deleteProduct.execute(req.params.id);
    return res.status(204).send();
  } catch (err: any) {
    return res.status(404).json({ message: err?.message || "Producto no encontrado" });
  }
};
/** Crear producto (requiere token) */
/** Listar todos (público o protégelo si quieres) */
/** Obtener por id (público o protégelo si quieres) */
/** Actualizar (requiere token) */
/** Eliminar (requiere token) */


