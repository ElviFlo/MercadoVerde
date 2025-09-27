import express from "express";
import * as dotenv from "dotenv";
import productRoutes from "./infrastructure/routes/product.routes";
import * as swaggerUi from "swagger-ui-express";
import { productSwagger } from "./infrastructure/swagger/product.swagger";

dotenv.config();
const app = express();


app.use(express.json());
app.use("/products", productRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(productSwagger));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Products service running on port ${PORT}`);
});
