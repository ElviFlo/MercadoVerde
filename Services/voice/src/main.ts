import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { setupSwagger } from "./infrastructure/swagger/voice.swagger";
import voiceRouter from "./infrastructure/routes/kora.routes";

const app = express();
const PORT = Number(process.env.PORT ?? 3006);

// Middlewares
app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, service: "voice" });
});

// Swagger
setupSwagger(app);

// Rutas principales
app.use("/voice", voiceRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[voice] Error:", err);
  res.status(err?.status || 500).json({ message: err?.message || "Internal Server Error" });
});

// Servidor
const server = app.listen(PORT, () => {
  console.log(`[voice] escuchando en http://0.0.0.0:${PORT}`);
  console.log(`[voice] Swagger montado en http://localhost:${PORT}/docs`);
});

// Shutdown limpio
const shutdown = (signal: string) => {
  console.log(`[voice] ${signal} recibido, cerrando servidor...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (r) => console.error("[voice] Unhandled Rejection:", r));
process.on("uncaughtException", (e) => console.error("[voice] Uncaught Exception:", e));
