import express from "express";
import * as dotenv from "dotenv";
import orderRoutes from "./infrastructure/routes/order.routes";
import * as swaggerUi from "swagger-ui-express";
import { orderSwagger } from "./infrastructure/swagger/order.swagger";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/orders", orderRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(orderSwagger));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Orders service running on port ${PORT}`);
});
