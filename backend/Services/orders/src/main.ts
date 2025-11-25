// Services/orders/src/main.ts
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import { orderRoutes } from "./infrastructure/routes/order.routes";
import { setupSwagger } from "./infrastructure/swagger/order.swagger";
import { OrdersController } from "./infrastructure/controllers/order.controller";

const app = express();
const PORT = Number(process.env.PORT ?? 3002);

// Middlewares base
app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, service: "orders" });
});

// Swagger
setupSwagger(app);

// ----- Rutas de Orders -----
const ordersController = new OrdersController();
const ordersRouter = orderRoutes(ordersController);

app.use("/orders", ordersRouter);

// 404
app.use((_req, res) => res.status(404).json({ message: "Not found" }));

// Manejo de errores
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[orders] Error:", err);
  res
    .status(err?.status || 500)
    .json({ message: err?.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(
    `🟢 Orders service running on http://localhost:${PORT}/docs/ with Swagger`
  );
});
