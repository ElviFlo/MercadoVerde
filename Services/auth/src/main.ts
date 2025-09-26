import * as express from "express";
import * as dotenv from "dotenv";
import authRoutes from "./infrastructure/routes/auth.routes";
import * as swaggerUi from "swagger-ui-express";
import { authSwagger } from "./infrastructure/swagger/auth.swagger";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(authSwagger));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
