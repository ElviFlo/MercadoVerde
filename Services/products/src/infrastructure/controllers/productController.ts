import { Request, Response, Router } from "express";
import { InMemoryProductRepository } from "../repositories/product.repository.impl";
import { CreateProduct } from "../../application/use-cases/CreateProduct";
import { GetAllProducts } from "../../application/use-cases/GetAllProducts";
import { GetProductById} from "../../application/use-cases/GetProductById";
import { UpdateProduct } from "../../application/use-cases/UpdateProduct";
import { DeleteProduct } from "../../application/use-cases/DeleteProduct";
import { authenticateToken } from "../middlewares/AuthMiddleware";

const router = Router();

const repo = new InMemoryProductRepository();
const create = new CreateProduct(repo);
const getAllProducts = new GetAllProducts(repo);
const getById = new GetProductById(repo);
const update = new UpdateProduct(repo);
const deleteCase = new DeleteProduct(repo);

// Create
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const product = await create.execute(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// List all
router.get("/", async (_req: Request, res: Response) => {
  const products = await getAllProducts.execute();
  res.json(products);
});

// Get by id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await getById.execute(req.params.id);
    res.json(product);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
});

// Update
router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const dto = { id: req.params.id, ...req.body };
    const product = await update.execute(dto);
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Delete
router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    await deleteCase.execute(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
});

export default router;
