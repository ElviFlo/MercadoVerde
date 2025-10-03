import "dotenv/config";
import express from "express";
import cors from "cors";
import { setupSwagger } from "./infrastructure/swagger/product.swagger";
import productRouter from "./infrastructure/controllers/productController";

const app = express();
const PORT = Number(process.env.PORT ?? 3003);

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.get("/health", (_req, res) => res.json({ ok: true, service: "products" }));
app.use(productRouter);
app.use((_req, res) => res.status(404).json({ message: "Not found" }));

app.listen(PORT, () => console.log(`service running on http://localhost:${PORT}/docs with Swagger`));
