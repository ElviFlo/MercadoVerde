// Services/orders/src/infrastructure/swagger/order.swagger.ts
import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { orderSwagger } from "./order.definition";

export function setupSwagger(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(orderSwagger));
  // Si quieres también el JSON crudo:
  app.get("/docs.json", (_req, res) => res.json(orderSwagger));
}
