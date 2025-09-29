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

// Si tienes un middleware de auth a nivel app, IMPORTALO pero NO LO APLIQUES a /health
// import { authenticateToken } from "./infrastructure/middlewares/authenticateToken";

const app = express();
const PORT = Number(process.env.PORT ?? 3003);

// Seguridad y parsers
app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- ENDPOINT PÚBLICO PARA HEALTHCHECK (SIN JWT) ----------
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, service: "products" });
});

// Swagger (si quieres público para probar en local, déjalo tal cual)
setupSwagger(app);

// Si quieres proteger TODO lo demás con JWT a nivel app, aplica el middleware DESPUÉS de /health y Swagger
// app.use(authenticateToken);

// Rutas del servicio
app.use("/products", /* authenticateToken, */ productsRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[products] Error:", err);
  res.status(err?.status || 500).json({ message: err?.message || "Internal Server Error" });
});

const server = app.listen(PORT, async () => {
  try {
    await ensureSchema?.(); // si no usas PG, no pasa nada
  } catch (_e) {
    // ignora si no tienes DB todavía
  }
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
