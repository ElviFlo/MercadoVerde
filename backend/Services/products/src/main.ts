// Services/products/src/main.ts
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

// Rutas del dominio
import productsRouter from "./infrastructure/routes/product.routes";

// Swagger
import { setupSwagger } from "./infrastructure/swagger/product.swagger";

// Si usas PG (opcional)
import { ensureSchema } from "./infrastructure/db/pg";

// 👉 NUEVO: seed inicial de productos
import { seedProductsIfEmpty } from "./infrastructure/seed/seedProducts";

const app = express();
const PORT = Number(process.env.PORT ?? 3003);

// Seguridad y parsers
app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Health público ----------
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, service: "products" });
});

// ---------- Swagger público ----------
setupSwagger(app);

// ---------- Rutas ----------
app.use("/products", productsRouter);

// 404 handler
app.use((_req, res) => res.status(404).json({ message: "Not found" }));

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[products] Error:", err);
  res
    .status(err?.status || 500)
    .json({ message: err?.message || "Internal Server Error" });
});

const server = app.listen(PORT, async () => {
  try {
    // Asegura que el schema exista (migraciones / CREATE TABLE, etc.)
    await ensureSchema?.();

    // 🔥 Seed de productos si la tabla está vacía
    await seedProductsIfEmpty();
  } catch (err) {
    console.error("[products] Error in startup tasks:", err);
  }

  console.log(
    `🟢 Products service running on http://localhost:${PORT}/docs/ with Swagger`,
  );
});

// Apagado limpio
const shutdown = (signal: string) => {
  console.log(`[products] ${signal} recibido, cerrando servidor...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (r) =>
  console.error("[products] Unhandled Rejection:", r),
);
process.on("uncaughtException", (e) =>
  console.error("[products] Uncaught Exception:", e),
);
