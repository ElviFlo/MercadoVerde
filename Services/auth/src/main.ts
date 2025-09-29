// Services/auth/src/main.ts
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import authRouter from "./infrastructure/routes/auth.routes";
import { setupSwagger } from "./infrastructure/swagger/auth.swagger";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------- Health público --------
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, service: "auth" });
});

// -------- Swagger público (/docs y /docs.json) --------
setupSwagger(app);

// ❌ No apliques ningún guard global antes de Swagger o romperá /docs
// app.use(authenticateToken);

// -------- Rutas de Auth --------
app.use("/auth", authRouter);

// -------- 404 al final --------
app.use((_req, res) => res.status(404).json({ message: "Not found" }));

// -------- Manejo de errores --------
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[auth] Error:", err);
  res.status(err?.status || 500).json({ message: err?.message || "Internal Server Error" });
});

// -------- Arranque + shutdown limpio --------
const server = app.listen(PORT, () => {
  console.log(`[auth] escuchando en http://0.0.0.0:${PORT}`);
  console.log(`[auth] Swagger en http://localhost:${PORT}/docs`);
});

const shutdown = (signal: string) => {
  console.log(`[auth] ${signal} recibido, cerrando servidor...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (r) => console.error("[auth] Unhandled Rejection:", r));
process.on("uncaughtException", (e) => console.error("[auth] Uncaught Exception:", e));
