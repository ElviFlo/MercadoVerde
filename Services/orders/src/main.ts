// Services/orders/src/main.ts
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import orderRouter from "./infrastructure/routes/order.routes";
import { setupSwagger } from "./infrastructure/swagger/order.swagger";
// import { authenticateToken } from "./infrastructure/middlewares/auth.middleware";

const app = express();
const PORT = Number(process.env.PORT ?? 3002);

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health público
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, service: "orders" });
});

// Swagger público en /docs y /docs.json
setupSwagger(app);

// Si quieres proteger el resto con JWT, activa el guard a partir de aquí
// app.use(authenticateToken);

// Rutas del servicio
app.use("/orders", /* authenticateToken, */ orderRouter);

// 404
app.use((_req, res) => res.status(404).json({ message: "Not found" }));

// Errores
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[orders] Error:", err);
  res.status(err?.status || 500).json({ message: err?.message || "Internal Server Error" });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`[orders] listening on http://0.0.0.0:${PORT}`);
  console.log(`[orders] Swagger: http://localhost:${PORT}/docs`);
});

const shutdown = (signal: string) => {
  console.log(`[orders] ${signal} received, closing...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (r) => console.error("[orders] Unhandled Rejection:", r));
process.on("uncaughtException", (e) => console.error("[orders] Uncaught Exception:", e));
