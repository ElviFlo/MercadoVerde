// Services/auth/src/main.ts
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import authRouter from "./infrastructure/routes/auth.routes";
import { setupSwagger } from "./infrastructure/swagger/auth.swagger";
import { ensureSingleAdmin } from "./infrastructure/bootstrap/admin.bootstrap";

import { startAuthGrpcServer } from "./infrastructure/grpc/auth.grpc"; // 👈 NUEVO

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, service: "auth" });
});

setupSwagger(app);

// Rutas de Auth
app.use("/auth", authRouter);

// 404
app.use((_req, res) => res.status(404).json({ message: "Not found" }));

// Errores
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[auth] Error:", err);
  res
    .status(err?.status || 500)
    .json({ message: err?.message || "Internal Server Error" });
});

// Arranque con bootstrap de admin
const server = app.listen(PORT, async () => {
  try {
    await ensureSingleAdmin();
+   await startAuthGrpcServer(); // 👈 Levanta gRPC en paralelo al HTTP
  } catch (e) {
    console.error("[auth] Error durante bootstrap:", e);
  }
  console.log(`🟢 Auth service running on http://localhost:${PORT}/docs with Swagger`);
});

const shutdown = (signal: string) => {
  console.log(`[auth] ${signal} recibido, cerrando servidor...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (r) =>
  console.error("[auth] Unhandled Rejection:", r),
);
process.on("uncaughtException", (e) =>
  console.error("[auth] Uncaught Exception:", e),
);
