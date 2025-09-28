// Services/products/src/main.ts
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

// ⬅️ ruta correcta del router
import productsRouter from "./infrastructure/routes/product.routes";

// Swagger (según tu árbol está en src/swagger)
import { setupSwagger } from "./infrastructure/swagger/product.swagger";

// Si usas PG más adelante
import { ensureSchema } from "./infrastructure/db/pg";

const app = express();

/* Middlewares base */
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/* Health & raíz */
app.get("/health", (_req: Request, res: Response) =>
  res.status(200).json({ ok: true, service: "products" })
);
app.get("/", (_req: Request, res: Response) =>
  res.json({ ok: true, service: "products" })
);

/* Rutas del dominio */
app.use("/products", productsRouter);

/* Swagger (/docs y /docs.json) */
setupSwagger(app);

/* 404 + error handler */
app.use((_req: Request, res: Response) => res.status(404).json({ message: "Not Found" }));
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[products] Unhandled error:", err);
  const status = typeof err?.status === "number" ? err.status : 500;
  res.status(status).json({ message: err?.message || "Internal Server Error" });
});

/* Arranque */
const PORT = Number(process.env.PORT) || 3003;
const server = app.listen(PORT, "0.0.0.0", async () => {
  // opcional: crea tablas si usas PG
  try { await ensureSchema?.(); } catch (e) { /* ignore si no usas PG */ }
  console.log(`[products] escuchando en http://0.0.0.0:${PORT}`);
});

/* Apagado limpio */
const shutdown = (signal: string) => {
  console.log(`[products] ${signal} recibido, cerrando servidor...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (r) => console.error("[products] Unhandled Rejection:", r));
process.on("uncaughtException", (e) => console.error("[products] Uncaught Exception:", e));
