// Services/auth/src/main.ts
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./infrastructure/routes/auth.routes";
import { setupSwagger } from "./infrastructure/swagger/auth.swagger"; // <= ruta correcta

const app = express();

/* Middlewares base */
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/* Health & root */
app.get("/health", (_req: Request, res: Response) =>
  res.status(200).json({ ok: true, service: "auth" })
);
app.get("/", (_req: Request, res: Response) =>
  res.json({ ok: true, service: "auth" })
);

/* Rutas */
app.use("/auth", authRoutes);

/* Swagger (/docs) */
setupSwagger(app);

/* 404 y error handler */
app.use((_req: Request, res: Response) => res.status(404).json({ message: "Not Found" }));
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[auth] Unhandled error:", err);
  res
    .status(typeof err?.status === "number" ? err.status : 500)
    .json({ message: err?.message || "Internal Server Error" });
});

/* Arranque */
const PORT = Number(process.env.PORT) || 3001;
const server = app.listen(PORT, "0.0.0.0", () =>
  console.log(`[auth] escuchando en http://0.0.0.0:${PORT}`)
);

/* Apagado limpio + errores no controlados */
const shutdown = (signal: string) => {
  console.log(`[auth] ${signal} recibido, cerrando servidor...`);
  server.close(() => {
    console.log("[auth] servidor cerrado.");
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (r) => console.error("[auth] Unhandled Rejection:", r));
process.on("uncaughtException", (e) => console.error("[auth] Uncaught Exception:", e));
