// Services/orders/src/main.ts
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

// 👉 importa tu router
import ordersRouter from "./infrastructure/routes/order.routes";

// 👉 importa y monta swagger (si ya tienes orderSwagger + setupSwagger)
import { setupSwagger } from "./infrastructure/swagger/order.swagger";

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

// Swagger (público)
setupSwagger(app); // expone /docs y /docs.json

// 🔥 MONTA EL ROUTER DE ORDERS con prefijo correcto
app.use("/orders", ordersRouter);
// Si quisieras /api/orders, sería: app.use("/api", ordersRouter);

// 404
app.use((_req, res) => res.status(404).json({ message: "Not found" }));

// Errores
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[orders] Error:", err);
  res.status(err?.status || 500).json({ message: err?.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🟢 Orders service running on http://localhost:${PORT}/docs/ with Swagger`);
});
